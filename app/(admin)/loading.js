export default function AdminLoading() {
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

        {/* Admin header skeleton */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ ...shimmer, width: '240px', height: '28px', marginBottom: '8px' }} />
          <div style={{ ...shimmer, width: '360px', height: '16px' }} />
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              background: 'var(--glass-bg, rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <div style={{ ...shimmer, width: '80px', height: '12px', marginBottom: '12px' }} />
              <div style={{ ...shimmer, width: '60px', height: '28px' }} />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div style={{
          background: 'var(--glass-bg, rgba(255,255,255,0.03))',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{ ...shimmer, width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...shimmer, width: '180px', height: '14px', marginBottom: '6px' }} />
                <div style={{ ...shimmer, width: '120px', height: '11px' }} />
              </div>
              <div style={{ ...shimmer, width: '60px', height: '24px', borderRadius: '6px' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
