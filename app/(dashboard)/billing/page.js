import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/prisma';
import { redirect } from 'next/navigation';
import AutoPayToggle from './AutoPayToggle';

export const metadata = {
  title: 'Billing & Subscriptions | Caparison Lab',
  description: 'Manage your plan, credits, and payments.',
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Fetch db user
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    redirect('/login');
  }

  // Fetch transactions
  const transactions = await prisma.transaction.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="animate-fade-in stagger max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-zinc-400">Manage your subscription, credits, and view transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Plan Overview Card */}
        <div className="card">
          <div className="card-header border-b border-white/5 pb-4 mb-4">
            <h3 className="font-semibold text-lg flex items-center justify-between">
              Current Plan
              <span className="badge badge-primary px-3 py-1 text-sm">{dbUser.subscriptionTier}</span>
            </h3>
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Available Credits</p>
                <p className="text-3xl font-bold">{dbUser.credits}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-primary flex-1">Buy Credits</button>
              <button className="btn btn-secondary flex-1">Upgrade Plan</button>
            </div>
          </div>
        </div>

        {/* Automatic Payments Card */}
        <div className="card">
          <div className="card-header border-b border-white/5 pb-4 mb-4">
            <h3 className="font-semibold text-lg">Automatic Payments</h3>
          </div>
          <div className="px-6 pb-6">
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Configure automatic billing by adding a card to your account. When your balance nears your Auto-Pay threshold, we will attempt to reload credits by billing your saved card max once every 10 minutes for the Auto-Pay amount.
            </p>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="font-medium">Enable auto top-ups</span>
              <AutoPayToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold text-lg">Transaction History</h3>
          <button className="btn btn-secondary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            Refresh
          </button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-30"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            <p>No pay order found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead className="bg-white/5">
                <tr>
                  <th>DateTime</th>
                  <th>Credits</th>
                  <th>Amount</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className={tx.type === 'CREDIT_DEDUCTION' ? 'text-red-400' : 'text-green-400'}>
                      {tx.type === 'CREDIT_DEDUCTION' ? '-' : '+'}{tx.creditsAmount}
                    </td>
                    <td>{tx.moneyAmount ? `$${tx.moneyAmount.toFixed(2)}` : 'Free'}</td>
                    <td>
                      <span className="text-zinc-500">N/A</span>
                    </td>
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
