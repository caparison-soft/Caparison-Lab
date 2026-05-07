/**
 * POST /api/v1/complete
 * 
 * Called by external apps when a generation finishes (success or failure).
 * If the generation FAILED, credits are automatically refunded.
 * 
 * Body:
 * {
 *   "apiKey": "cap_sk_...",
 *   "generationId": "uuid",
 *   "outputUrl": "https://...",    // optional, null if failed
 *   "status": "COMPLETED" | "FAILED",
 *   "metadata": {}                 // optional extra data, stored in inputData
 * }
 */

import { NextResponse } from 'next/server';
import { verifyApiKey, apiError } from '../../../../lib/api-auth';
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
    const { apiKey, generationId, outputUrl, status, metadata } = body;

    // 1. Verify API key
    await verifyApiKey(apiKey);

    // 2. Find the generation record
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
      include: { app: true },
    });

    if (!generation) {
      return apiError(404, 'GENERATION_NOT_FOUND', 'No generation found with this ID.');
    }

    if (generation.status === 'COMPLETED' || generation.status === 'FAILED') {
      return apiError(409, 'ALREADY_COMPLETED', 'This generation has already been finalized.');
    }

    const validStatus = ['COMPLETED', 'FAILED'];
    if (!validStatus.includes(status)) {
      return apiError(400, 'INVALID_STATUS', `Status must be one of: ${validStatus.join(', ')}`);
    }

    // 3. Merge metadata into the stored inputData if provided
    const updatedInputData = metadata
      ? { ...generation.inputData, _metadata: metadata }
      : generation.inputData;

    // 4. Update the generation
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status,
        outputUrl: outputUrl || null,
        inputData: updatedInputData,
      },
    });

    // 5. If FAILED, refund credits
    if (status === 'FAILED' && generation.creditsUsed > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: generation.userId },
          data: { credits: { increment: generation.creditsUsed } },
        }),
        prisma.transaction.create({
          data: {
            userId: generation.userId,
            appId: generation.appId,
            type: 'REFUND',
            creditsAmount: generation.creditsUsed,
            description: `Refund for failed generation in ${generation.app.name}`,
          },
        }),
      ]);
    }

    return NextResponse.json(
      {
        ok: true,
        generationId,
        status,
        refunded: status === 'FAILED' ? generation.creditsUsed : 0,
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    if (err.status) {
      return apiError(err.status, err.error, err.message);
    }
    console.error('[v1/complete] Error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  }
}
