import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Generation History | Caparison Lab',
  description: 'View your AI generation history.',
};

export default async function HistoryPage() {
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

  // Fetch generations
  const generations = await prisma.generation.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
    include: { app: true },
  });

  return (
    <div className="animate-fade-in stagger max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generation History</h1>
        <p className="text-zinc-400">View all your past AI generations and their outputs.</p>
      </div>

      <div className="card">
        {generations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No Generations Yet</h3>
            <p className="empty-state-desc">You haven't used any AI tools yet. Head over to the App Market to start creating!</p>
            <Link href="/apps" className="btn btn-primary mt-4">
              Explore Apps
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>App</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Credits</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((gen) => (
                  <tr key={gen.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {gen.app.iconUrl ? (
                          <img src={gen.app.iconUrl} alt={gen.app.name} className="w-8 h-8 rounded bg-white/5" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-xs">
                            {gen.app.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-white">{gen.app.name}</span>
                      </div>
                    </td>
                    <td>{new Date(gen.createdAt).toLocaleDateString()} at {new Date(gen.createdAt).toLocaleTimeString()}</td>
                    <td>
                      <span className={`badge ${
                        gen.status === 'COMPLETED' ? 'badge-success' : 
                        gen.status === 'FAILED' ? 'badge-danger' : 
                        'badge-warning'
                      }`}>
                        {gen.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-red-400 font-medium">-{gen.creditsUsed}</span>
                    </td>
                    <td>
                      {gen.outputUrl ? (
                        <a href={gen.outputUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm">
                          View Output ↗
                        </a>
                      ) : (
                        <span className="text-zinc-500 text-sm">N/A</span>
                      )}
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
