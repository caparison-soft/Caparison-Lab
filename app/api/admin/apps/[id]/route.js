import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET /api/admin/apps/[id] — Get single app
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const app = await prisma.app.findUnique({
      where: { id },
      include: {
        _count: {
          select: { generations: true, transactions: true }
        }
      }
    });

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    return NextResponse.json(app);
  } catch (error) {
    console.error('Failed to fetch app:', error);
    return NextResponse.json({ error: 'Failed to fetch app' }, { status: 500 });
  }
}

// PATCH /api/admin/apps/[id] — Update app
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, shortDesc, category, appType, creditCost, isFree, isActive, iconUrl, coverImageUrl, configJson } = body;

    // Check if the app exists
    const existing = await prisma.app.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // If slug is changing, check for duplicates
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.app.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: 'An app with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const app = await prisma.app.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(category !== undefined && { category }),
        ...(appType !== undefined && { appType }),
        ...(creditCost !== undefined && { creditCost: parseInt(creditCost) }),
        ...(isFree !== undefined && { isFree }),
        ...(isActive !== undefined && { isActive }),
        ...(iconUrl !== undefined && { iconUrl }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(configJson !== undefined && { configJson }),
      }
    });

    return NextResponse.json(app);
  } catch (error) {
    console.error('Failed to update app:', error);
    return NextResponse.json({ error: 'Failed to update app' }, { status: 500 });
  }
}

// DELETE /api/admin/apps/[id] — Delete app
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await prisma.app.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    await prisma.app.delete({ where: { id } });
    return NextResponse.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Failed to delete app:', error);
    return NextResponse.json({ error: 'Failed to delete app' }, { status: 500 });
  }
}
