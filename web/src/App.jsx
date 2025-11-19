import React, { useEffect, useState } from 'react';
import { api } from './api.js';
import ModifyScreen from './screens/ModifyScreen.jsx';
import LogScreen from './screens/LogScreen.jsx';

export default function App() {
  const [tab, setTab] = useState('modify');
  const [health, setHealth] = useState('Checking...');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/healthz');
        if (res.data?.ok) setHealth('API OK');
        else setHealth('API responded but not OK');
      } catch (err) {
        console.error(err);
        setHealth('API unreachable');
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setTab('modify')}
            className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800 transition"
          >
            ← Modify
          </button>
          <div className="text-center flex-1">
            <h1 className="text-lg font-semibold tracking-tight">Habit Battles</h1>
            <p className="text-[11px] text-slate-400">
              Status: {health}{checking ? ' (checking...)' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTab('log')}
            className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800 transition"
          >
            Log →
          </button>
        </div>
        <div className="mx-auto max-w-md px-4 pb-2">
          <nav className="grid grid-cols-2 gap-2 rounded-full bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => setTab('modify')}
              className={
                'text-xs rounded-full px-3 py-1.5 transition ' +
                (tab === 'modify'
                  ? 'bg-slate-100 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800')
              }
            >
              Profile & Habits
            </button>
            <button
              type="button"
              onClick={() => setTab('log')}
              className={
                'text-xs rounded-full px-3 py-1.5 transition ' +
                (tab === 'log'
                  ? 'bg-slate-100 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800')
              }
            >
              Daily Log
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 pb-8 pt-4 space-y-4">
          {tab === 'modify' ? <ModifyScreen /> : <LogScreen />}
        </div>
      </main>

      <footer className="border-t border-slate-900 text-[11px] text-slate-500 py-3 text-center">
        Built for backend testing • React + Tailwind
      </footer>
    </div>
  );
}
