'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'IMAGE', label: 'Image', icon: '🖼️' },
  { value: 'VIDEO', label: 'Video', icon: '🎬' },
  { value: 'AUDIO', label: 'Audio', icon: '🎵' },
  { value: 'TEXT', label: 'Text', icon: '📝' },
  { value: 'TOOL', label: 'Tool', icon: '🔧' },
  { value: 'UTILITY', label: 'Utility', icon: '⚙️' },
];

const ACCESS_TYPES = [
  { value: 'CREDIT', label: '🪙 Credit', desc: 'Anyone with credits can use — pay per generation' },
  { value: 'SUBSCRIBER', label: '⭐ Subscriber Only', desc: 'Pro plan required — unlimited use, no credit cost' },
  { value: 'SUBSCRIBER_CREDIT', label: '💎 Subscriber + Credit', desc: 'Pro plan required + credits per use' },
];

export default function NewAppPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    category: 'IMAGE',
    accessType: 'CREDIT',
    creditCost: 5,
    iconUrl: '',
    coverImageUrl: '',
    maxCreditCost: '',
    pricingMode: 'fixed',
    pricingRules: [],
    pricingComponents: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      setForm(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Build configJson
      const configJson = {};
      if (form.maxCreditCost) configJson.maxCreditCost = parseInt(form.maxCreditCost);
      configJson.pricingMode = form.pricingMode;

      if (form.pricingMode === 'fixed') {
        const pricingRules = {};
        const pricingLabels = {};
        form.pricingRules.forEach(rule => {
          if (rule.key && rule.cost !== '' && rule.cost !== undefined) {
            pricingRules[rule.key] = parseInt(rule.cost) || 0;
            if (rule.label) pricingLabels[rule.key] = rule.label;
          }
        });
        if (Object.keys(pricingRules).length > 0) configJson.pricingRules = pricingRules;
        if (Object.keys(pricingLabels).length > 0) configJson.pricingLabels = pricingLabels;
      } else if (form.pricingMode === 'components') {
        const pricingComponents = {};
        form.pricingComponents.forEach(comp => {
          if (!comp.name) return;
          const options = {};
          comp.options.forEach(opt => {
            if (!opt.key) return;
            if (comp.type === 'multiplier') {
              options[opt.key] = { label: opt.label || opt.key, factor: parseFloat(opt.value) || 1 };
            } else {
              options[opt.key] = { label: opt.label || opt.key, cost: parseInt(opt.value) || 0 };
            }
          });
          pricingComponents[comp.name] = { label: comp.label || comp.name, type: comp.type, options };
        });
        if (Object.keys(pricingComponents).length > 0) configJson.pricingComponents = pricingComponents;
      }

      const { pricingRules: _pr, maxCreditCost: _mc, pricingMode: _pm, pricingComponents: _pc, ...formWithoutPricing } = form;

      const res = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formWithoutPricing,
          creditCost: parseInt(form.creditCost) || 0,
          configJson: Object.keys(configJson).length > 0 ? configJson : null,
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create app');
      }

      router.push('/admin/apps');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in stagger" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/apps" className="btn btn-ghost btn-icon" style={{ flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h2 className="text-3xl font-bold mb-1">Create New App</h2>
          <p className="text-zinc-400">Add a new AI app to the marketplace</p>
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
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. AI Image Generator"
                className="input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">URL Slug *</label>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>/app/</span>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="ai-image-generator"
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Short Description</label>
              <input
                type="text"
                name="shortDesc"
                value={form.shortDesc}
                onChange={handleChange}
                placeholder="A one-liner that appears on the app card"
                className="input"
                maxLength={120}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Full Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what this app does, how it works, and what users can expect..."
                className="input"
                required
                style={{ minHeight: '120px' }}
              />
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
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, category: cat.value }))}
                    className="card p-6"
                    style={{
                      padding: '16px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      borderColor: form.category === cat.value ? 'var(--accent-primary)' : undefined,
                      background: form.category === cat.value ? 'rgba(139, 92, 246, 0.1)' : undefined,
                      boxShadow: form.category === cat.value ? 'var(--shadow-glow)' : undefined,
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{cat.icon}</div>
                    <div className="font-medium text-sm">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Access Type *</label>
              <div className="flex flex-col gap-3">
                {ACCESS_TYPES.map(type => (
                  <button key={type.value} type="button" onClick={() => setForm(prev => ({ ...prev, accessType: type.value }))}
                    className="card p-6 flex items-center gap-4" style={{ padding: '16px', cursor: 'pointer', textAlign: 'left',
                      borderColor: form.accessType === type.value ? 'var(--accent-primary)' : undefined,
                      background: form.accessType === type.value ? 'rgba(139, 92, 246, 0.1)' : undefined,
                      boxShadow: form.accessType === type.value ? 'var(--shadow-glow)' : undefined,
                    }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${form.accessType === type.value ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {form.accessType === type.value && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
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

        {/* Pricing — only for CREDIT and SUBSCRIBER_CREDIT */}
        {form.accessType !== 'SUBSCRIBER' && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Pricing</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Default Credit Cost</label>
                    <div className="flex items-center gap-3">
                      <input type="number" name="creditCost" value={form.creditCost} onChange={handleChange} min="0" className="input" style={{ maxWidth: '160px' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>fallback</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Max Credit Cost</label>
                    <div className="flex items-center gap-3">
                      <input type="number" name="maxCreditCost" value={form.maxCreditCost} onChange={handleChange} min="0" className="input" style={{ maxWidth: '160px' }} placeholder="Auto" />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>safety cap</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Mode Toggle */}
                <div style={{ marginTop: '8px' }}>
                  <label className="input-label" style={{ marginBottom: '8px' }}>Pricing Mode</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { value: 'fixed', label: 'Fixed Rules', desc: 'Simple key → cost mapping' },
                      { value: 'components', label: 'Components', desc: 'Multi-dimension pricing (model × resolution)' },
                    ].map(mode => (
                      <button key={mode.value} type="button"
                        onClick={() => setForm(prev => ({ ...prev, pricingMode: mode.value }))}
                        className="card" style={{
                          flex: 1, padding: '14px', cursor: 'pointer', textAlign: 'left',
                          borderColor: form.pricingMode === mode.value ? 'var(--accent-primary)' : undefined,
                          background: form.pricingMode === mode.value ? 'rgba(139,92,246,0.1)' : undefined,
                        }}>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)', marginBottom: '2px' }}>{mode.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{mode.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fixed Rules Editor */}
                {form.pricingMode === 'fixed' && (
                  <div style={{ marginTop: '4px' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Apps fetch these at runtime. Change here → instant effect, no code changes.</p>
                    {form.pricingRules.length > 0 && (
                      <div style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 40px', gap: '12px', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Label</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Credits</span>
                          <span></span>
                        </div>
                        {form.pricingRules.map((rule, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 40px', gap: '12px', padding: '8px 16px', borderBottom: idx < form.pricingRules.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                            <input type="text" value={rule.key} onChange={e => { const u = [...form.pricingRules]; u[idx] = { ...u[idx], key: e.target.value }; setForm(prev => ({ ...prev, pricingRules: u })); }} placeholder="e.g. 5" className="input" style={{ padding: '8px 10px', fontSize: '13px' }} />
                            <input type="text" value={rule.label} onChange={e => { const u = [...form.pricingRules]; u[idx] = { ...u[idx], label: e.target.value }; setForm(prev => ({ ...prev, pricingRules: u })); }} placeholder="e.g. 5-min script" className="input" style={{ padding: '8px 10px', fontSize: '13px' }} />
                            <input type="number" value={rule.cost} onChange={e => { const u = [...form.pricingRules]; u[idx] = { ...u[idx], cost: e.target.value }; setForm(prev => ({ ...prev, pricingRules: u })); }} placeholder="0" min="0" className="input" style={{ padding: '8px 10px', fontSize: '13px' }} />
                            <button type="button" onClick={() => setForm(prev => ({ ...prev, pricingRules: prev.pricingRules.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', padding: '4px', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, pricingRules: [...prev.pricingRules, { key: '', label: '', cost: '' }] }))} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1px dashed var(--glass-border)', background: 'transparent', color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      + Add Pricing Rule
                    </button>
                  </div>
                )}

                {/* Components Editor */}
                {form.pricingMode === 'components' && (
                  <div style={{ marginTop: '4px' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Define dimensions (e.g. Model, Resolution). App calculates: base cost × multiplier.</p>
                    {form.pricingComponents.map((comp, cIdx) => (
                      <div key={cIdx} style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                          <input type="text" value={comp.name} onChange={e => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], name: e.target.value }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="e.g. model" className="input" style={{ padding: '6px 10px', fontSize: '13px', maxWidth: '120px' }} />
                          <input type="text" value={comp.label} onChange={e => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], label: e.target.value }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="e.g. AI Model" className="input" style={{ padding: '6px 10px', fontSize: '13px', flex: 1 }} />
                          <select value={comp.type} onChange={e => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], type: e.target.value }; setForm(prev => ({ ...prev, pricingComponents: u })); }} className="input" style={{ padding: '6px 10px', fontSize: '13px', maxWidth: '140px' }}>
                            <option value="base">Base Cost</option>
                            <option value="multiplier">Multiplier</option>
                          </select>
                          <button type="button" onClick={() => setForm(prev => ({ ...prev, pricingComponents: prev.pricingComponents.filter((_, i) => i !== cIdx) }))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', padding: '4px' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 40px', gap: '8px', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Key</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Label</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>{comp.type === 'multiplier' ? 'Factor' : 'Cost'}</span>
                          <span></span>
                        </div>
                        {comp.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 40px', gap: '8px', padding: '6px 16px', borderBottom: oIdx < comp.options.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', alignItems: 'center' }}>
                            <input type="text" value={opt.key} onChange={e => { const u = [...form.pricingComponents]; const opts = [...u[cIdx].options]; opts[oIdx] = { ...opts[oIdx], key: e.target.value }; u[cIdx] = { ...u[cIdx], options: opts }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="key" className="input" style={{ padding: '6px 8px', fontSize: '12px' }} />
                            <input type="text" value={opt.label} onChange={e => { const u = [...form.pricingComponents]; const opts = [...u[cIdx].options]; opts[oIdx] = { ...opts[oIdx], label: e.target.value }; u[cIdx] = { ...u[cIdx], options: opts }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="label" className="input" style={{ padding: '6px 8px', fontSize: '12px' }} />
                            <input type="number" value={opt.value} onChange={e => { const u = [...form.pricingComponents]; const opts = [...u[cIdx].options]; opts[oIdx] = { ...opts[oIdx], value: e.target.value }; u[cIdx] = { ...u[cIdx], options: opts }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="0" step={comp.type === 'multiplier' ? '0.1' : '1'} className="input" style={{ padding: '6px 8px', fontSize: '12px' }} />
                            <button type="button" onClick={() => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], options: u[cIdx].options.filter((_, i) => i !== oIdx) }; setForm(prev => ({ ...prev, pricingComponents: u })); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                          </div>
                        ))}
                        <div style={{ padding: '8px 16px' }}>
                          <button type="button" onClick={() => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], options: [...u[cIdx].options, { key: '', label: '', value: '' }] }; setForm(prev => ({ ...prev, pricingComponents: u })); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, padding: '4px 0' }}>
                            + Add Option
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, pricingComponents: [...prev.pricingComponents, { name: '', label: '', type: 'base', options: [{ key: '', label: '', value: '' }] }] }))} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1px dashed var(--glass-border)', background: 'transparent', color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      + Add Component
                    </button>
                  </div>
                )}
              </>
          </div>
        </div>
        )}
        {/* Media */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Media (Optional)</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="input-group">
              <label className="input-label">Icon URL</label>
              <input
                type="url"
                name="iconUrl"
                value={form.iconUrl}
                onChange={handleChange}
                placeholder="https://example.com/icon.png"
                className="input"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Cover Image URL</label>
              <input
                type="url"
                name="coverImageUrl"
                value={form.coverImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
                className="input"
              />
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

        {/* Preview Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 style={{ fontSize: '1.1rem' }}>Preview</h3>
          </div>
          <div className="p-6">
            <div className="card card-hover" style={{ maxWidth: '320px', overflow: 'hidden' }}>
              <div style={{
                height: '120px',
                background: form.coverImageUrl ? `url(${form.coverImageUrl}) center/cover` : 'var(--gradient-primary)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', bottom: '-20px', left: '16px',
                  width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                  background: form.iconUrl ? `url(${form.iconUrl}) center/cover` : 'var(--bg-elevated)',
                  border: '3px solid var(--bg-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                }}>
                  {!form.iconUrl && '🤖'}
                </div>
              </div>
              <div className="p-6" style={{ paddingTop: '28px' }}>
                <h4 className="font-bold" style={{ marginBottom: '4px' }}>
                  {form.name || 'App Name'}
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {form.shortDesc || form.description || 'App description goes here...'}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`badge ${categoryColors[form.category] || 'badge-primary'}`}>
                    {form.category}
                  </span>
                  <span className="text-sm font-semibold">
                    {form.accessType === 'SUBSCRIBER' ? '∞ Unlimited' : `${form.creditCost} credits`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link href="/admin/apps" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <div className="spinner"></div>
                Creating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Create App
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

const categoryColors = {
  IMAGE: 'badge-primary',
  VIDEO: 'badge-info',
  AUDIO: 'badge-warning',
  TEXT: 'badge-success',
  TOOL: 'badge-info',
  UTILITY: 'badge-warning',
};
