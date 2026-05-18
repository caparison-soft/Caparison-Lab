import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  let dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });

  // Failsafe: If user exists in Supabase but not Prisma, create them instantly
  if (!dbUser) {
    dbUser = await prisma.user.create({
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: '#fafafa' }}>
      <Sidebar user={dbUser} />
      {/* Main content area — pushed right by sidebar width using inline styles 
          so no Tailwind/CSS conflicts can override it */}
      <div style={{ 
        marginLeft: '260px', 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative',
        width: 'calc(100% - 260px)'
      }}>
        {/* Background mesh for dashboard */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 0, 
          pointerEvents: 'none', 
          opacity: 0.5, 
          background: 'var(--gradient-mesh)' 
        }}></div>
        
        <Topbar user={user} role={dbUser?.role} />
        
        <main style={{ flex: 1, padding: '32px', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
