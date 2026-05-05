import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';

export default function AdminLayout({ children }) {
  // In a real app, you would verify admin role here
  
  return (
    <div className="min-h-screen bg-primary text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ background: 'var(--gradient-mesh)' }}></div>
        
        <Topbar />
        
        <main className="flex-1 p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Admin Area
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
