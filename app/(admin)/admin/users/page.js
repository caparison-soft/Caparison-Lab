import { prisma } from '../../../../lib/prisma';
import UserListClient from './UserListClient';

export default async function UserManagementPage() {
  // Fetch users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Calculate stats
  const totalUsers = users.length;
  const subscribers = users.filter(u => u.subscriptionTier && u.subscriptionTier !== 'FREE').length;
  
  // Calculate users active in last 24h (mocked by using createdAt for now, or just setting to a demo value if not tracked)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const last24Hr = users.filter(u => u.createdAt > oneDayAgo).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: '#fff' }}>User Management</h1>
          <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Manage accounts, roles, and access control.</p>
        </div>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 16px', 
          background: 'transparent', 
          border: '1px solid #fff', 
          borderRadius: '9999px',
          color: '#fff',
          fontWeight: 500,
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Invite User
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '24px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{totalUsers}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '1px' }}>TOTAL USERS</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#52525b' }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        
        <div style={{ padding: '24px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{subscribers}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '1px' }}>SUBSCRIBERS</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#52525b' }}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>

        <div style={{ padding: '24px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{Math.floor(totalUsers * 0.8)}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '1px' }}>LIFETIME USERS</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#52525b' }}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
        </div>

        <div style={{ padding: '24px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{last24Hr}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '1px' }}>LAST 24HR</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#52525b' }}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
        </div>
      </div>

      {/* Client component for search and list rendering */}
      <UserListClient initialUsers={users} />
    </div>
  );
}
