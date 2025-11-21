import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import HabitPill from '../components/HabitPill.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function LogScreen({ user, onUserChange, onReloadUser }) {
  const [celebrate, setCelebrate] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.completionPct === 100) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 1500);
      return () => clearTimeout(t);
    }
  }, [user?.completionPct]);

  const toggle = async (habit) => {
    if (!user) return;
    try {
      const { data } = await api.patch(`/habits/${user._id}/${habit._id}`, {
        completed: !habit.completed
      });
      onUserChange?.(data);
      await onReloadUser?.();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to toggle habit.');
    }
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-xs text-amber-100">
        Choose a user to start logging. Use onboarding if none exist yet.
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

      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Daily log</p>
            <h2 className="text-lg font-semibold text-slate-50">Tap to complete today&apos;s habits</h2>
            <p className="text-xs text-slate-400">Directly synced to the backend; colors mirror your profile setup.</p>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-200">{pct}% complete</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeHabits.length === 0 && (
            <p className="text-xs text-slate-400">No active habits. Activate some on the Profile tab.</p>
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
          <p className="text-[11px] text-slate-400 text-right">
            {pct === 100 ? 'All done for today!' : 'Complete all active habits to hit 100%.'}
          </p>
        </div>
      </section>

      {celebrate && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70">
          <div className="rounded-3xl bg-slate-950 px-8 py-6 text-center shadow-2xl border border-emerald-400/40">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm font-semibold text-emerald-200 mb-1">100% completed — nice work.</p>
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
