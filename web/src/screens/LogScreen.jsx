import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import HabitPill from '../components/HabitPill.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function LogScreen() {
  const [user, setUser] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await api.get('/users?limit=1');
        if (list.data.items && list.data.items.length) {
          setUser(list.data.items[0]);
        } else {
          setError('No user found. Visit the Profile tab to create one.');
        }
      } catch (err) {
        console.error('LogScreen load error', err);
        setError('Unable to load user.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = async (habit) => {
    if (!user) return;
    try {
      const { data } = await api.patch(`/habits/${user._id}/${habit._id}`, {
        completed: !habit.completed
      });
      setUser(data);
      if (data.completionPct === 100) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to toggle habit.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-slate-300">
        Loading habits…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-xs text-amber-100">
        {error || 'No user loaded.'}
      </div>
    );
  }

  const activeHabits = user.habits.filter((h) => h.isActive);
  const pct = user.completionPct || 0;

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs text-red-100">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Today&apos;s habits</h2>
            <p className="text-[11px] text-slate-500">
              Tap to mark each habit complete. Colors match the configuration in your profile.
            </p>
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-200">
            {pct}% complete
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeHabits.length === 0 && (
            <p className="text-xs text-slate-400">
              No active habits. Activate some on the Profile tab.
            </p>
          )}
          {activeHabits.map((h) => (
            <HabitPill
              key={h._id}
              label={h.name}
              color={h.color}
              active={h.isActive}
              completed={h.completed}
              onToggle={() => toggle(h)}
            />
          ))}
        </div>

        <div className="space-y-1">
          <ProgressBar pct={pct} />
          <p className="text-[11px] text-slate-500 text-right">
            {pct === 100 ? 'All done for today!' : 'Complete all active habits to hit 100%.'}
          </p>
        </div>
      </section>

      {celebrate && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70">
          <div className="rounded-3xl bg-slate-950 px-8 py-6 text-center shadow-2xl border border-emerald-400/40">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm font-semibold text-emerald-200 mb-1">
              100% completed — nice work.
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Your average completion can now be pulled into challenges on the backend.
            </p>
            <button
              type="button"
              onClick={() => setCelebrate(false)}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Keep going
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
