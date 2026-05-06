'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'ALL', label: 'All Apps' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'AUDIO', label: 'Audio' },
  { value: 'TEXT', label: 'Text' },
  { value: 'TOOL', label: 'Tool' },
  { value: 'UTILITY', label: 'Utility' },
];

const categoryColors = {
  IMAGE: 'badge-primary',
  VIDEO: 'badge-info',
  AUDIO: 'badge-warning',
  TEXT: 'badge-success',
  TOOL: 'badge-info',
  UTILITY: 'badge-warning',
};

export default function MarketplaceClient({ initialApps }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Filter apps
  const filteredApps = initialApps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (app.shortDesc && app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'ALL' || app.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const cardStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.25s ease',
  };

  return (
    <div style={{ paddingBottom: '48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>App Marketplace</h2>
        <p style={{ color: '#a1a1aa', fontSize: '15px' }}>Discover and use powerful AI tools to supercharge your workflow.</p>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeCategory === cat.value ? '#6366f1' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat.value ? '#ffffff' : '#a1a1aa',
                  boxShadow: activeCategory === cat.value ? '0 0 10px rgba(99,102,241,0.5)' : 'none',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '300px', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: '#71717a' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '36px',
                paddingRight: '16px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                color: '#fafafa',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredApps.length === 0 ? (
        <div style={{ ...cardStyle, padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
            🔍
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No apps found</h3>
          <p style={{ color: '#a1a1aa', marginBottom: '16px' }}>Try adjusting your search or category filter.</p>
          {(searchQuery || activeCategory !== 'ALL') && (
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
              style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', color: '#a1a1aa', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredApps.map((app) => (
            <Link key={app.id} href={`/apps/${app.slug}`} style={{ ...cardStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ height: '144px', background: '#1a1a24', position: 'relative', overflow: 'hidden' }}>
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: app.coverImageUrl ? `url(${app.coverImageUrl})` : 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.5s ease',
                  }}
                ></div>
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                  <span className={`badge ${categoryColors[app.category] || 'badge-primary'}`} style={{ backdropFilter: 'blur(8px)', background: 'rgba(99,102,241,0.8)' }}>
                    {app.category}
                  </span>
                  {app.isFree && (
                    <span className="badge badge-free" style={{ backdropFilter: 'blur(8px)', background: 'rgba(16,185,129,0.8)' }}>FREE</span>
                  )}
                </div>
              </div>
              
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {app.iconUrl ? (
                      <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '24px' }}>🤖</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#ffffff', lineHeight: 1.2, marginBottom: '2px' }}>{app.name}</h3>
                    <p style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>
                      {app.isFree ? 'Unlimited Uses' : `${app.creditCost} Credits`}
                    </p>
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: '#a1a1aa', flex: 1, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                  {app.shortDesc || app.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase' }}>
                    {app.appType.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open App
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
