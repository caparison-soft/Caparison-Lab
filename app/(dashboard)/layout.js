import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: '#fafafa' }}>
      <Sidebar />
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
        
        <Topbar />
        
        <main style={{ flex: 1, padding: '32px', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
