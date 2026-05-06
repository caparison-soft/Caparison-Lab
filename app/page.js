import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      
      {/* 1. Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Caparison Lab" className="h-8 w-auto object-contain" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/explore" className="hover:text-white transition-colors">App Market</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
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

      {/* 2. Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center">
        {/* Concentric Circles Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] pointer-events-none opacity-20">
          <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[spin_60s_linear_infinite]" style={{ margin: '10%' }}></div>
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-[spin_80s_linear_infinite_reverse]" style={{ margin: '20%' }}></div>
          <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-[spin_100s_linear_infinite]" style={{ margin: '30%' }}></div>
          <div className="absolute inset-0 rounded-full border border-indigo-500/5" style={{ margin: '40%' }}></div>
          
          {/* Radial Gradient to fade out edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_70%)]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Caparison Lab Platform V1
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            Access the Best <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Video, Image & Audio
            </span><br />
            Models in One Platform
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            All your AI apps for generation and workflow utilities — fast, affordable, and developer-friendly. Stop paying for dozens of subscriptions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/explore" className="bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full text-lg font-bold transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Explore Apps
            </Link>
            <Link href="#pricing" className="px-8 py-4 rounded-full text-lg font-bold border border-white/20 hover:bg-white/5 transition-all w-full sm:w-auto flex items-center justify-center gap-2 text-white">
              View Pricing <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 mt-32 w-full max-w-6xl mx-auto px-6 border-t border-white/5 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</p>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Uptime</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">&lt; 2s</p>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Gen Time</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</p>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Support</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">#1</p>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Data Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Zig Zag Section */}
      <section className="py-32 bg-black/50 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful capabilities, simple execution.</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Our marketplace is curated with only the highest quality, most reliable AI models available.</p>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>
              <div className="relative rounded-2xl border border-white/10 bg-[#111] overflow-hidden shadow-2xl">
                {/* Mock Browser/App Window */}
                <div className="h-10 border-b border-white/10 bg-[#0a0a0a] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="p-6 h-[400px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
                  {/* Overlay to simulate UI */}
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 w-full max-w-sm bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <div className="h-4 w-1/3 bg-white/20 rounded mb-4"></div>
                    <div className="h-12 w-full bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-10 w-full bg-indigo-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">Generate Video</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-bold mb-4">AI Video Generation Apps</h3>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                Create high-quality videos with industry-leading models. Enjoy synchronized audio, smooth motion, and realistic scenes. From rapid renders to advanced scene reasoning, choose the perfect tool for your creative project.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-zinc-300"><svg className="text-indigo-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Cinematic & photorealistic motion</li>
                <li className="flex items-center gap-3 text-zinc-300"><svg className="text-indigo-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Advanced scene reasoning</li>
                <li className="flex items-center gap-3 text-zinc-300"><svg className="text-indigo-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Precise camera control</li>
              </ul>
              <Link href="/explore?category=VIDEO" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2">
                Browse Video Apps <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="order-1">
              <h3 className="text-3xl font-bold mb-4">AI Image Generation Apps</h3>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                Produce high-quality, style-rich images instantly. From photorealistic renders to consistent character generation, our image apps offer accuracy, versatility, and total creative control.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-zinc-300"><svg className="text-purple-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> 4K Resolution support</li>
                <li className="flex items-center gap-3 text-zinc-300"><svg className="text-purple-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Character consistency</li>
                <li className="flex items-center gap-3 text-zinc-300"><svg className="text-purple-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Inpainting and Outpainting</li>
              </ul>
              <Link href="/explore?category=IMAGE" className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-2">
                Browse Image Apps <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="order-2 relative group">
              <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-3xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
              <div className="relative rounded-2xl border border-white/10 bg-[#111] overflow-hidden shadow-2xl">
                <div className="h-10 border-b border-white/10 bg-[#0a0a0a] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="p-6 h-[400px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 w-full max-w-sm bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <div className="h-4 w-1/3 bg-white/20 rounded mb-4"></div>
                    <div className="h-12 w-full bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-10 w-full bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">Generate Image</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-20">
             <Link href="/explore" className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-lg font-bold transition-all">
               Explore All Marketplace Apps
             </Link>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Caparison Lab?</h2>
            <p className="text-zinc-400">Everything you need to integrate and use AI without the massive overhead.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💳', title: 'Simple Credit System', desc: 'Buy credits once or subscribe. Use them across any app in the platform instantly.' },
              { icon: '🎯', title: 'Premium Models', desc: 'We only partner with industry leaders to bring you reliable, high-tier AI generation.' },
              { icon: '🛠️', title: 'Developer Friendly', desc: 'API endpoints coming soon. Build your own apps using our unified billing.' },
              { icon: '🚀', title: 'Regular Updates', desc: 'New apps and utilities are added weekly to keep your workflow cutting edge.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing */}
      <section id="pricing" className="py-24 bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing.</h2>
            <p className="text-zinc-400">Pay as you go with credits, or get a monthly subscription for massive savings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0a0a0a]">
              <h3 className="text-2xl font-bold mb-2">Hobby</h3>
              <p className="text-zinc-400 text-sm mb-6">Perfect to test the waters.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="text-zinc-500">/forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> 100 Free Welcome Credits</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Access to all Free Utilities</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Community Support</li>
              </ul>
              <Link href="/signup" className="block text-center w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 font-semibold transition-colors">Start Free</Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-3xl border border-indigo-500 bg-indigo-900/10 relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2 text-indigo-400">Pro</h3>
              <p className="text-zinc-400 text-sm mb-6">For serious creators and makers.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold">$19</span>
                <span className="text-zinc-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-indigo-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> 2,000 Credits per month</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-indigo-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Access to Premium Models</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-indigo-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Fast Generation Queue</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-indigo-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> 20% off extra credit packs</li>
              </ul>
              <Link href="/signup" className="block text-center w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors">Subscribe Now</Link>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0a0a0a]">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-zinc-400 text-sm mb-6">Custom volume and dedicated support.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Unlimited Custom Credits</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Dedicated API Rate Limits</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> 24/7 Slack Support</li>
                <li className="flex items-center gap-3 text-sm text-zinc-300"><svg className="text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> SLA Guarantee</li>
              </ul>
              <Link href="mailto:support@caparisonlab.com" className="block text-center w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 font-semibold transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ & Final CTA */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-6 mb-24">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How does the credit system work?', a: 'Every app in the marketplace has a set "Credit Cost". When you execute an app, those credits are deducted from your account. You can buy more credits anytime, or subscribe for a monthly top-up.' },
              { q: 'Are my generated assets private?', a: 'Yes. Everything you generate is tied to your account and completely private. We do not use your generated assets to train models.' },
              { q: 'Can I use the outputs commercially?', a: 'Absolutely. All generations produced via paid apps grant you full commercial rights.' },
              { q: 'Do credits roll over?', a: 'Purchased credit packs never expire. Subscription credits refresh on your billing cycle.' }
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-white/10 bg-white/5 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-lg text-white">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="p-12 md:p-20 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to start generating?</h2>
            <p className="text-xl text-indigo-200 mb-10 relative z-10 max-w-2xl mx-auto">Join Caparison Lab today and get 100 free credits to test out our premium AI models.</p>
            <Link href="/signup" className="relative z-10 bg-white text-black hover:bg-zinc-200 px-10 py-4 rounded-full text-lg font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Create your free account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <img src="/logo.png" alt="Caparison Lab" className="h-6 w-auto mb-6 opacity-80" />
              <p className="mb-6 max-w-xs">The unified API and marketplace for all your AI generation needs.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#" className="hover:text-white transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/explore" className="hover:text-white transition-colors">App Market</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p>&copy; {new Date().getFullYear()} Caparison Lab. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
