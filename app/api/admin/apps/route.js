export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/admin/apps — List all apps
export async function GET() {
  try {
    const apps = await prisma.app.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { generations: true, transactions: true }
        }
      }
    });
    return NextResponse.json(apps);
  } catch (error) {
    console.error('Failed to fetch apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    );
  }
}

// POST /api/admin/apps — Create a new app
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, shortDesc, category, accessType, creditCost, iconUrl, coverImageUrl, externalUrl, configJson } = body;

    // Validation
    if (!name || !slug || !description || !category) {
      return NextResponse.json(
        { error: 'Name, slug, description, and category are required' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await prisma.app.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'An app with this slug already exists' },
        { status: 409 }
      );
    }

    const app = await prisma.app.create({
      data: {
        name,
        slug,
        description,
        shortDesc: shortDesc || null,
        category,
        accessType: accessType || 'CREDIT',
        creditCost: parseInt(creditCost) || 0,
        iconUrl: iconUrl || null,
        coverImageUrl: coverImageUrl || null,
        externalUrl: externalUrl || null,
        configJson: configJson || null,
      }
    });

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error('Failed to create app:', error);
    return NextResponse.json(
      { error: 'Failed to create app' },
      { status: 500 }
    );
  }
}
