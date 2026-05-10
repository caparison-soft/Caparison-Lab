/**
 * GET /api/v1/pricing
 * 
 * Returns the pricing configuration for an app.
 * Called by external apps to fetch their dynamic pricing rules.
 * 
 * Headers:
 *   Authorization: Bearer <api_key>
 * 
 * Response:
 * {
 *   ok: true,
 *   defaultCost: 10,
 *   maxCost: 50,
 *   isFree: false,
 *   pricingRules: { "1": 3, "3": 5, "5": 8, "10": 15, "15": 25 },
 *   pricingLabels: { "1": "1-min script", "3": "3-min script", ... }
 * }
 */

import { NextResponse } from 'next/server';
import { verifyApiKey, apiError } from '../../../../lib/api-auth';

// Allow cross-origin requests from registered apps
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}

export async function GET(request) {
  try {
    // 1. Extract API key from header
    const authHeader = request.headers.get('Authorization') || '';
    const apiKey = authHeader.replace('Bearer ', '').trim();

    // 2. Verify API key → get the App record
    const { app } = await verifyApiKey(apiKey);

    // 3. Extract pricing config from configJson
    const config = app.configJson || {};

    return NextResponse.json(
      {
        ok: true,
        appName: app.name,
        defaultCost: app.creditCost,
        maxCost: config.maxCreditCost || app.creditCost * 5,
        isFree: app.isFree,
        pricingMode: config.pricingMode || 'fixed',
        pricingRules: config.pricingRules || null,
        pricingLabels: config.pricingLabels || null,
        pricingComponents: config.pricingComponents || null,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
        },
      }
    );
  } catch (err) {
    if (err.status) {
      return apiError(err.status, err.error, err.message);
    }
    console.error('[v1/pricing] Error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  }
}
