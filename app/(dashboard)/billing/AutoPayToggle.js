'use client';

import { useState } from 'react';

export default function AutoPayToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <button 
      onClick={() => setEnabled(!enabled)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        height: '26px',
        width: '48px',
        alignItems: 'center',
        borderRadius: '9999px',
        transition: 'background 0.2s',
        background: enabled ? '#6366f1' : '#3f3f46',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <span 
        style={{
          display: 'inline-block',
          height: '20px',
          width: '20px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'transform 0.2s',
          transform: enabled ? 'translateX(24px)' : 'translateX(4px)',
        }}
      />
    </button>
  );
}
