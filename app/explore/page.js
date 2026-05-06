export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import MarketplaceClient from '../(dashboard)/apps/MarketplaceClient';
import styles from '../page.module.css';

export default async function ExplorePage() {
  const apps = await prisma.app.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      {/* Navbar using CSS module */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Caparison Lab" className={styles.logo} />
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/explore" className={styles.navLink} style={{ color: '#fff' }}>App Market</Link>
              <Link href="/pricing" className={styles.navLink}>Pricing</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-[#a1a1aa] hover:text-white font-medium text-sm transition-colors">Login</Link>
              <Link href="/signup" className={styles.btnGetStarted}>Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 px-6 pb-20 max-w-7xl mx-auto w-full">
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Public Marketplace</h1>
          <p style={{ color: '#a1a1aa' }}>Discover and explore all available AI apps on Caparison Lab.</p>
        </div>
        
        <MarketplaceClient initialApps={apps} />
      </main>
    </div>
  );
}
