export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { appId, inputData } = body;

    if (!appId) {
      return NextResponse.json({ error: 'App ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {}
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the app and user data concurrently
    const [app, dbUser] = await Promise.all([
      prisma.app.findUnique({ where: { id: appId } }),
      prisma.user.findUnique({ where: { supabaseId: user.id } })
    ]);

    if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 });
    if (!dbUser) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    if (!app.isActive) return NextResponse.json({ error: 'App is currently disabled' }, { status: 400 });

    const creditCost = app.isFree ? 0 : app.creditCost;

    if (dbUser.credits < creditCost) {
      return NextResponse.json(
        { error: 'Insufficient credits', required: creditCost, available: dbUser.credits },
        { status: 402 }
      );
    }

    // Process transaction: Deduct credits, create generation record, increment usage
    const [updatedUser, generation] = await prisma.$transaction([
      prisma.user.update({
        where: { id: dbUser.id },
        data: { credits: { decrement: creditCost } }
      }),
      prisma.generation.create({
        data: {
          userId: dbUser.id,
          appId: app.id,
          inputData: inputData || {},
          status: 'COMPLETED', // Simulating instant completion for now
          creditsUsed: creditCost,
          // outputUrl: "placeholder for generated result"
        }
      }),
      prisma.app.update({
        where: { id: app.id },
        data: { usageCount: { increment: 1 } }
      })
    ]);

    // Simulated generated result
    const simulatedResult = {
      message: `Successfully executed ${app.name}!`,
      creditsRemaining: updatedUser.credits,
      generationId: generation.id,
      mockOutputUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop'
    };

    return NextResponse.json(simulatedResult);
  } catch (error) {
    console.error('Execution engine error:', error);
    return NextResponse.json({ error: 'Failed to execute app' }, { status: 500 });
  }
}
