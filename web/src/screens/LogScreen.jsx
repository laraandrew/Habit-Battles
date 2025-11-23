import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import ProgressBar from '../components/ProgressBar.jsx';

const COLOR_STYLES = {
  red: 'from-red-400/80 to-rose-500/60 shadow-red-500/20',
  orange: 'from-orange-400/80 to-amber-500/60 shadow-orange-500/20',
  amber: 'from-amber-300/80 to-orange-400/70 shadow-amber-500/20',
  yellow: 'from-yellow-300/80 to-amber-400/60 shadow-amber-400/20',
  lime: 'from-lime-300/80 to-green-400/70 shadow-lime-400/20',
  green: 'from-green-300/80 to-emerald-400/70 shadow-green-500/20',
  emerald: 'from-emerald-300/80 to-teal-400/70 shadow-emerald-500/20',
  teal: 'from-teal-300/80 to-cyan-400/70 shadow-teal-500/20',
  blue: 'from-sky-300/80 to-blue-500/70 shadow-sky-500/20',
  indigo: 'from-indigo-300/80 to-purple-500/70 shadow-indigo-500/20',
  violet: 'from-violet-300/80 to-fuchsia-500/70 shadow-violet-500/20'
};

export default function LogScreen({ user, onUserChange, onReloadUser }) {
  const [celebrate, setCelebrate] = useState(false);
  const [error, setError] = useState('');
  const [recentlyCompleted, setRecentlyCompleted] = useState({});

  // 🔹 keep this effect as-is
  useEffect(() => {
    if (user?.completionPct === 100) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 1500);
      return () => clearTimeout(t);
    }
  }, [user?.completionPct]);

  // 🔹 NEW: compute these *before* the early return, with safe defaults
  const activeHabits = user?.habits?.filter((h) => h.isActive) ?? [];
  const pct = user?.completionPct || 0;
  const streak = useMemo(
    () => Math.round((pct / 100) * activeHabits.length),
    [pct, activeHabits.length]
  );

  const toggle = async (habit) => {
    if (!user) return;
    try {
      const { data } = await api.patch(`/habits/${user._id}/${habit._id}`, {
        completed: !habit.completed
      });
      if (!habit.completed) {
        setRecentlyCompleted((prev) => ({ ...prev, [habit._id]: true }));
        setTimeout(
          () =>
            setRecentlyCompleted((prev) => {
              const copy = { ...prev };
              delete copy[habit._id];
              return copy;
            }),
          800
        );
      }
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

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs text-red-100">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Daily log</p>
            <h2 className="text-xl font-semibold text-slate-50">Tap the cards to complete habits</h2>
            <p className="text-xs text-slate-400">
              Larger cards, richer gradients, and responsive animations make logging delightful.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">Today</p>
            <p className="text-base font-semibold text-emerald-50">{pct}% complete</p>
            <p className="text-[11px] text-emerald-100/70">{activeHabits.length} active habits</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {activeHabits.length === 0 && (
            <p className="text-xs text-slate-400">No active habits. Activate some on the Profile tab.</p>
          )}
          {activeHabits.map((h) => (
            <HabitCard
              key={h._id}
              habit={h}
              onToggle={() => toggle(h)}
              animate={recentlyCompleted[h._id]}
            />
          ))}
        </div>

        <div className="space-y-2">
          <ProgressBar pct={pct} />
          <p className="text-[11px] text-slate-400 text-right">
            {pct === 100 ? 'All done for today!' : 'Complete all active habits to hit 100%.'}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-xl grid gap-4 md:grid-cols-3">
        <StatCard label="Completion" value={`${pct}%`} helper="Synced to backend for challenges." />
        <StatCard label="Active habits" value={activeHabits.length} helper="Shown above as large tappable cards." />
        <StatCard
          label="Perfection streak"
          value={`${streak}/${activeHabits.length}`}
          helper="Habits completed today."
        />
      </section>

      {celebrate && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70">
          <div className="rounded-3xl bg-slate-950 px-8 py-6 text-center shadow-2xl border border-emerald-400/40">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm font-semibold text-emerald-200 mb-1">100% completed — nice work.</p>
            <p className="text-xs text-slate-400 mb-3">
              Your progress timeline is now reflected in challenges.
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

function HabitCard({ habit, onToggle, animate }) {
  const colorStyle = COLOR_STYLES[habit.color] || COLOR_STYLES.blue;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r ${colorStyle} p-4 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-emerald-300 ${
        animate ? 'habit-pop' : ''
      }`}
    >
      <div className="absolute inset-0 bg-slate-950/10 opacity-0 transition-opacity group-hover:opacity-40" />
      <div className="flex items-start justify-between gap-2 relative">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-900/70">Habit</p>
          <h4 className="text-lg font-semibold text-slate-950 drop-shadow">{habit.name}</h4>
          <p className="text-xs text-slate-900/70">Tap to {habit.completed ? 'undo' : 'complete'} for today.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span
            className={`h-10 w-10 rounded-xl border border-white/40 bg-white/10 backdrop-blur flex items-center justify-center text-xl font-bold text-slate-900 transition-transform ${
              habit.completed ? 'scale-105 bg-white/80 text-emerald-600' : ''
            } ${animate ? 'habit-burst' : ''}`}
          >
            {habit.completed ? '✓' : ''}
          </span>
          <span className="text-[11px] text-slate-900/80 bg-white/30 px-2 py-0.5 rounded-full">
            {habit.completed ? 'Completed' : 'In progress'}
          </span>
        </div>
      </div>
    </button>
  );
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-inner">
      <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">{label}</p>
      <p className="text-xl font-semibold text-slate-50">{value}</p>
      <p className="text-xs text-slate-400">{helper}</p>
    </div>
  );
}
