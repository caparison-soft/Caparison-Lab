export default function Loading() {
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

        {/* Page header skeleton */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ ...shimmer, width: '200px', height: '28px', marginBottom: '8px' }} />
          <div style={{ ...shimmer, width: '320px', height: '16px' }} />
        </div>

        {/* Content cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ ...shimmer, height: '160px' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ ...shimmer, width: '140px', height: '16px', marginBottom: '8px' }} />
                <div style={{ ...shimmer, width: '200px', height: '12px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
