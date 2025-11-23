import React, { useMemo, useState } from 'react';
import { api } from '../api.js';

const COLORS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'blue',
  'indigo',
  'violet'
];

export default function ModifyScreen({ user, allUsers, onUserChange, onRefreshUsers, onSelectUser }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [habitDraft, setHabitDraft] = useState({ name: '', color: COLORS[7], isActive: true });

  const friendsById = useMemo(() => new Set((user?.friends || []).map((f) => f._id || f)), [user]);

  const savePatch = async (patch) => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await api.patch(`/users/${user._id}`, patch);
      onUserChange?.(data);
      await onRefreshUsers?.();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const addHabit = async (e) => {
    e?.preventDefault?.();
    if (!user || !habitDraft.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await api.post(`/habits/${user._id}`, {
        name: habitDraft.name.trim(),
        color: habitDraft.color,
        isActive: habitDraft.isActive
      });
      onUserChange?.(data);
      setHabitDraft({ name: '', color: habitDraft.color, isActive: true });
      await onRefreshUsers?.();
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
      onUserChange?.(data);
      await onRefreshUsers?.();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update habit.');
    } finally {
      setSaving(false);
    }
  };

  const toggleFriend = async (friendId, isFriend) => {
    if (!user || !friendId) return;
    setSaving(true);
    setError('');
    try {
      if (isFriend) {
        await api.delete(`/users/${user._id}/friends/${friendId}`);
      } else {
        await api.post(`/users/${user._id}/friends/${friendId}`);
      }
      const refreshed = await api.get(`/users/${user._id}`);
      onUserChange?.(refreshed.data);
      await onRefreshUsers?.();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Unable to update friends.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-200 shadow-inner">
        Select a user from the top bar or create one via onboarding.
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

      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Profile</p>
            <h2 className="text-lg font-semibold text-slate-50">Identity & basics</h2>
          </div>
          {saving && (
            <span className="text-[11px] text-emerald-200 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Saving
            </span>
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs text-slate-400 space-y-1">
            Name
            <input
              defaultValue={user.name}
              onBlur={(e) => savePatch({ name: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
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
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Auth is intentionally lightweight (name + age). The record is synced to the backend as you make
          edits.
        </p>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Habits</p>
            <h2 className="text-lg font-semibold text-slate-50">Build the daily stack</h2>
            <p className="text-xs text-slate-400">Colors are reflected on the Daily Log screen.</p>
          </div>
          <form className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-slate-950/60 px-3 py-2" onSubmit={addHabit}>
            <input
              value={habitDraft.name}
              onChange={(e) => setHabitDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Morning stretch"
              className="w-40 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
            <select
              value={habitDraft.color}
              onChange={(e) => setHabitDraft((prev) => ({ ...prev, color: e.target.value }))}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-50 focus:border-emerald-400 focus:outline-none"
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1 text-[11px] text-slate-200">
              <input
                type="checkbox"
                checked={habitDraft.isActive}
                onChange={(e) => setHabitDraft((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-emerald-400"
              />
              Active
            </label>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Add
            </button>
          </form>
        </div>

        <div className="space-y-2 max-h-[26rem] overflow-y-auto pr-1">
          {user.habits.length === 0 && (
            <p className="text-xs text-slate-400">No habits yet. Start the stack with the form above.</p>
          )}
          {user.habits.map((h) => (
            <div
              key={h._id}
              className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-50 truncate">{h.name}</p>
                <p className="text-[11px] text-slate-400">
                  Color: <span className="font-mono">{h.color}</span> • {h.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateHabit(h._id, { isActive: !h.isActive })}
                  className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-800"
                >
                  {h.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => updateHabit(h._id, { completed: !h.completed })}
                  className="rounded-full border border-emerald-400/60 px-3 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500 hover:text-slate-950"
                >
                  {h.completed ? 'Uncomplete' : 'Mark done'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Add friends</p>
            <h2 className="text-lg font-semibold text-slate-50">Discover other players</h2>
            <p className="text-xs text-slate-400">Pulls from the backend roster and links friends via the API.</p>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-200">
            {user.friendCount ?? 0} friends
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {allUsers
            .filter((u) => u._id !== user._id)
            .map((u) => {
              const isFriend = friendsById.has(u._id);
              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-950/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{u.name}</p>
                    <p className="text-[11px] text-slate-400">Age {u.age ?? '—'} • Habits {u.habits?.length || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectUser?.(u._id)}
                      className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFriend(u._id, isFriend)}
                      className={
                        'rounded-full px-3 py-1 text-[11px] font-semibold transition ' +
                        (isFriend
                          ? 'border border-rose-400/60 text-rose-200 hover:bg-rose-500 hover:text-slate-950'
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400')
                      }
                    >
                      {isFriend ? 'Remove' : 'Add friend'}
                    </button>
                  </div>
                </div>
              );
            })}
          {allUsers.filter((u) => u._id !== user._id).length === 0 && (
            <p className="text-xs text-slate-500">No other users yet. Add another account from the header.</p>
          )}
        </div>
      </section>
    </div>
  );
}