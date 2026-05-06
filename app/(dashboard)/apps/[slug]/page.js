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

  return (
    <div className="animate-fade-in stagger max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
        <Link href="/apps" className="hover:text-white transition-colors">Apps</Link>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span className="text-white font-medium">{app.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            {app.coverImageUrl && (
              <div className="h-32 rounded-t-xl bg-zinc-800 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"
                  style={{
                    backgroundImage: `url(${app.coverImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
              </div>
            )}
            
            <div className={`card-body ${app.coverImageUrl ? 'pt-0 relative' : ''}`}>
              {app.coverImageUrl && (
                <div className="w-20 h-20 rounded-xl bg-black border-4 border-[var(--bg-elevated)] flex items-center justify-center shrink-0 overflow-hidden relative -mt-10 mb-4 shadow-lg">
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🤖</span>
                  )}
                </div>
              )}

              {!app.coverImageUrl && (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0 overflow-hidden mb-4" style={{ border: '1px solid var(--glass-border)' }}>
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🤖</span>
                  )}
                </div>
              )}

              <h1 className="text-2xl font-bold mb-1">{app.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge ${categoryColors[app.category] || 'badge-primary'}`}>
                  {app.category}
                </span>
                <span className="badge badge-outline">
                  {app.appType.replace('_', ' ')}
                </span>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400 font-medium uppercase mb-1">Cost per use</p>
                  <p className="text-lg font-bold text-white">
                    {app.isFree ? 'Free' : `${app.creditCost} Credits`}
                  </p>
                </div>
                {!app.isFree && (
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">About</h3>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {app.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real Execution Workspace */}
        <div className="lg:col-span-2">
          <ExecutionWorkspace app={app} />
        </div>

      </div>
    </div>
  );
}
