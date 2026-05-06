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

  return (
    <div className="card h-full min-h-[500px] flex flex-col relative overflow-hidden">
      {/* Background embellishment */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
      </div>
      
      <div className="card-header border-b border-white/5 bg-black/20 flex justify-between items-center">
        <h3 className="font-bold">Workspace: {app.name}</h3>
      </div>
      
      <div className="card-body flex-1 flex flex-col p-6 relative z-10">
        {!result && (
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Input Prompt
            </label>
            <textarea 
              className="input w-full flex-1 bg-black/20 resize-none p-4 font-mono text-sm mb-4" 
              placeholder="Describe what you want to generate..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
            
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button 
              onClick={handleExecute} 
              disabled={isExecuting || (!inputData.trim() && app.appType !== 'UTILITY')}
              className="btn btn-primary w-full shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Generation Complete!</h2>
            <p className="text-zinc-400 mb-6">{result.message}</p>
            
            <div className="w-full max-w-md rounded-xl overflow-hidden border border-white/10 mb-6 shadow-xl relative group">
               <img src={result.mockOutputUrl} alt="Generated output" className="w-full h-auto" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button className="btn btn-secondary text-sm">Download</button>
               </div>
            </div>

            <button 
              onClick={() => { setResult(null); setInputData(''); }} 
              className="btn btn-outline"
            >
              Generate Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
