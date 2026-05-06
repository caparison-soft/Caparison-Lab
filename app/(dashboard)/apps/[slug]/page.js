import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import Link from 'next/link';
import ExecutionWorkspace from './ExecutionWorkspace';

export default async function AppDetailPage({ params }) {
  const slug = (await params).slug;
  
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
                <span style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', textTransform: 'uppercase' }}>
                  {app.appType.replace('_', ' ')}
                </span>
              </div>
              
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Cost per use</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                    {app.isFree ? 'Free' : `${app.creditCost} Credits`}
                  </p>
                </div>
                {!app.isFree && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                )}
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

        {/* Right Column: Real Execution Workspace */}
        <div>
          <ExecutionWorkspace app={app} />
        </div>

      </div>
    </div>
  );
}
