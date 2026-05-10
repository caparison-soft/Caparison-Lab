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
        // Fallback for generating a somewhat unique username based on email
        const baseUsername = user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0];
        // Strip out non-alphanumeric characters and lowercase to make it a valid username
        const sanitizedUsername = baseUsername.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
        // Add random string to ensure uniqueness
        const uniqueUsername = `${sanitizedUsername}_${Math.random().toString(36).substring(2, 8)}`;

        await prisma.user.create({
          data: {
            supabaseId: user.id,
            email: user.email,
            username: uniqueUsername,
            avatarUrl: user.user_metadata?.avatar_url || null,
            credits: 100, // Default 100 free credits
            role: 'USER',
            subscriptionTier: 'FREE',
          }
        });
      }

      // Handle absolute URLs or relative paths
      const redirectUrl = next.startsWith('http') ? next : `${origin}${next}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
