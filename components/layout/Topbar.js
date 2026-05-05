'use client';

import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-20 border-b border-white/5 bg-primary/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <h1 className="text-xl font-semibold hidden sm:block">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Credits Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
          <span className="font-semibold text-sm">150</span>
          <span className="text-xs text-zinc-400 uppercase font-medium">Credits</span>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-white transition-colors">
            Logout
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 p-[2px]">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
              {/* <img src="avatar.jpg" alt="User" /> */}
              <span className="font-bold text-sm">US</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
