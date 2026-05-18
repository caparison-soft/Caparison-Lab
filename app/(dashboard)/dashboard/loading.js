export default function DashboardLoading() {
  const shimmer = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '12px',
  };

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ opacity: 0, animation: 'fadeIn 0.15s ease forwards' }}>
        <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>

        {/* Welcome banner skeleton */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
          border: '1px solid rgba(99,102,241,0.1)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '32px',
        }}>
          <div style={{ ...shimmer, width: '320px', height: '28px', marginBottom: '16px' }} />
          <div style={{ ...shimmer, width: '480px', height: '16px', marginBottom: '8px' }} />
          <div style={{ ...shimmer, width: '360px', height: '16px', marginBottom: '24px' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...shimmer, width: '120px', height: '40px', borderRadius: '8px' }} />
            <div style={{ ...shimmer, width: '140px', height: '40px', borderRadius: '8px' }} />
          </div>
        </div>

        {/* Stats grid skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              background: 'var(--glass-bg, rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{ ...shimmer, width: '100px', height: '14px', marginBottom: '12px' }} />
              <div style={{ ...shimmer, width: '80px', height: '32px' }} />
            </div>
          ))}
        </div>

        {/* Bottom section skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ ...shimmer, width: '140px', height: '18px', marginBottom: '20px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {[1, 2].map((i) => (
                <div key={i} style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ ...shimmer, height: '160px' }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ ...shimmer, width: '160px', height: '18px', marginBottom: '20px' }} />
            <div style={{
              background: 'var(--glass-bg, rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ ...shimmer, width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...shimmer, width: '160px', height: '14px', marginBottom: '8px' }} />
                    <div style={{ ...shimmer, width: '100px', height: '12px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
