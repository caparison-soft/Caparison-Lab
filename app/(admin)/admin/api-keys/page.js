'use client';

import { useState, useEffect } from 'react';

export default function AdminApiKeysPage() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState('');
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [revealedKey, setRevealedKey] = useState(null); // shown once after creation

  const cardStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
  };

  // Load apps
  useEffect(() => {
    fetch('/api/admin/apps')
      .then(r => r.json())
      .then(setApps)
      .catch(console.error);
  }, []);

  // Load keys when app selected
  useEffect(() => {
    if (!selectedApp) { setKeys([]); return; }
    setLoading(true);
    fetch(`/api/admin/api-keys?appId=${selectedApp}`)
      .then(r => r.json())
      .then(data => { setKeys(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedApp]);

  const handleCreate = async () => {
    if (!selectedApp || !newKeyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: selectedApp, name: newKeyName.trim() }),
      });
      const data = await res.json();
      setRevealedKey(data.plainKey);
      setNewKeyName('');
      // Refresh keys list
      const updated = await fetch(`/api/admin/api-keys?appId=${selectedApp}`).then(r => r.json());
      setKeys(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id, current) => {
    await fetch(`/api/admin/api-keys/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    setKeys(keys.map(k => k.id === id ? { ...k, isActive: !current } : k));
  };

  const handleRevoke = async (id) => {
    if (!confirm('Permanently delete this API key? This cannot be undone.')) return;
    await fetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' });
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="animate-fade-in stagger">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-1">API Keys</h2>
          <p className="text-zinc-400">Generate keys to connect external apps to the Caparison Lab platform</p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ ...cardStyle, padding: '20px 24px', marginBottom: '32px', borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#c7d2fe', marginBottom: '4px' }}>How API Keys work</p>
            <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.6 }}>
              Each external app gets a unique API key tied to a specific App in the marketplace.
              When a user generates something in that external app, it calls Caparison Lab to deduct credits and log the generation.
              Keys are hashed — the plain key is shown <strong style={{ color: '#fff' }}>only once</strong> at creation time.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
        {/* Left: Select App + Create Key */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Generate New Key</h3>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Select App</label>
                <select
                  className="input"
                  value={selectedApp}
                  onChange={e => setSelectedApp(e.target.value)}
                >
                  <option value="">-- Choose an app --</option>
                  {apps.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Key Name / Label</label>
                <input
                  className="input"
                  placeholder="e.g. Production Key"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
              </div>

              <button
                className="btn btn-primary"
                disabled={!selectedApp || !newKeyName.trim() || creating}
                onClick={handleCreate}
                style={{ width: '100%' }}
              >
                {creating ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                    Generate Key
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Revealed Key — shown once */}
          {revealedKey && (
            <div style={{ ...cardStyle, padding: '20px', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#34d399' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Key Created — Copy Now!</span>
              </div>
              <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '10px' }}>This key will NOT be shown again. Store it securely in your app's .env file.</p>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '10px 14px', fontFamily: 'monospace', fontSize: '13px', color: '#34d399', wordBreak: 'break-all', marginBottom: '12px' }}>
                {revealedKey}
              </div>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '13px' }}
                onClick={() => { navigator.clipboard.writeText(revealedKey); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copy to Clipboard
              </button>
              <button
                onClick={() => setRevealedKey(null)}
                style={{ width: '100%', marginTop: '8px', background: 'transparent', color: '#71717a', fontSize: '13px', cursor: 'pointer', padding: '6px' }}
              >
                I've saved it, dismiss
              </button>
            </div>
          )}
        </div>

        {/* Right: Keys List */}
        <div style={cardStyle}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px' }}>
              {selectedApp ? `Keys for ${apps.find(a => a.id === selectedApp)?.name || '...'}` : 'All API Keys'}
            </h3>
            <span style={{ fontSize: '13px', color: '#71717a' }}>{keys.length} key{keys.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div style={{ padding: '60px', display: 'flex', justifyContent: 'center' }}>
              <div className="spinner spinner-lg"></div>
            </div>
          ) : keys.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>🔑</div>
              <p style={{ color: '#71717a', fontSize: '14px' }}>
                {selectedApp ? 'No keys yet. Generate one on the left.' : 'Select an app to see its API keys.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {keys.map((key) => (
                <div key={key.id} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Icon */}
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: key.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(113,113,122,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: key.isActive ? '#34d399' : '#52525b', flexShrink: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{key.name}</p>
                    <p style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>{key.keyPrefix}</p>
                    {key.lastUsedAt && (
                      <p style={{ fontSize: '11px', color: '#52525b', marginTop: '2px' }}>
                        Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <span className={`badge ${key.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {key.isActive ? 'Active' : 'Revoked'}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleToggle(key.id, key.isActive)}
                      title={key.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {key.isActive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="16" cy="12" r="3"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="8" cy="12" r="3"/></svg>
                      )}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRevoke(key.id)}
                      style={{ color: 'var(--color-danger)' }}
                      title="Delete key permanently"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
