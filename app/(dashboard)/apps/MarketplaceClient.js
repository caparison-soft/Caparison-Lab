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

  return (
    <div className="animate-fade-in stagger">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">App Marketplace</h2>
        <p className="text-zinc-400">Discover and use powerful AI tools to supercharge your workflow.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.value 
                  ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 h-10 w-full bg-black/20"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredApps.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-4">
            🔍
          </div>
          <h3 className="text-xl font-bold mb-2">No apps found</h3>
          <p className="text-zinc-400">Try adjusting your search or category filter.</p>
          {(searchQuery || activeCategory !== 'ALL') && (
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
              className="btn btn-ghost mt-4"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <Link key={app.id} href={`/apps/${app.slug}`} className="card card-hover overflow-hidden flex flex-col h-full cursor-pointer group">
              <div className="h-36 bg-zinc-800 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: app.coverImageUrl ? `url(${app.coverImageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`badge ${categoryColors[app.category] || 'badge-primary'} backdrop-blur-md bg-opacity-80`}>
                    {app.category}
                  </span>
                  {app.isFree && (
                    <span className="badge badge-free backdrop-blur-md bg-opacity-80">FREE</span>
                  )}
                </div>
              </div>
              
              <div className="card-body p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0 overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
                    {app.iconUrl ? (
                      <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🤖</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-indigo-400 transition-colors">{app.name}</h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      {app.isFree ? 'Unlimited Uses' : `${app.creditCost} Credits`}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-zinc-400 line-clamp-3 mb-4 flex-1">
                  {app.shortDesc || app.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xs text-zinc-500">
                    {app.appType.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-medium text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
