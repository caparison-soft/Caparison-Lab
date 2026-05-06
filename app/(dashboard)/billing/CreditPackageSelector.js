'use client';

import { useState } from 'react';

const packages = [
  { price: 5, credits: 1000, label: '$5', save: null },
  { price: 50, credits: 10000, label: '$50', save: null },
  { price: 500, credits: 105000, label: '$500', save: '5%' },
  { price: 1250, credits: 275000, label: '$1250', save: '10%' },
];

const cardStyle = {
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
};

export default function CreditPackageSelector() {
  const [selected, setSelected] = useState(1); // default to $50

  return (
    <div>
      {/* Select Package */}
      <h4 style={{ fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>Select Package</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {packages.map((pkg, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '20px 12px',
              borderRadius: '12px',
              border: selected === i ? '2px solid #6366f1' : '1px solid var(--glass-border)',
              background: selected === i ? 'rgba(99,102,241,0.1)' : 'var(--glass-bg)',
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.2s',
              color: '#fafafa',
            }}
          >
            {pkg.save && (
              <span style={{
                position: 'absolute',
                top: '-1px',
                right: '-1px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '0 12px 0 8px',
                textTransform: 'uppercase',
              }}>
                Save {pkg.save}
              </span>
            )}
            <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{pkg.label}</div>
            <div style={{ fontSize: '13px', color: '#a1a1aa' }}>{pkg.credits.toLocaleString()} credits</div>
          </button>
        ))}
      </div>

      {/* Payment Method */}
      <h4 style={{ fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>Payment Method</h4>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[
          { icon: '💳', label: 'Card', active: true },
          { icon: '🅿️', label: '', active: false },
          { icon: '🍎', label: '', active: false },
          { icon: '₿', label: '', active: false },
          { icon: '•••', label: '', active: false },
        ].map((method, i) => (
          <button
            key={i}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              border: method.active ? '1px solid #6366f1' : '1px solid var(--glass-border)',
              background: method.active ? 'rgba(99,102,241,0.1)' : 'var(--glass-bg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: method.active ? '#fff' : '#a1a1aa',
              transition: 'all 0.2s',
            }}
          >
            <span>{method.icon}</span>
            {method.label && <span style={{ fontWeight: 500 }}>{method.label}</span>}
          </button>
        ))}
      </div>

      {/* Billing Address */}
      <h4 style={{ fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '16px' }}>Billing Address</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '6px', display: 'block' }}>
            Country or Region <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            color: '#fafafa',
            fontSize: '14px',
            cursor: 'pointer',
            appearance: 'auto',
          }}>
            <option>Bangladesh</option>
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '6px', display: 'block' }}>
            Zip Code <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter zip code"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--glass-border)',
              color: '#fafafa',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      {/* Buy Credits Button */}
      <button style={{
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        background: 'var(--gradient-primary)',
        color: '#fff',
        fontWeight: 700,
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
        transition: 'all 0.2s',
      }}>
        Buy Credits
      </button>
    </div>
  );
}
