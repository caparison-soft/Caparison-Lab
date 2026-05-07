/**
 * Admin API — Manage a specific API Key
 * PATCH  /api/admin/api-keys/[id]  → toggle active/inactive
 * DELETE /api/admin/api-keys/[id]  → permanently revoke (delete)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '../../../../../lib/prisma';

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

// PATCH — Toggle isActive
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { isActive } = await request.json();

    const updated = await prisma.apiKey.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ id: updated.id, isActive: updated.isActive });
  } catch (err) {
    if (err.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — Permanently revoke
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.apiKey.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
