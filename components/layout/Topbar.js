'use client';

import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Topbar({ user, role }) {
  const router = useRouter();
  const supabase = createClient();

  // Fetch real-time credits using SWR
  const { data, error, isLoading } = useSWR('/api/user/credits', fetcher);

  return (
    <header style={{
      height: '72px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(9,9,11,0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600 }}>Dashboard</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Back to Website Button */}
        <Link href="/" style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#a1a1aa',
          textDecoration: 'none',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Back to Website
        </Link>

        {/* Credits Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#facc15' }}><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
          {isLoading ? (
            <span style={{ width: '24px', height: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></span>
          ) : (
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{data?.credits ?? 0}</span>
          )}
          <span style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>Credits</span>
        </div>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <ProfileDropdown user={user} role={role} />
        </div>
      </div>
    </header>
  );
}
