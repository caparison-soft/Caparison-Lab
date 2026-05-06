'use client';

import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Topbar() {
  const router = useRouter();
  const supabase = createClient();

  // Fetch real-time credits using SWR
  const { data, error, isLoading } = useSWR('/api/user/credits', fetcher);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

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
          <button onClick={handleLogout} style={{ fontSize: '14px', color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}>
            Logout
          </button>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            padding: '2px',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>US</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
