export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
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

  const { data: { user } } = await supabase.auth.getUser();

  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  }

  const featuredApps = await prisma.app.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  let recentGenerations = [];
  let totalGenerations = 0;
  if (dbUser) {
    recentGenerations = await prisma.generation.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { app: true },
    });
    totalGenerations = await prisma.generation.count({
      where: { userId: dbUser.id },
    });
  }

  // Shared styles
  const cardStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.25s ease',
  };

  const statIconStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    flexShrink: 0,
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
        border: '1px solid rgba(99,102,241,0.2)',
        padding: '40px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '32px', opacity: 0.15, pointerEvents: 'none' }}>
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Welcome back to Caparison Lab</h2>
          <p style={{ color: '#c7d2fe', marginBottom: '24px', maxWidth: '600px', lineHeight: 1.6 }}>
            You have {dbUser?.credits ?? 0} credits available. Explore our new AI tools or use your free recurring utilities to enhance your workflow.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Link href="/apps" className="btn btn-primary">Browse Apps</Link>
            <Link href="/billing" className="btn btn-secondary">Get More Credits</Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Available Credits</p>
              <h3 style={{ fontSize: '32px', fontWeight: 700 }}>{dbUser?.credits ?? 0}</h3>
            </div>
            <div style={statIconStyle('#eab308')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
          </div>
        </div>
        
        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Total Generations</p>
              <h3 style={{ fontSize: '32px', fontWeight: 700 }}>{totalGenerations}</h3>
            </div>
            <div style={statIconStyle('#10b981')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Current Plan</p>
              <h3 style={{ fontSize: '32px', fontWeight: 700, background: 'linear-gradient(90deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{dbUser?.subscriptionTier ?? 'Free'}</h3>
            </div>
            <div style={statIconStyle('#a855f7')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Featured Apps + Recent Generations */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Featured Apps */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Featured Apps</h3>
            <Link href="/apps" style={{ fontSize: '14px', color: '#818cf8', fontWeight: 500 }}>View all</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', alignItems: 'start' }}>
            {featuredApps.length === 0 ? (
              <div style={{ gridColumn: 'span 2', padding: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ color: '#a1a1aa' }}>No apps available yet.</p>
              </div>
            ) : (
              featuredApps.map((app) => {
                const coverBg = app.coverImageUrl
                  ? `url(${app.coverImageUrl})`
                  : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)';
                const accessLabel = app.accessType === 'CREDIT' ? '🪙 Pay Per Use' : app.accessType === 'SUBSCRIBER' ? '⭐ Pro Only' : '💎 Pro + Credits';
                const accessGradient = app.accessType === 'CREDIT'
                  ? 'linear-gradient(135deg, rgba(234,179,8,0.9), rgba(245,158,11,0.9))'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(168,85,247,0.9))';

                return (
                  <Link
                    key={app.id}
                    href={`/apps/${app.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      background: '#111118',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.3s ease',
                    }}>
                      {/* Cover image */}
                      <div style={{ position: 'relative', height: '160px', overflow: 'hidden', borderRadius: '20px 20px 16px 16px' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: coverBg, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)' }} />

                        {/* Access badge */}
                        <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '5px 12px', borderRadius: '99px', background: accessGradient, backdropFilter: 'blur(8px)', fontSize: '11px', fontWeight: 700, color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                          {accessLabel}
                        </div>

                        {/* Bottom overlay */}
                        <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                              {app.iconUrl ? (
                                <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ fontSize: '18px' }}>🤖</span>
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <h4 style={{ fontWeight: 700, fontSize: '14px', color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name}</h4>
                              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                                {app.accessType === 'SUBSCRIBER' ? 'Unlimited' : `${app.creditCost} Credits`}
                              </p>
                            </div>
                          </div>
                          <div style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            Open App
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Generations */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Generations</h3>
          </div>
          
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentGenerations.length === 0 ? (
                 <div style={{ padding: '40px', textAlign: 'center' }}>
                   <p style={{ color: '#71717a', fontSize: '14px' }}>No generations yet.</p>
                 </div>
              ) : (
                recentGenerations.map((gen) => (
                  <div key={gen.id} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'background 0.15s' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {gen.app.iconUrl ? (
                        <img src={gen.app.iconUrl} alt={gen.app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '20px' }}>✨</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {gen.inputData?.prompt ? `"${gen.inputData.prompt}"` : 'Executed App'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gen.app.name} • {new Date(gen.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {gen.status === 'FAILED' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#71717a', textDecoration: 'line-through' }}>
                            -{gen.creditsUsed}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>Refunded</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#f87171' }}>
                          {gen.creditsUsed > 0 ? `-${gen.creditsUsed}` : 'Free'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <Link href="/history" style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 500 }}>View all history</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
