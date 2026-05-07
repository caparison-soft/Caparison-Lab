/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         CAPARISON LAB — External App SDK                ║
 * ║  Copy this file into any external app to integrate      ║
 * ║  credit deduction, generation logging, and user auth.   ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * SETUP:
 * 1. Add to your external app's .env:
 *    CAPARISON_API_KEY=cap_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *    CAPARISON_BASE_URL=https://caparison.io
 *
 * 2. Copy this file to your app as lib/caparison.js
 *
 * USAGE EXAMPLE:
 *
 *   import { useCredits, completeGeneration, getCredits } from './caparison';
 *
 *   // In your generate route (server-side only):
 *   const { ok, generationId, error } = await useCredits({
 *     userToken: supabaseJwt,
 *     inputData: { prompt: "a cat on a moon" },
 *     creditCost: 10,
 *   });
 *
 *   if (!ok) return Response.json({ error }, { status: 402 });
 *
 *   const result = await yourAIModel(prompt);
 *
 *   await completeGeneration({
 *     generationId,
 *     outputUrl: result.url,
 *     status: 'COMPLETED',
 *   });
 */

const CAPARISON_BASE_URL = process.env.CAPARISON_BASE_URL || 'https://caparison.io';
const CAPARISON_API_KEY = process.env.CAPARISON_API_KEY;

if (!CAPARISON_API_KEY) {
  console.warn('[caparison-sdk] Warning: CAPARISON_API_KEY is not set in environment variables.');
}

/**
 * Check a user's credit balance before generating.
 * Call this to show the user their balance or disable the Generate button.
 *
 * @param {string} userToken - Supabase JWT from the logged-in user
 * @returns {{ ok: boolean, credits: number, tier: string, error?: string }}
 */
export async function getCredits(userToken) {
  try {
    const res = await fetch(`${CAPARISON_BASE_URL}/api/v1/credits`, {
      headers: {
        Authorization: `Bearer ${CAPARISON_API_KEY}`,
        'X-User-Token': userToken,
      },
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    return { ok: false, error: 'NETWORK_ERROR', message: err.message };
  }
}

/**
 * Use credits for a generation. Call this BEFORE running your AI model.
 * This atomically deducts credits and creates a Generation record.
 *
 * @param {{ userToken: string, inputData: object, creditCost?: number }} options
 * @returns {{ ok: boolean, generationId?: string, remainingCredits?: number, error?: string }}
 */
export async function useCredits({ userToken, inputData = {}, creditCost }) {
  try {
    const body = { apiKey: CAPARISON_API_KEY, userToken, inputData };
    if (creditCost !== undefined) body.creditCost = creditCost;

    const res = await fetch(`${CAPARISON_BASE_URL}/api/v1/use`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    return { ok: false, error: 'NETWORK_ERROR', message: err.message };
  }
}

/**
 * Mark a generation as complete or failed.
 * Call this AFTER your AI model finishes (success OR failure).
 * If status is FAILED, credits are automatically refunded.
 *
 * @param {{ generationId: string, outputUrl?: string, status: 'COMPLETED'|'FAILED', metadata?: object }} options
 * @returns {{ ok: boolean, refunded?: number }}
 */
export async function completeGeneration({ generationId, outputUrl, status, metadata }) {
  try {
    const res = await fetch(`${CAPARISON_BASE_URL}/api/v1/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: CAPARISON_API_KEY,
        generationId,
        outputUrl,
        status,
        metadata,
      }),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    return { ok: false, error: 'NETWORK_ERROR', message: err.message };
  }
}

/**
 * Full generation wrapper. Use this for simple cases.
 * Handles credit check, runs your generator function, and marks completion.
 *
 * @param {{ userToken: string, inputData: object, creditCost?: number, generator: () => Promise<string> }} options
 * @returns {{ ok: boolean, outputUrl?: string, remainingCredits?: number, error?: string }}
 *
 * @example
 * const result = await generate({
 *   userToken,
 *   inputData: { prompt },
 *   creditCost: 10,
 *   generator: async () => {
 *     const img = await runYourModel(prompt);
 *     return img.url;
 *   }
 * });
 */
export async function generate({ userToken, inputData, creditCost, generator }) {
  // 1. Deduct credits and create generation record
  const useResult = await useCredits({ userToken, inputData, creditCost });

  if (!useResult.ok) {
    return useResult; // INSUFFICIENT_CREDITS or auth error
  }

  const { generationId } = useResult;

  try {
    // 2. Run the actual AI generation
    const outputUrl = await generator();

    // 3. Mark as completed
    await completeGeneration({ generationId, outputUrl, status: 'COMPLETED' });

    return { ok: true, outputUrl, generationId, remainingCredits: useResult.remainingCredits };
  } catch (err) {
    // 4. If generation throws, mark as failed (triggers credit refund)
    await completeGeneration({ generationId, status: 'FAILED', metadata: { error: err.message } });
    return { ok: false, error: 'GENERATION_FAILED', message: err.message };
  }
}
