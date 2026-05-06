import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen relative w-full">
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
