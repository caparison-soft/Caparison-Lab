import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'var(--gradient-mesh)' }}></div>
      
      {/* Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              C
            </div>
            <span className="text-xl font-bold tracking-tight">Caparison Lab</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn btn-ghost">Login</Link>
            <Link href="/signup" className="btn btn-primary">Sign Up Free</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl mx-auto stagger">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Caparison Lab Platform V1
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            The Ultimate <br />
            <span className="text-gradient">AI App Marketplace</span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Access powerful AI generation tools, video utilities, and recurring apps all in one place. Subscribe, buy credits, and create magic.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-primary btn-lg w-full sm:w-auto">
              Get Started for Free
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/apps" className="btn btn-secondary btn-lg w-full sm:w-auto">
              Explore Apps
            </Link>
          </div>
        </div>
        
        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          <div className="card card-hover p-6 text-left">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Generation Apps</h3>
            <p className="text-zinc-400">Generate high-quality images and videos using our advanced AI models with a simple credit system.</p>
          </div>
          
          <div className="card card-hover p-6 text-left">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Pricing</h3>
            <p className="text-zinc-400">Subscribe to a tier that fits your needs. Get monthly credits and access to premium recurring free apps.</p>
          </div>
          
          <div className="card card-hover p-6 text-left">
            <div className="w-12 h-12 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M10 8v8l6-4-6-4Z"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Utilities</h3>
            <p className="text-zinc-400">Access free tools like Video QC and more as part of your subscription without burning through your credits.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
