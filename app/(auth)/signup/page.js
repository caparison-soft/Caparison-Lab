'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });

      if (error) throw error;
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists.');
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="card shadow-xl border-white/10 overflow-hidden text-center">
        <div className="card-body px-8 py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-zinc-400 mb-8">
            We sent a confirmation link to <span className="text-white font-medium">{email}</span>. 
            Please click it to activate your account.
          </p>
          <Link href="/login" className="btn btn-primary w-full">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-xl border-white/10 overflow-hidden">
      <div className="card-header border-b border-white/5 text-center pt-8 pb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            C
          </div>
          <span className="text-xl font-bold tracking-tight">Caparison Lab</span>
        </Link>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-zinc-400 text-sm mt-2">Get started with free credits today</p>
      </div>

      <div className="card-body px-8 py-6">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignup}
          className="btn btn-secondary w-full mb-6 flex items-center justify-center gap-3 h-12"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div className="divider-text mb-6">Or register with email</div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              className="input" 
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              className="input" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full h-12 mt-2"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>
      </div>
      
      <div className="card-footer bg-black/20 text-center py-4 border-t border-white/5">
        <p className="text-sm text-zinc-400">
          Already have an account? <Link href="/login" className="text-white font-medium hover:text-indigo-400 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
