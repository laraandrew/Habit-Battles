import React, { useEffect, useState } from 'react';

const emptyHabit = { name: '', color: 'emerald' };

export default function OnboardingDialog({ open, onClose, onComplete, colors = [] }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [habits, setHabits] = useState([{ ...emptyHabit }]);

  useEffect(() => {
    if (open) {
      setName('');
      setAge('');
      setHabits([{ ...emptyHabit }]);
    }
  }, [open]);

  const updateHabit = (idx, patch) => {
    setHabits((prev) => prev.map((h, i) => (i === idx ? { ...h, ...patch } : h)));
  };

  const addHabit = () => setHabits((prev) => [...prev, { ...emptyHabit }]);

  const removeHabit = (idx) => setHabits((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = habits.filter((h) => h.name.trim().length > 0);
    if (!name.trim()) return alert('Name is required to create an account.');
    onComplete({
      name: name.trim(),
      age: age ? Number(age) : undefined,
      habits: trimmed
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Onboarding</p>
            <h2 className="text-2xl font-semibold">Create a player and preload habits</h2>
            <p className="text-sm text-slate-400">
              This flows directly against the backend. Once created, the user and their habits will be
              selectable from the dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="text-xs text-slate-400 space-y-1 sm:col-span-2">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                placeholder="Ari Habitmaster"
              />
            </label>
            <label className="text-xs text-slate-400 space-y-1">
              Age
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                placeholder="28"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">Starting habits</h3>
                <p className="text-xs text-slate-400">Preload what the user will log on day one.</p>
              </div>
              <button
                type="button"
                onClick={addHabit}
                className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
              >
                + Habit
              </button>
            </div>

            <div className="mt-3 space-y-3 max-h-64 overflow-y-auto pr-1">
              {habits.map((habit, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 gap-2 rounded-xl border border-white/5 bg-slate-950/60 p-3 sm:grid-cols-5 sm:items-center"
                >
                  <label className="text-xs text-slate-400 space-y-1 sm:col-span-3">
                    Habit name
                    <input
                      value={habit.name}
                      onChange={(e) => updateHabit(idx, { name: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                      placeholder="10,000 steps"
                    />
                  </label>
                  <label className="text-xs text-slate-400 space-y-1 sm:col-span-1">
                    Color
                    <select
                      value={habit.color}
                      onChange={(e) => updateHabit(idx, { color: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                    >
                      {colors.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-center justify-end sm:justify-center">
                    <button
                      type="button"
                      onClick={() => removeHabit(idx)}
                      className="text-[11px] text-rose-300 hover:text-rose-200"
                      disabled={habits.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg hover:from-emerald-300 hover:to-sky-300"
            >
              Create user & habits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}