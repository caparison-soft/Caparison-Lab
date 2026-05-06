import Link from 'next/link';
import styles from '../page.module.css';

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Caparison Lab" className={styles.logo} />
          </Link>
          
          <div className={styles.navLinks}>
            <Link href="/explore" className={styles.navLink}>App Market</Link>
            <Link href="/pricing" className={styles.navLink} style={{ color: '#fff' }}>Pricing</Link>
          </div>
          
          <div className={styles.authButtons}>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/signup" className={styles.btnGetStarted}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <main className="flex-1 pt-32 pb-20">
        <div className={styles.section}>
          <h1 className={styles.sectionTitle}>Simple, transparent pricing.</h1>
          <p className={styles.sectionSubtitle}>Pay as you go with credits, or get a monthly subscription for massive savings.</p>

          <div className={styles.pricingGrid}>
            {/* Free Tier */}
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Hobby</h3>
              <p className={styles.pricingDesc}>Perfect to test the waters.</p>
              <div className={styles.pricingPrice}>$0<span>/forever</span></div>
              <ul className={styles.pricingList}>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  100 Free Welcome Credits
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Access to all Free Utilities
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Community Support
                </li>
              </ul>
              <Link href="/signup" className={styles.btnPricingSecondary}>Start Free</Link>
            </div>

            {/* Pro Tier */}
            <div className={`${styles.pricingCard} ${styles.pricingCardPro}`}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#8b5cf6', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Most Popular</div>
              <h3 className={`${styles.pricingTitle} ${styles.pricingProTitle}`}>Pro</h3>
              <p className={styles.pricingDesc}>For serious creators and makers.</p>
              <div className={styles.pricingPrice}>$19<span>/mo</span></div>
              <ul className={styles.pricingList}>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  2,000 Credits per month
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Access to Premium Models
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Fast Generation Queue
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  20% off extra credit packs
                </li>
              </ul>
              <Link href="/signup" className={styles.btnPricingPrimary}>Subscribe Now</Link>
            </div>

            {/* Enterprise Tier */}
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Enterprise</h3>
              <p className={styles.pricingDesc}>Custom volume and dedicated support.</p>
              <div className={styles.pricingPrice} style={{ fontSize: '3rem' }}>Custom</div>
              <ul className={styles.pricingList}>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Unlimited Custom Credits
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Dedicated API Rate Limits
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  24/7 Slack Support
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  SLA Guarantee
                </li>
              </ul>
              <Link href="mailto:support@caparisonlab.com" className={styles.btnPricingSecondary}>Contact Sales</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 24px', textAlign: 'center', color: '#71717a', fontSize: '14px' }}>
        <img src="/logo.png" alt="Caparison Lab" style={{ height: '24px', margin: '0 auto 24px', opacity: 0.5 }} />
        <p>&copy; {new Date().getFullYear()} Caparison Lab. All rights reserved.</p>
      </footer>
    </div>
  );
}
