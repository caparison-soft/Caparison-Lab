'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'IMAGE', label: 'Image', icon: '🖼️' },
  { value: 'VIDEO', label: 'Video', icon: '🎬' },
  { value: 'AUDIO', label: 'Audio', icon: '🎵' },
  { value: 'TEXT', label: 'Text', icon: '📝' },
  { value: 'TOOL', label: 'Tool', icon: '🔧' },
  { value: 'UTILITY', label: 'Utility', icon: '⚙️' },
];

const APP_TYPES = [
  { value: 'GENERATION', label: 'Generation', desc: 'Uses credits per generation (e.g. AI image)' },
  { value: 'RECURRING_FREE', label: 'Recurring Free', desc: 'Free for subscribers, unlimited use' },
  { value: 'ONE_TIME', label: 'One-Time', desc: 'Single credit purchase to unlock forever' },
  { value: 'TOOL', label: 'Tool', desc: 'Utility tool, pricing flexible' },
];

export default function EditAppPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    category: 'IMAGE',
    appType: 'GENERATION',
    creditCost: 5,
    isFree: false,
    isActive: true,
    iconUrl: '',
    coverImageUrl: '',
    externalUrl: '',
  });

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`/api/admin/apps/${params.id}`);
        if (!res.ok) throw new Error('App not found');
        const app = await res.json();
        setForm({
          name: app.name || '',
          slug: app.slug || '',
          description: app.description || '',
          shortDesc: app.shortDesc || '',
          category: app.category || 'IMAGE',
          appType: app.appType || 'GENERATION',
          creditCost: app.creditCost || 0,
          isFree: app.isFree || false,
          isActive: app.isActive ?? true,
          iconUrl: app.iconUrl || '',
          coverImageUrl: app.coverImageUrl || '',
          externalUrl: app.externalUrl || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/apps/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          creditCost: parseInt(form.creditCost) || 0,
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update app');
      }

      router.push('/admin/apps');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in stagger" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/apps" className="btn btn-ghost btn-icon" style={{ flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-1">Edit App</h2>
          <p className="text-zinc-400">Update {form.name || 'app'} settings</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
            <span className="font-medium text-sm" style={{ color: form.isActive ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {form.isActive ? 'Active' : 'Disabled'}
            </span>
            <div
              onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
              style={{
                width: '44px', height: '24px', borderRadius: '12px', position: 'relative',
                background: form.isActive ? 'var(--color-success)' : 'var(--glass-bg)',
                border: `1px solid ${form.isActive ? 'var(--color-success)' : 'var(--glass-border)'}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                position: 'absolute', top: '2px', left: form.isActive ? '22px' : '2px',
                transition: 'left 0.2s',
              }} />
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderColor: 'var(--color-danger)', marginBottom: '24px' }}>
          <div className="p-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            <p style={{ color: 'var(--color-danger)' }}>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Basic Information</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="input-group">
              <label className="input-label">App Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. AI Image Generator" className="input" required />
            </div>

            <div className="input-group">
              <label className="input-label">URL Slug *</label>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>/app/</span>
                <input type="text" name="slug" value={form.slug} onChange={handleChange} placeholder="ai-image-generator" className="input" required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Short Description</label>
              <input type="text" name="shortDesc" value={form.shortDesc} onChange={handleChange} placeholder="A one-liner for the app card" className="input" maxLength={120} />
            </div>

            <div className="input-group">
              <label className="input-label">Full Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe what this app does..." className="input" required style={{ minHeight: '120px' }} />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Classification</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="input-group">
              <label className="input-label">Category *</label>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} type="button" onClick={() => setForm(prev => ({ ...prev, category: cat.value }))}
                    className="card p-6" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center',
                      borderColor: form.category === cat.value ? 'var(--accent-primary)' : undefined,
                      background: form.category === cat.value ? 'rgba(139, 92, 246, 0.1)' : undefined,
                      boxShadow: form.category === cat.value ? 'var(--shadow-glow)' : undefined,
                    }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{cat.icon}</div>
                    <div className="font-medium text-sm">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">App Type *</label>
              <div className="flex flex-col gap-3">
                {APP_TYPES.map(type => (
                  <button key={type.value} type="button" onClick={() => setForm(prev => ({ ...prev, appType: type.value }))}
                    className="card p-6 flex items-center gap-4" style={{ padding: '16px', cursor: 'pointer', textAlign: 'left',
                      borderColor: form.appType === type.value ? 'var(--accent-primary)' : undefined,
                      background: form.appType === type.value ? 'rgba(139, 92, 246, 0.1)' : undefined,
                      boxShadow: form.appType === type.value ? 'var(--shadow-glow)' : undefined,
                    }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${form.appType === type.value ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {form.appType === type.value && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{type.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{type.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Pricing</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                <div onClick={() => setForm(prev => ({ ...prev, isFree: !prev.isFree }))}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', position: 'relative',
                    background: form.isFree ? 'var(--color-success)' : 'var(--glass-bg)',
                    border: `1px solid ${form.isFree ? 'var(--color-success)' : 'var(--glass-border)'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px', left: form.isFree ? '22px' : '2px', transition: 'left 0.2s',
                  }} />
                </div>
                <span className="font-medium text-sm">This app is free</span>
              </label>
            </div>

            {!form.isFree && (
              <div className="input-group">
                <label className="input-label">Credit Cost per Use</label>
                <div className="flex items-center gap-3">
                  <input type="number" name="creditCost" value={form.creditCost} onChange={handleChange} min="0" className="input" style={{ maxWidth: '160px' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>credits per generation</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Media (Optional)</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="input-group">
              <label className="input-label">Icon URL</label>
              <input type="url" name="iconUrl" value={form.iconUrl} onChange={handleChange} placeholder="https://example.com/icon.png" className="input" />
            </div>
            <div className="input-group">
              <label className="input-label">Cover Image URL</label>
              <input type="url" name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange} placeholder="https://example.com/cover.jpg" className="input" />
            </div>
          </div>
        </div>

        {/* Integration */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Integration</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="input-group">
              <label className="input-label">External App URL (Optional)</label>
              <input
                type="url"
                name="externalUrl"
                value={form.externalUrl || ''}
                onChange={handleChange}
                placeholder="https://script-generator-xxxx.vercel.app"
                className="input"
              />
              <p className="text-xs text-zinc-500 mt-2">
                If provided, clicking "Open App" will redirect the user to this external URL instead of the internal app route.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link href="/admin/apps" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <><div className="spinner"></div>Saving...</>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
