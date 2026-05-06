export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import MarketplaceClient from '../(dashboard)/apps/MarketplaceClient';

export default async function ExplorePage() {
  const apps = await prisma.app.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* 1. Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Caparison Lab" className="h-8 w-auto object-contain" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/explore" className="text-white transition-colors">App Market</Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/signup" className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24 px-6 pb-20 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4 text-white">Public Marketplace</h1>
          <p className="text-zinc-400">Discover and explore all available AI apps on Caparison Lab.</p>
        </div>
        
        {/* We reuse the MarketplaceClient but wrap it so it doesn't break if it expects Topbar SWR state */}
        <MarketplaceClient initialApps={apps} />
      </main>
    </div>
  );
}
