/**
 * POST /api/v1/use
 * 
 * The core endpoint. Called by external apps when a user wants to generate something.
 * This endpoint atomically:
 *   1. Verifies the API key and user token
 *   2. Checks the user has enough credits
 *   3. Deducts credits (atomic DB transaction)
 *   4. Creates a Generation record (status: PROCESSING)
 *   5. Returns the generationId for tracking
 * 
 * Body:
 * {
 *   "apiKey": "cap_sk_...",
 *   "userToken": "<supabase_jwt>",
 *   "inputData": { "prompt": "..." },   // any object, stored as-is
 *   "creditCost": 10                    // optional — defaults to app's creditCost
 * }
 */

import { NextResponse } from 'next/server';
import { verifyApiKey, verifyUserToken, apiError } from '../../../../lib/api-auth';
import { prisma } from '../../../../lib/prisma';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, X-User-Token, Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey, userToken, inputData = {}, creditCost: overrideCost } = body;

    // 1. Verify API key → get the App record
    const { app } = await verifyApiKey(apiKey);

    // 2. Verify user token → get the User record
    const { user } = await verifyUserToken(userToken);

    // 3. Determine credit cost
    const creditCost = overrideCost !== undefined ? overrideCost : app.creditCost;

    // 3.5 Safety check — reject if cost exceeds app's max allowed
    const appConfig = app.configJson || {};
    const maxCost = appConfig.maxCreditCost || app.creditCost * 5;
    if (creditCost > maxCost) {
      return NextResponse.json(
        {
          ok: false,
          error: 'COST_EXCEEDS_LIMIT',
          message: `Requested cost (${creditCost}) exceeds maximum allowed (${maxCost}).`,
        },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 3.6 Validate against pricing rules (only in 'fixed' mode)
    const pricingMode = appConfig.pricingMode || 'fixed';
    const rules = appConfig.pricingRules;
    if (pricingMode === 'fixed' && rules && overrideCost !== undefined) {
      const validCosts = Object.values(rules).map(Number);
      if (!validCosts.includes(creditCost)) {
        return NextResponse.json(
          {
            ok: false,
            error: 'INVALID_COST',
            message: `Cost ${creditCost} is not a valid pricing option for this app.`,
          },
          { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }
    }
    // In 'components' mode, the app calculates cost from component data.
    // Only the maxCreditCost cap (checked above in 3.5) prevents abuse.

    // 4. Check if the app is free or user has enough credits
    const isFreeAction = app.isFree || creditCost === 0;
    if (!isFreeAction && user.credits < creditCost) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INSUFFICIENT_CREDITS',
          message: 'User does not have enough credits for this action.',
          required: creditCost,
          available: user.credits,
        },
        { status: 402, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 5. Atomic: deduct credits + create generation record
    const [generation] = await prisma.$transaction([
      // Create generation record
      prisma.generation.create({
        data: {
          userId: user.id,
          appId: app.id,
          inputData,
          status: 'PROCESSING',
          creditsUsed: isFreeAction ? 0 : creditCost,
        },
      }),
      // Deduct credits (skip if free)
      ...(isFreeAction
        ? []
        : [
            prisma.user.update({
              where: { id: user.id },
              data: { credits: { decrement: creditCost } },
            }),
            prisma.transaction.create({
              data: {
                userId: user.id,
                appId: app.id,
                type: 'CREDIT_DEDUCTION',
                creditsAmount: -creditCost,
                description: `Used ${app.name}: ${creditCost} credits`,
              },
            }),
            prisma.app.update({
              where: { id: app.id },
              data: { usageCount: { increment: 1 } },
            }),
          ]),
    ]);

    // 6. Return generationId + remaining credits
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { credits: true },
    });

    return NextResponse.json(
      {
        ok: true,
        generationId: generation.id,
        creditsDeducted: isFreeAction ? 0 : creditCost,
        remainingCredits: updatedUser.credits,
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    if (err.status) {
      return apiError(err.status, err.error, err.message);
    }
    console.error('[v1/use] Error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  }
}
