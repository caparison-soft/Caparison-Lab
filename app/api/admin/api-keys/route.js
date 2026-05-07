/**
 * Admin API — Manage API Keys
 * GET  /api/admin/api-keys?appId=xxx  → list keys for an app
 * POST /api/admin/api-keys            → create a new API key
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '../../../../lib/prisma';
import { generateApiKey } from '../../../../lib/api-auth';

async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw { status: 401 };

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser || dbUser.role !== 'ADMIN') throw { status: 403 };
  return dbUser;
}

// GET — List API keys for an app
export async function GET(request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    const where = appId ? { appId } : {};
    const keys = await prisma.apiKey.findMany({
      where,
      include: { app: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Never return the keyHash — only safe display fields
    const safeKeys = keys.map(({ keyHash, ...rest }) => rest);
    return NextResponse.json(safeKeys);
  } catch (err) {
    if (err.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('[admin/api-keys GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — Create new API key
export async function POST(request) {
  try {
    await requireAdmin();
    const { appId, name } = await request.json();

    if (!appId || !name) {
      return NextResponse.json({ error: 'appId and name are required' }, { status: 400 });
    }

    // Verify app exists
    const app = await prisma.app.findUnique({ where: { id: appId } });
    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Generate the key
    const { plainKey, keyHash, keyPrefix } = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: { appId, keyHash, keyPrefix, name },
    });

    // Return the plain key ONCE — it will never be shown again
    return NextResponse.json({
      ...apiKey,
      plainKey, // ← shown only on creation
      message: 'Save this key securely. It will not be shown again.',
    });
  } catch (err) {
    if (err.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('[admin/api-keys POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
