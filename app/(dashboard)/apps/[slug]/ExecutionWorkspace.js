'use client';

import { useState } from 'react';
import { mutate } from 'swr';

export default function ExecutionWorkspace({ app }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState('');

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/apps/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          inputData: { prompt: inputData }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setError(`Not enough credits. You need ${data.required} but have ${data.available}.`);
        } else {
          setError(data.error || 'Execution failed.');
        }
        return;
      }

      setResult(data);
      // Immediately tell SWR to re-fetch the user's credits so the Topbar updates instantly!
      mutate('/api/user/credits');
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during execution.');
    } finally {
      setIsExecuting(false);
    }
  };

  const cardStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
  };

  return (
    <div style={{ ...cardStyle, height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background embellishment */}
      <div style={{ position: 'absolute', top: '0', right: '0', padding: '48px', opacity: 0.05, pointerEvents: 'none' }}>
        <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
      </div>
      
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontWeight: 700, fontSize: '18px' }}>Workspace: {app.name}</h3>
      </div>
      
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
        {!result && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#a1a1aa', marginBottom: '8px' }}>
              Input Prompt
            </label>
            <textarea 
              style={{
                width: '100%',
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                resize: 'none',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#fafafa',
                marginBottom: '16px',
                outline: 'none',
              }}
              placeholder="Describe what you want to generate..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
            
            {error && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button 
              onClick={handleExecute} 
              disabled={isExecuting || (!inputData.trim() && app.appType !== 'UTILITY')}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--gradient-primary)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '16px',
                border: 'none',
                cursor: (isExecuting || (!inputData.trim() && app.appType !== 'UTILITY')) ? 'not-allowed' : 'pointer',
                opacity: (isExecuting || (!inputData.trim() && app.appType !== 'UTILITY')) ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {isExecuting ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px', color: '#ffffff' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Generate ({app.isFree ? 'Free' : `${app.creditCost} Credits`})
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Generation Complete!</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>{result.message}</p>
            
            <div style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', position: 'relative' }}>
               <img src={result.mockOutputUrl} alt="Generated output" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            <button 
              onClick={() => { setResult(null); setInputData(''); }} 
              style={{ padding: '12px 24px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--glass-border)', color: '#fafafa', cursor: 'pointer', fontWeight: 500 }}
            >
              Generate Another
            </button>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
