/**
 * Caparison Lab — API Authentication Helpers
 * Used by /api/v1/* endpoints to verify API keys and user tokens
 */

import { createHash } from 'crypto';
import { prisma } from './prisma';
import { createServerClient } from '@supabase/ssr';

/**
 * Hash a plain API key for secure storage/comparison
 */
export function hashApiKey(plainKey) {
  return createHash('sha256').update(plainKey).digest('hex');
}

/**
 * Generate a new API key with prefix
 * Returns { plainKey, keyHash, keyPrefix }
 */
export function generateApiKey() {
  const randomBytes = Array.from({ length: 32 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('');
  const plainKey = `cap_sk_${randomBytes}`;
  const keyHash = hashApiKey(plainKey);
  const keyPrefix = plainKey.substring(0, 14) + '...';
  return { plainKey, keyHash, keyPrefix };
}

/**
 * Verify an API key and return the associated App
 * Returns { app } or throws with error message
 */
export async function verifyApiKey(apiKey) {
  if (!apiKey) {
    throw { status: 401, error: 'MISSING_API_KEY', message: 'API key is required.' };
  }

  const keyHash = hashApiKey(apiKey);
  const record = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { app: true },
  });

  if (!record) {
    throw { status: 401, error: 'INVALID_API_KEY', message: 'Invalid API key.' };
  }

  if (!record.isActive) {
    throw { status: 403, error: 'KEY_REVOKED', message: 'This API key has been revoked.' };
  }

  if (!record.app.isActive) {
    throw { status: 403, error: 'APP_INACTIVE', message: 'This app is currently disabled.' };
  }

  // Update lastUsedAt (non-blocking)
  prisma.apiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() },
  }).catch(() => {});

  return { app: record.app, apiKeyRecord: record };
}

/**
 * Verify a Supabase user JWT and return the DB user
 * Returns { user } or throws with error message
 */
export async function verifyUserToken(userToken) {
  if (!userToken) {
    throw { status: 401, error: 'MISSING_USER_TOKEN', message: 'User token is required.' };
  }

  // Verify with Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { getAll: () => [] },
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    }
  );

  const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(userToken);

  if (error || !supabaseUser) {
    throw { status: 401, error: 'INVALID_USER_TOKEN', message: 'Invalid or expired user token.' };
  }

  // Get from Prisma DB
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  if (!dbUser) {
    throw { status: 404, error: 'USER_NOT_FOUND', message: 'User not found in platform database.' };
  }

  return { user: dbUser };
}

/**
 * Build a standardized API error response
 */
export function apiError(status, code, message) {
  return Response.json({ ok: false, error: code, message }, { status });
}
