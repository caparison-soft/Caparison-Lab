'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAppsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const cardStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.25s ease',
  };

  const statIconStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    flexShrink: 0,
  });

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/admin/apps');
      const data = await res.json();
      setApps(data);
    } catch (err) {
      console.error('Failed to fetch apps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this app? This action cannot be undone.')) return;
    setDeleteId(id);
    try {
      const res = await fetch(`/api/admin/apps/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApps(apps.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/apps/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setApps(apps.map(a => a.id === id ? { ...a, isActive: !currentStatus } : a));
      }
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  const categoryColors = {
    IMAGE: 'badge-primary',
    VIDEO: 'badge-info',
    AUDIO: 'badge-warning',
    TEXT: 'badge-success',
    TOOL: 'badge-info',
    UTILITY: 'badge-warning',
  };

  return (
    <div className="animate-fade-in stagger">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-1">App Manager</h2>
          <p className="text-zinc-400">Create, edit, and manage your AI apps</p>
        </div>
        <Link href="/admin/apps/new" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New App
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Total Apps</p>
              <h3 style={{ fontSize: '32px', fontWeight: 700 }}>{apps.length}</h3>
            </div>
            <div style={statIconStyle('#818cf8')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
          </div>
        </div>
        
        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Active</p>
              <h3 style={{ fontSize: '32px', fontWeight: 700 }}>{apps.filter(a => a.isActive).length}</h3>
            </div>
            <div style={statIconStyle('#34d399')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Free Apps</p>
              <h3 style={{ fontSize: '32px', fontWeight: 700 }}>{apps.filter(a => a.isFree).length}</h3>
            </div>
            <div style={statIconStyle('#a78bfa')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card p-6 flex items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="spinner spinner-lg"></div>
        </div>
      ) : apps.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No apps yet</h3>
            <p className="empty-state-desc">Get started by creating your first AI app for the marketplace.</p>
            <Link href="/admin/apps/new" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create First App
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>App</th>
                <th>Category</th>
                <th>Type</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Uses</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-lg shrink-0">
                        {app.iconUrl ? (
                          <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                        ) : (
                          '🤖'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{app.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>/{app.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${categoryColors[app.category] || 'badge-primary'}`}>
                      {app.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{app.appType.replace('_', ' ')}</td>
                  <td>
                    {app.isFree ? (
                      <span className="badge badge-free">FREE</span>
                    ) : (
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{app.creditCost} credits</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(app.id, app.isActive)}
                      className={`badge ${app.isActive ? 'badge-success' : 'badge-danger'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {app.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {app._count?.generations || 0}
                  </td>
                  <td>
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/apps/${app.id}/edit`} className="btn btn-ghost btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deleteId === app.id}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-danger)' }}
                      >
                        {deleteId === app.id ? (
                          <div className="spinner"></div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
