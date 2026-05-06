import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/prisma';
import { redirect } from 'next/navigation';
import AutoPayToggle from './AutoPayToggle';
import CreditPackageSelector from './CreditPackageSelector';

export const metadata = {
  title: 'Billing & Subscriptions | Caparison Lab',
  description: 'Manage your plan, credits, and payments.',
};

const cardStyle = {
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    redirect('/login');
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '48px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Billing</h1>
        <p style={{ color: '#a1a1aa', fontSize: '15px' }}>Manage payment details</p>
      </div>

      {/* Row 1: Balance Info + Add Credits */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Balance Information Card */}
        <div style={{ ...cardStyle, padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Balance Information</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '40px', fontWeight: 700 }}>{dbUser.credits}</span>
            <span style={{ fontSize: '16px', color: '#a1a1aa' }}>credits</span>
          </div>
          <p style={{ fontSize: '13px', color: '#71717a', textAlign: 'right', marginBottom: '24px' }}>Current Balance</p>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>⚠</span>
              <span style={{ color: '#a1a1aa', fontSize: '13px', lineHeight: 1.5 }}>Credits never expire and can be used anytime</span>
            </div>
          </div>

          <h4 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>Rate Limit</h4>
          <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '16px' }}>
            Each account is limited to 20 new generation requests per 10 seconds(≈ 100+ concurrent tasks).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>⚠</span>
              <span style={{ color: '#a1a1aa', fontSize: '13px' }}>Enforced per account</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>⚠</span>
              <span style={{ color: '#a1a1aa', fontSize: '13px' }}>Excess requests return HTTP 429 and are not queued</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#71717a', lineHeight: 1.6 }}>
            This limit is sufficient for most users. If you consistently hit 429, contact support to request an increase (reviewed carefully).
          </p>
        </div>

        {/* Add Credits Card */}
        <div style={{ ...cardStyle, padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Add Credits</h3>
          <CreditPackageSelector />
        </div>
      </div>

      {/* Row 2: Automatic Payments */}
      <div style={{ ...cardStyle, padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Automatic Payments</h3>
        <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7, marginBottom: '24px' }}>
          Configure automatic billing by adding a card to your account. When your balance nears your Auto-Pay threshold, we will attempt to reload credits by billing your saved card max once every 10 minutes for the Auto-Pay amount that is configured below.
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ fontWeight: 500, fontSize: '15px' }}>Enable auto top-ups</span>
          <AutoPayToggle />
        </div>
      </div>

      {/* Row 3: Transaction History */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid var(--glass-border)',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Transaction History</h3>
          <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            Refresh
          </button>
        </div>
        
        {transactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.3, color: '#a1a1aa' }}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            <p style={{ color: '#71717a' }}>No pay order found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 28px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>DateTime</th>
                  <th style={{ padding: '14px 28px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>Credits</th>
                  <th style={{ padding: '14px 28px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>Amount</th>
                  <th style={{ padding: '14px 28px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ padding: '16px 28px', fontSize: '14px', color: '#a1a1aa', borderBottom: '1px solid var(--glass-border)' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '16px 28px', fontSize: '14px', fontWeight: 600, color: tx.type === 'CREDIT_DEDUCTION' ? '#f87171' : '#34d399', borderBottom: '1px solid var(--glass-border)' }}>
                      {tx.type === 'CREDIT_DEDUCTION' ? '-' : '+'}{tx.creditsAmount}
                    </td>
                    <td style={{ padding: '16px 28px', fontSize: '14px', color: '#a1a1aa', borderBottom: '1px solid var(--glass-border)' }}>{tx.moneyAmount ? `$${tx.moneyAmount.toFixed(2)}` : 'Free'}</td>
                    <td style={{ padding: '16px 28px', fontSize: '14px', color: '#71717a', borderBottom: '1px solid var(--glass-border)' }}>N/A</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
