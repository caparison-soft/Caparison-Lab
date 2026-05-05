import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="animate-fade-in stagger">
      
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/20 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div className="card-body relative z-10 sm:p-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back to Caparison Lab</h2>
          <p className="text-indigo-200 mb-6 max-w-2xl">
            You have 150 credits available. Explore our new AI video generation tools or use your free recurring utilities to enhance your workflow.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/apps" className="btn btn-primary">Browse Apps</Link>
            <Link href="/credits" className="btn btn-secondary">Get More Credits</Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card card-hover">
          <div className="card-body flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Available Credits</p>
              <h3 className="text-3xl font-bold text-white">150</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
          </div>
        </div>
        
        <div className="card card-hover">
          <div className="card-body flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Total Generations</p>
              <h3 className="text-3xl font-bold text-white">24</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="card-body flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Current Plan</p>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pro</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Apps */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Featured Apps</h3>
            <Link href="/apps" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mock App Cards */}
            <div className="card card-hover overflow-hidden flex flex-col h-full cursor-pointer">
              <div className="h-32 bg-zinc-800 relative">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50"></div>
                <div className="absolute top-3 right-3">
                  <span className="badge badge-primary">AI Video</span>
                </div>
              </div>
              <div className="card-body p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">Story to Video AI</h4>
                    <p className="text-xs text-zinc-400">10 Credits / Generation</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
                  Convert your text stories into stunning videos with AI-generated scenes, voiceover, and captions.
                </p>
                <button className="btn btn-secondary w-full text-sm">Open App</button>
              </div>
            </div>

            <div className="card card-hover overflow-hidden flex flex-col h-full cursor-pointer">
              <div className="h-32 bg-zinc-800 relative">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-teal-900/50"></div>
                <div className="absolute top-3 right-3">
                  <span className="badge badge-free">Free Pro Utility</span>
                </div>
              </div>
              <div className="card-body p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">Video QC Tool</h4>
                    <p className="text-xs text-zinc-400">0 Credits</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
                  Quality control checker for your videos. Analyzes audio levels, resolution, and frame rates.
                </p>
                <button className="btn btn-secondary w-full text-sm">Open App</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Generations</h3>
          </div>
          
          <div className="card">
            <div className="flex flex-col">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border-b border-white/5 last:border-0 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded bg-zinc-800 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">Sci-fi city landscape</p>
                    <p className="text-xs text-zinc-500 truncate">Image Generator • 2h ago</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-red-400">-2</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-white/5 text-center bg-black/20">
              <Link href="/history" className="text-xs text-zinc-400 hover:text-white font-medium">View all history</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
