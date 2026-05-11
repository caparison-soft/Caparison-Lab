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

const ACCESS_TYPES = [
  { value: 'CREDIT', label: '🪙 Credit', desc: 'Anyone with credits can use — pay per generation' },
  { value: 'SUBSCRIBER', label: '⭐ Subscriber Only', desc: 'Pro plan required — unlimited use, no credit cost' },
  { value: 'SUBSCRIBER_CREDIT', label: '💎 Subscriber + Credit', desc: 'Pro plan required + credits per use' },
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
    accessType: 'CREDIT',
    creditCost: 5,
    isActive: true,
    iconUrl: '',
    coverImageUrl: '',
    externalUrl: '',
    maxCreditCost: '',
    pricingMode: 'fixed',  // 'fixed' or 'components'
    pricingRules: [],  // [{ key, label, cost }]
    pricingComponents: [],  // [{ name, label, type: 'base'|'multiplier', options: [{ key, label, value }] }]
  });

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`/api/admin/apps/${params.id}`);
        if (!res.ok) throw new Error('App not found');
        const app = await res.json();
        const config = app.configJson || {};
        // Convert pricingRules/pricingLabels objects to array format for the editor
        const rulesObj = config.pricingRules || {};
        const labelsObj = config.pricingLabels || {};
        const pricingRules = Object.keys(rulesObj).map(key => ({
          key,
          label: labelsObj[key] || '',
          cost: rulesObj[key],
        }));

        // Convert components object to array format
        const componentsObj = config.pricingComponents || {};
        const pricingComponents = Object.keys(componentsObj).map(name => {
          const comp = componentsObj[name];
          return {
            name,
            label: comp.label || name,
            type: comp.type || 'base',
            options: Object.keys(comp.options || {}).map(key => ({
              key,
              label: comp.options[key].label || key,
              value: comp.options[key].cost ?? comp.options[key].factor ?? 0,
            })),
          };
        });

        setForm({
          name: app.name || '',
          slug: app.slug || '',
          description: app.description || '',
          shortDesc: app.shortDesc || '',
          category: app.category || 'IMAGE',
          accessType: app.accessType || 'CREDIT',
          creditCost: app.creditCost || 0,
          isActive: app.isActive ?? true,
          iconUrl: app.iconUrl || '',
          coverImageUrl: app.coverImageUrl || '',
          externalUrl: app.externalUrl || '',
          maxCreditCost: config.maxCreditCost || '',
          pricingMode: config.pricingMode || (Object.keys(componentsObj).length > 0 ? 'components' : 'fixed'),
          pricingRules,
          pricingComponents,
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
      // Build configJson from form fields
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

      const res = await fetch(`/api/admin/apps/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formWithoutPricing,
          creditCost: parseInt(form.creditCost) || 0,
          configJson: Object.keys(configJson).length > 0 ? configJson : null,
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

        {/* Pricing — only show for CREDIT and SUBSCRIBER_CREDIT */}
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
                            <button type="button" onClick={() => setForm(prev => ({ ...prev, pricingRules: prev.pricingRules.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', padding: '4px', borderRadius: '6px' }} onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>×</button>
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
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Define dimensions (e.g. Model, Resolution). App calculates: base cost × multiplier. Change here → instant effect.</p>
                    
                    {form.pricingComponents.map((comp, cIdx) => (
                      <div key={cIdx} style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                        {/* Component Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                          <input type="text" value={comp.name} onChange={e => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], name: e.target.value }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="e.g. model" className="input" style={{ padding: '6px 10px', fontSize: '13px', maxWidth: '120px' }} />
                          <input type="text" value={comp.label} onChange={e => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], label: e.target.value }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="e.g. AI Model" className="input" style={{ padding: '6px 10px', fontSize: '13px', flex: 1 }} />
                          <select value={comp.type} onChange={e => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], type: e.target.value }; setForm(prev => ({ ...prev, pricingComponents: u })); }} className="input" style={{ padding: '6px 10px', fontSize: '13px', maxWidth: '140px' }}>
                            <option value="base">Base Cost</option>
                            <option value="multiplier">Multiplier</option>
                          </select>
                          <button type="button" onClick={() => setForm(prev => ({ ...prev, pricingComponents: prev.pricingComponents.filter((_, i) => i !== cIdx) }))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', padding: '4px', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                        </div>
                        
                        {/* Options Table Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 40px', gap: '8px', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Key</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Label</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>{comp.type === 'multiplier' ? 'Factor' : 'Cost'}</span>
                          <span></span>
                        </div>
                        
                        {/* Options Rows */}
                        {comp.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 40px', gap: '8px', padding: '6px 16px', borderBottom: oIdx < comp.options.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', alignItems: 'center' }}>
                            <input type="text" value={opt.key} onChange={e => { const u = [...form.pricingComponents]; const opts = [...u[cIdx].options]; opts[oIdx] = { ...opts[oIdx], key: e.target.value }; u[cIdx] = { ...u[cIdx], options: opts }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="key" className="input" style={{ padding: '6px 8px', fontSize: '12px' }} />
                            <input type="text" value={opt.label} onChange={e => { const u = [...form.pricingComponents]; const opts = [...u[cIdx].options]; opts[oIdx] = { ...opts[oIdx], label: e.target.value }; u[cIdx] = { ...u[cIdx], options: opts }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="label" className="input" style={{ padding: '6px 8px', fontSize: '12px' }} />
                            <input type="number" value={opt.value} onChange={e => { const u = [...form.pricingComponents]; const opts = [...u[cIdx].options]; opts[oIdx] = { ...opts[oIdx], value: e.target.value }; u[cIdx] = { ...u[cIdx], options: opts }; setForm(prev => ({ ...prev, pricingComponents: u })); }} placeholder="0" step={comp.type === 'multiplier' ? '0.1' : '1'} className="input" style={{ padding: '6px 8px', fontSize: '12px' }} />
                            <button type="button" onClick={() => { const u = [...form.pricingComponents]; u[cIdx] = { ...u[cIdx], options: u[cIdx].options.filter((_, i) => i !== oIdx) }; setForm(prev => ({ ...prev, pricingComponents: u })); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                          </div>
                        ))}
                        
                        {/* Add Option Button */}
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
