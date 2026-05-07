/**
 * GET /api/v1/credits
 * 
 * Check a user's credit balance.
 * Called by external apps before showing the "Generate" button.
 * 
 * Headers:
 *   Authorization: Bearer <api_key>
 *   X-User-Token: <supabase_jwt>
 */

import { NextResponse } from 'next/server';
import { verifyApiKey, verifyUserToken, apiError } from '../../../../lib/api-auth';

// Allow cross-origin requests from registered apps
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, X-User-Token, Content-Type',
    },
  });
}

export async function GET(request) {
  try {
    // 1. Extract credentials from headers
    const authHeader = request.headers.get('Authorization') || '';
    const apiKey = authHeader.replace('Bearer ', '').trim();
    const userToken = request.headers.get('X-User-Token');

    // 2. Verify API key
    const { app } = await verifyApiKey(apiKey);

    // 3. Verify user token
    const { user } = await verifyUserToken(userToken);

    // 4. Return credit info
    return NextResponse.json(
      {
        ok: true,
        credits: user.credits,
        tier: user.subscriptionTier,
        userId: user.id,
        // Helper for the app to know if user can afford a given cost
        canAfford: (cost) => user.credits >= cost,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    if (err.status) {
      return apiError(err.status, err.error, err.message);
    }
    console.error('[v1/credits] Error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  }
}
