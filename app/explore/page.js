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

      <main style={{
        flex: 1,
        paddingTop: '120px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%'
      }}>
        <MarketplaceClient initialApps={apps} />
      </main>
    </div>
  );
}
