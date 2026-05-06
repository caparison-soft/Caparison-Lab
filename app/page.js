import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      
      {/* 1. Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Caparison Lab" className={styles.logo} />
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/explore" className={styles.navLink}>App Market</Link>
              <Link href="/pricing" className={styles.navLink}>Pricing</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-[#a1a1aa] hover:text-white font-medium text-sm transition-colors">Login</Link>
              <Link href="/signup" className={styles.btnGetStarted}>Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.circlesBg}>
          <div className={`${styles.circle} ${styles.circle1}`}></div>
          <div className={`${styles.circle} ${styles.circle2}`}></div>
          <div className={`${styles.circle} ${styles.circle3}`}></div>
          <div className={styles.circle} style={{ margin: '40%', borderColor: 'rgba(99,102,241,0.2)' }}></div>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #050505 70%)' }}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.dot}></span>
            Caparison Lab Platform V1
          </div>
          
          <h1 className={styles.heroTitle}>
            Access the Best <br />
            <span className={styles.gradientText}>Video, Image & Audio</span><br />
            Models in One Platform
          </h1>
          
          <p className={styles.heroSubtitle}>
            All your AI apps for generation and workflow utilities — fast, affordable, and developer-friendly. Stop paying for dozens of subscriptions.
          </p>
          
          <div className={styles.heroButtons}>
            <Link href="/explore" className={styles.btnExplore}>Explore Apps</Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow} style={{ width: '100%', maxWidth: '1000px', margin: '80px auto 0' }}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>99.9%</div>
            <div className={styles.statLabel}>Uptime</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>&lt; 2s</div>
            <div className={styles.statLabel}>Gen Time</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>24/7</div>
            <div className={styles.statLabel}>Support</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>#1</div>
            <div className={styles.statLabel}>Data Security</div>
          </div>
        </div>
      </section>

      {/* 3. Zig Zag Section */}
      <section className={styles.section} style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 className={styles.sectionTitle}>Powerful capabilities, simple execution.</h2>
        <p className={styles.sectionSubtitle}>Our marketplace is curated with only the highest quality, most reliable AI models available.</p>

        {/* Row 1 */}
        <div className={styles.zigZagRow}>
          <div className={styles.zigZagImage}>
            <div className={styles.browserHeader}>
              <div className={styles.browserDot} style={{ background: '#ef4444' }}></div>
              <div className={styles.browserDot} style={{ background: '#eab308' }}></div>
              <div className={styles.browserDot} style={{ background: '#22c55e' }}></div>
            </div>
            <div className={styles.browserContent} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop')" }}>
              <div className={styles.browserContentOverlay}>
                <div className={styles.mockLine} style={{ width: '40%' }}></div>
                <div className={styles.mockLine} style={{ height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div className={styles.mockBtn}>Generate Video</div>
              </div>
            </div>
          </div>
          
          <div className={styles.zigZagContent}>
            <h3 className={styles.zigZagTitle}>AI Video Generation Apps</h3>
            <p className={styles.zigZagText}>
              Create high-quality videos with industry-leading models. Enjoy synchronized audio, smooth motion, and realistic scenes. From rapid renders to advanced scene reasoning, choose the perfect tool for your creative project.
            </p>
            <ul className={styles.featureList}>
              <li>
                <svg className={styles.featureIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Cinematic & photorealistic motion
              </li>
              <li>
                <svg className={styles.featureIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Advanced scene reasoning
              </li>
              <li>
                <svg className={styles.featureIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Precise camera control
              </li>
            </ul>
            <Link href="/explore?category=VIDEO" className={styles.linkAccent}>
              Browse Video Apps <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.zigZagRow}>
          <div className={styles.zigZagContent}>
            <h3 className={styles.zigZagTitle}>AI Image Generation Apps</h3>
            <p className={styles.zigZagText}>
              Produce high-quality, style-rich images instantly. From photorealistic renders to consistent character generation, our image apps offer accuracy, versatility, and total creative control.
            </p>
            <ul className={styles.featureList}>
              <li>
                <svg className={styles.featureIcon} style={{ color: '#c084fc' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                4K Resolution support
              </li>
              <li>
                <svg className={styles.featureIcon} style={{ color: '#c084fc' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Character consistency
              </li>
              <li>
                <svg className={styles.featureIcon} style={{ color: '#c084fc' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Inpainting and Outpainting
              </li>
            </ul>
            <Link href="/explore?category=IMAGE" className={styles.linkAccent} style={{ color: '#c084fc' }}>
              Browse Image Apps <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          <div className={styles.zigZagImage}>
            <div className={styles.browserHeader}>
              <div className={styles.browserDot} style={{ background: '#ef4444' }}></div>
              <div className={styles.browserDot} style={{ background: '#eab308' }}></div>
              <div className={styles.browserDot} style={{ background: '#22c55e' }}></div>
            </div>
            <div className={styles.browserContent} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop')" }}>
              <div className={styles.browserContentOverlay}>
                <div className={styles.mockLine} style={{ width: '40%' }}></div>
                <div className={styles.mockLine} style={{ height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div className={styles.mockBtn} style={{ background: '#c084fc' }}>Generate Image</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link href="/explore" className={styles.btnPricing}>Explore All Marketplace Apps</Link>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className={styles.section} style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', background: 'rgba(59,130,246,0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        
        <h2 className={styles.sectionTitle}>Why Choose Caparison Lab?</h2>
        <p className={styles.sectionSubtitle}>Everything you need to integrate and use AI without the massive overhead.</p>
        
        <div className={styles.featuresGrid}>
          {[
            { icon: '💳', title: 'Simple Credit System', desc: 'Buy credits once or subscribe. Use them across any app in the platform instantly.' },
            { icon: '🎯', title: 'Premium Models', desc: 'We only partner with industry leaders to bring you reliable, high-tier AI generation.' },
            { icon: '🛠️', title: 'Developer Friendly', desc: 'API endpoints coming soon. Build your own apps using our unified billing.' },
            { icon: '🚀', title: 'Regular Updates', desc: 'New apps and utilities are added weekly to keep your workflow cutting edge.' }
          ].map((feature, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureCardIcon}>{feature.icon}</div>
              <h3 className={styles.featureCardTitle}>{feature.title}</h3>
              <p className={styles.featureCardText}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto 80px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(167,139,250,0.05))', borderRadius: '24px', padding: '64px 32px', border: '1px solid rgba(139,92,246,0.2)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Ready to start generating?</h2>
          <p style={{ color: '#c4b5fd', fontSize: '1.125rem', marginBottom: '32px' }}>Join Caparison Lab today and get 100 free credits to test out our premium AI models.</p>
          <Link href="/signup" className={styles.btnExplore}>Create your free account</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#71717a', fontSize: '14px' }}>
          <img src="/logo.png" alt="Caparison Lab" className={styles.logo} style={{ height: '24px', marginBottom: '24px', opacity: 0.5 }} />
          <p>&copy; {new Date().getFullYear()} Caparison Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
