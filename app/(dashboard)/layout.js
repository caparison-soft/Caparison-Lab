import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen">
        {/* Background mesh for dashboard */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ background: 'var(--gradient-mesh)' }}></div>
        
        <Topbar />
        
        <main className="flex-1 p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
