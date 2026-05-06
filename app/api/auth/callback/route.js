import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && authData?.user) {
      // Sync user with Prisma database
      const user = authData.user;
      const existingUser = await prisma.user.findUnique({
        where: { supabaseId: user.id }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            supabaseId: user.id,
            email: user.email,
            displayName: user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0],
            credits: 100, // Default 100 free credits
            role: 'USER',
            subscriptionTier: 'FREE',
          }
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
