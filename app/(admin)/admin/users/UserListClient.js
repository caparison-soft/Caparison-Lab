'use client';

import { useState } from 'react';

export default function UserListClient({ initialUsers }) {
  const [search, setSearch] = useState('');

  const filteredUsers = initialUsers.filter(user => {
    const term = search.toLowerCase();
    const nameMatch = user.displayName?.toLowerCase().includes(term) || false;
    const emailMatch = user.email?.toLowerCase().includes(term) || false;
    return nameMatch || emailMatch;
  });

  const getInitials = (email, name) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  return (
    <div>
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '16px 16px 16px 48px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
        />
      </div>

      <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '1px', marginBottom: '16px' }}>
        SHOWING {filteredUsers.length} USERS
      </div>

      {/* User List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredUsers.map(user => (
          <div 
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '32px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#121214'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#0a0a0a'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#fff',
              }}>
                {getInitials(user.email, user.displayName)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 500, color: '#fff', fontSize: '15px' }}>
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                  {user.role === 'ADMIN' && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '4px' }}>
                      ADMIN
                    </span>
                  )}
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '13px' }}>
                  {user.email} • {timeAgo(user.createdAt)}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px', marginBottom: '2px' }}>
                ${(user.credits || 0).toLocaleString()}
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '13px' }}>
                Active
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>
            No users found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
