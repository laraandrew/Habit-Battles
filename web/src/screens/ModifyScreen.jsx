import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const COLORS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'indigo',
  'violet'
];

export default function ModifyScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await api.get('/users?limit=1');
        if (list.data.items && list.data.items.length) {
          setUser(list.data.items[0]);
        } else {
          const created = await api.post('/users', { name: 'Guest', age: 22 });
          setUser(created.data);
        }
      } catch (err) {
        console.error('ModifyScreen bootstrap error', err);
        setError('Unable to load or create user.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const savePatch = async (patch) => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await api.patch(`/users/${user._id}`, patch);
      setUser(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const addHabit = async () => {
    if (!user) return;
    const name = window.prompt('New habit name?');
    if (!name) return;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSaving(true);
    setError('');
    try {
      const { data } = await api.post(`/habits/${user._id}`, { name, color });
      setUser(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to add habit.');
    } finally {
      setSaving(false);
    }
  };

  const updateHabit = async (habitId, patch) => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await api.patch(`/habits/${user._id}/${habitId}`, patch);
      setUser(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update habit.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-slate-300">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
        {error || 'No user loaded.'}
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

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100 mb-3">Profile</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs text-slate-400 space-y-1">
            Name
            <input
              defaultValue={user.name}
              onBlur={(e) => savePatch({ name: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </label>
          <label className="text-xs text-slate-400 space-y-1">
            Age
            <input
              type="number"
              defaultValue={user.age || ''}
              onBlur={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                savePatch({ age: value });
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </label>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          This screen doubles as onboarding and profile management. Use it to shape the habits
          you&apos;ll log against each day.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">Habits</h2>
          <button
            type="button"
            onClick={addHabit}
            className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-sky-400 active:bg-sky-500 transition"
          >
            + Add habit
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {user.habits.length === 0 && (
            <p className="text-xs text-slate-400">No habits yet. Add your first one above.</p>
          )}
          {user.habits.map((h) => (
            <div
              key={h._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">{h.name}</p>
                <p className="text-[11px] text-slate-500">
                  Color: <span className="font-mono">{h.color}</span> •{' '}
                  {h.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={() => updateHabit(h._id, { isActive: !h.isActive })}
                  className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-100 hover:bg-slate-800"
                >
                  {h.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => updateHabit(h._id, { completed: !h.completed })}
                  className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-[11px] text-emerald-300 hover:bg-emerald-500 hover:text-slate-950"
                >
                  {h.completed ? 'Uncomplete' : 'Mark done'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {saving && (
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" /> Saving…
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100 mb-1">Friends & Challenges</h2>
        <p className="text-[11px] text-slate-500">
          Friends and challenges are backed by the API. For this take-home, you can exercise those
          endpoints with Postman or your favorite HTTP client and talk through the model design in
          the review.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Current friend count: <span className="font-semibold">{user.friendCount ?? 0}</span>
        </p>
      </section>
    </div>
  );
}
