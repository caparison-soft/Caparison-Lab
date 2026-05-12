import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import Link from 'next/link';
import ExecutionWorkspace from './ExecutionWorkspace';

export default async function AppDetailPage({ params }) {
  const slug = (await params).slug;
  const supabase = await import('@supabase/ssr').then(mod => mod.createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return require('next/headers').cookies().then(c => c.getAll()); },
      },
    }
  ));
  
  const { data: { user } } = await supabase.auth.getUser();
  const dbUser = user ? await prisma.user.findUnique({ where: { supabaseId: user.id } }) : null;

  const app = await prisma.app.findUnique({
    where: { slug },
  });

  if (!app || !app.isActive) {
    notFound();
  }

  const categoryColors = {
    IMAGE: 'badge-primary',
    VIDEO: 'badge-info',
    AUDIO: 'badge-warning',
    TEXT: 'badge-success',
    TOOL: 'badge-info',
    UTILITY: 'badge-warning',
  };

  const cardStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '48px' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#a1a1aa', marginBottom: '24px' }}>
        <Link href="/apps" style={{ color: 'inherit', textDecoration: 'none' }}>Apps</Link>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span style={{ color: '#ffffff', fontWeight: 500 }}>{app.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Left Column: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={cardStyle}>
            {app.coverImageUrl && (
              <div style={{ height: '128px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', background: '#27272a', position: 'relative', overflow: 'hidden' }}>
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))',
                    backgroundImage: `url(${app.coverImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
              </div>
            )}
            
            <div style={{ padding: '24px', paddingTop: app.coverImageUrl ? '0' : '24px', position: 'relative' }}>
              {app.coverImageUrl && (
                <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#000', border: '4px solid var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', position: 'relative', marginTop: '-40px', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}>
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '36px' }}>🤖</span>
                  )}
                </div>
              )}

              {!app.coverImageUrl && (
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', marginBottom: '16px' }}>
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '32px' }}>🤖</span>
                  )}
                </div>
              )}

              <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{app.name}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <span className={`badge ${categoryColors[app.category] || 'badge-primary'}`}>
                  {app.category}
                </span>
                <span style={{
                  padding: '4px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '9999px',
                  background: app.accessType === 'SUBSCRIBER' ? 'rgba(168,85,247,0.15)' : app.accessType === 'SUBSCRIBER_CREDIT' ? 'rgba(168,85,247,0.15)' : 'rgba(234,179,8,0.15)',
                  color: app.accessType === 'SUBSCRIBER' ? '#c084fc' : app.accessType === 'SUBSCRIBER_CREDIT' ? '#e9d5ff' : '#fbbf24',
                  border: `1px solid ${app.accessType === 'SUBSCRIBER' || app.accessType === 'SUBSCRIBER_CREDIT' ? 'rgba(168,85,247,0.3)' : 'rgba(234,179,8,0.3)'}`,
                }}>
                  {app.accessType === 'CREDIT' ? '🪙 Pay Per Use' : app.accessType === 'SUBSCRIBER' ? '⭐ Pro Only' : '💎 Pro + Credits'}
                </span>
              </div>
              
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Cost per use</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                    {app.accessType === 'SUBSCRIBER' ? '∞ Unlimited' : `${app.creditCost} Credits`}
                  </p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: app.accessType === 'SUBSCRIBER' ? 'rgba(168,85,247,0.2)' : 'rgba(99,102,241,0.2)', color: app.accessType === 'SUBSCRIBER' ? '#c084fc' : '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {app.accessType === 'SUBSCRIBER' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '12px' }}>About</h3>
                <p style={{ color: '#d4d4d8', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {app.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real Execution Workspace or External App Info */}
        <div>
          {app.externalUrl ? (
            <div style={{ ...cardStyle, height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
              <div style={{ width: '100%', flex: 1, maxHeight: '400px', background: '#1a1a24', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                <div style={{ textAlign: 'center', color: '#a1a1aa' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px auto', opacity: 0.5 }}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
                  <p style={{ fontWeight: 500, fontSize: '16px' }}>Video Demo Placeholder</p>
                  <p style={{ fontSize: '13px', marginTop: '4px', opacity: 0.7 }}>A video showing how to use the app will go here.</p>
                </div>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Ready to start?</h2>
              <p style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '24px', maxWidth: '400px' }}>This is an external micro-service. It will securely connect to your Caparison Lab account.</p>
              {(!dbUser || (dbUser.subscriptionTier !== 'PRO' && app.accessType !== 'CREDIT')) ? (
                <Link href="/billing" style={{ padding: '16px 48px', fontSize: '16px', fontWeight: 700, borderRadius: '12px', background: 'var(--gradient-primary)', color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px -5px rgba(99,102,241,0.5)', transition: 'transform 0.2s' }}>
                  Upgrade to Launch
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </Link>
              ) : (
                <a href={app.externalUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 48px', fontSize: '16px', fontWeight: 700, borderRadius: '12px', background: 'var(--gradient-primary)', color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px -5px rgba(99,102,241,0.5)', transition: 'transform 0.2s' }}>
                  Launch {app.name}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              )}
            </div>
          ) : (
            <ExecutionWorkspace app={app} />
          )}
        </div>

      </div>
    </div>
  );
}
