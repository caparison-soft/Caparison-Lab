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

/* ── Individual expandable app card ─────────────────────── */
function AppCard({ app, expanded, onToggle }) {

  const accessLabel =
    app.accessType === 'CREDIT'
      ? '🪙 Pay Per Use'
      : app.accessType === 'SUBSCRIBER'
        ? '⭐ Pro Only'
        : '💎 Pro + Credits';

  const accessGradient =
    app.accessType === 'CREDIT'
      ? 'linear-gradient(135deg, rgba(234,179,8,0.9), rgba(245,158,11,0.9))'
      : 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(168,85,247,0.9))';

  // Cover gradient fallback (each card gets a unique subtle gradient)
  const coverBg = app.coverImageUrl
    ? `url(${app.coverImageUrl})`
    : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)';

  return (
    <div
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        position: 'relative',
        alignSelf: 'start',
      }}
    >
      {/* ── Cover Image Area ───────────────────────────────── */}
      <Link href={`/apps/${app.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            position: 'relative',
            height: '220px',
            overflow: 'hidden',
            borderRadius: '20px 20px 16px 16px',
          }}
        >
          {/* Background image / gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: coverBg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'transform 0.5s ease',
            }}
          />
          {/* Subtle dark overlay for readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
            }}
          />

          {/* Access badge — top right */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              padding: '5px 14px',
              borderRadius: '99px',
              background: accessGradient,
              backdropFilter: 'blur(8px)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.02em',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            {accessLabel}
          </div>

          {/* Bottom overlay: App name + Open button */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              {/* App icon */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {app.iconUrl ? (
                  <img
                    src={app.iconUrl}
                    alt={app.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '22px' }}>🤖</span>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#fff',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {app.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                  {app.accessType === 'SUBSCRIBER' ? 'Unlimited' : `${app.creditCost} Credits`}
                </p>
              </div>
            </div>

            {/* Open App button */}
            <div
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              Open App
            </div>
          </div>
        </div>
      </Link>

      {/* ── Expandable Description Area ────────────────────── */}
      {expanded && (
        <div style={{ padding: '20px 20px 8px 20px' }}>
          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                {app.accessType === 'SUBSCRIBER' ? '∞' : app.creditCost}
              </p>
              <p style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Credits
              </p>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{app.category}</p>
              <p style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Category
              </p>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                {app.accessType === 'CREDIT'
                  ? 'All'
                  : app.accessType === 'SUBSCRIBER'
                    ? 'Pro'
                    : 'Pro'}
              </p>
              <p style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Access
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '13px',
              color: '#a1a1aa',
              lineHeight: 1.65,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {app.shortDesc || app.description}
          </p>
        </div>
      )}

      {/* ── Dropdown Toggle (Chevron) ──────────────────────── */}
      <button
        onClick={() => onToggle(app.id)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 0',
          cursor: 'pointer',
          color: '#71717a',
          transition: 'color 0.2s',
          background: 'transparent',
          border: 'none',
        }}
        aria-label={expanded ? 'Collapse description' : 'Expand description'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}

/* ── Main Marketplace Layout ────────────────────────────── */
export default function MarketplaceClient({ initialApps }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter apps
  const filteredApps = initialApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.shortDesc && app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'ALL' || app.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ paddingBottom: '48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>App Marketplace</h2>
        <p style={{ color: '#a1a1aa', fontSize: '15px' }}>
          Discover and use powerful AI tools to supercharge your workflow.
        </p>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
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
                  background:
                    activeCategory === cat.value ? '#6366f1' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat.value ? '#ffffff' : '#a1a1aa',
                  boxShadow:
                    activeCategory === cat.value
                      ? '0 0 10px rgba(99,102,241,0.5)'
                      : 'none',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '300px', flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                paddingLeft: '12px',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                color: '#71717a',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
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
        <div
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            padding: '48px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '16px',
            }}
          >
            🔍
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No apps found</h3>
          <p style={{ color: '#a1a1aa', marginBottom: '16px' }}>
            Try adjusting your search or category filter.
          </p>
          {(searchQuery || activeCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('ALL');
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#a1a1aa',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div
          className="stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} expanded={expandedId === app.id} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
