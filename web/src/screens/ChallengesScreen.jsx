import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

export default function ChallengesScreen({ user, users, onRefreshUsers, onSelectUser }) {
  const roster = users || [];
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '',
    startDate: new Date().toISOString().slice(0, 10),
    durationDays: 14,
    participants: []
  });
  const [pctDraft, setPctDraft] = useState({});

  const refreshChallenges = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/challenges');
      setChallenges(data || []);
      if (data?.length) setSelected((prev) => prev || data[0]._id);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Unable to load challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshChallenges();
  }, []);

  const selectedChallenge = useMemo(() => challenges.find((c) => c._id === selected), [challenges, selected]);

  const toggleParticipant = (id) => {
    setForm((prev) => {
      const exists = prev.participants.includes(id);
      return {
        ...prev,
        participants: exists ? prev.participants.filter((p) => p !== id) : [...prev.participants, id]
      };
    });
  };

  const createChallenge = async (e) => {
    e.preventDefault();
    if (!form.name || !form.durationDays) return;
    setCreating(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        startDate: form.startDate,
        durationDays: Number(form.durationDays),
        participants: form.participants.map((p) => ({ user: p }))
      };
      const { data } = await api.post('/challenges', payload);
      setChallenges((prev) => [data, ...prev]);
      setSelected(data._id);
      setForm({ ...form, name: '', participants: [] });
      await onRefreshUsers?.();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Unable to create challenge');
    } finally {
      setCreating(false);
    }
  };

  const appendPct = async (challengeId, participantId) => {
    const pct = Number(pctDraft[participantId] || 0);
    if (!pct && pct !== 0) return;
    try {
      await api.post(`/challenges/${challengeId}/participants/${participantId}/pct`, { pct });
      await refreshChallenges();
      setPctDraft((prev) => ({ ...prev, [participantId]: 0 }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Unable to log percentage');
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs text-red-100">{error}</div>
      )}

      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Challenges</p>
            <h2 className="text-xl font-semibold">Friendly competitions with historical tracking</h2>
            <p className="text-xs text-slate-400">Create a new challenge, invite friends, and log daily completion percentages for everyone.</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200 border border-emerald-400/30">
            {loading ? 'Loading…' : `${challenges.length} active`}
          </span>
        </div>

        <form onSubmit={createChallenge} className="rounded-2xl border border-white/5 bg-slate-950/70 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Create a challenge</p>
              <h3 className="text-lg font-semibold">Invite friends and set a duration</h3>
              <p className="text-xs text-slate-400">Participants will track daily habit completion percentages side by side.</p>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:from-emerald-300 hover:to-sky-300 disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create challenge'}
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-sm text-slate-200 space-y-1">
              <span>Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                placeholder="May Habit Sprint"
              />
            </label>
            <label className="text-sm text-slate-200 space-y-1">
              <span>Start date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-200 space-y-1">
              <span>Duration (days)</span>
              <input
                type="number"
                min="7"
                max="365"
                value={form.durationDays}
                onChange={(e) => setForm((prev) => ({ ...prev, durationDays: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              />
            </label>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-2">Invite friends (select one or more)</p>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {roster.map((u) => (
                <label
                  key={u._id}
                  className={
                    'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ' +
                    (form.participants.includes(u._id)
                      ? 'border-emerald-400/60 bg-emerald-500/10'
                      : 'border-white/5 bg-slate-950/50 hover:border-slate-700')
                  }
                >
                  <input
                    type="checkbox"
                    checked={form.participants.includes(u._id)}
                    onChange={() => toggleParticipant(u._id)}
                    className="accent-emerald-400"
                  />
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-[11px] text-slate-400">Habits {u.habits?.length || 0} • Age {u.age ?? '—'}</p>
                  </div>
                </label>
              ))}
              {!roster.length && <p className="text-xs text-slate-400">Add users first via onboarding.</p>}
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-lg font-semibold">Current challenges</h3>
          {user && (
            <button
              type="button"
              onClick={() => onSelectUser?.(user._id)}
              className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100 hover:border-emerald-300"
            >
              Viewing as {user.name}
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {challenges.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => setSelected(c._id)}
              className={
                'rounded-2xl border px-3 py-3 text-left transition ' +
                (selected === c._id
                  ? 'border-emerald-400/70 bg-emerald-500/10 shadow-lg'
                  : 'border-white/5 bg-slate-950/70 hover:border-slate-800')
              }
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{new Date(c.startDate).toLocaleDateString()}</p>
                  <p className="text-base font-semibold">{c.name}</p>
                  <p className="text-[11px] text-slate-400">{c.durationDays} days • Ends {new Date(c.endDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Participants</p>
                  <p className="text-sm font-semibold text-emerald-200">{c.participants?.length || 0}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.participants?.map((p) => (
                  <span key={p.user._id} className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-200">
                    {p.user.name}: {averagePct(p)}%
                  </span>
                ))}
                {!c.participants?.length && <span className="text-[11px] text-slate-400">No participants yet.</span>}
              </div>
            </button>
          ))}
          {!challenges.length && !loading && (
            <p className="text-xs text-slate-400">No challenges yet. Create one above to invite friends.</p>
          )}
        </div>
      </section>

      {selectedChallenge && (
        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">Challenge viewer</p>
              <h3 className="text-xl font-semibold text-emerald-50">{selectedChallenge.name}</h3>
              <p className="text-xs text-emerald-100/80">
                {selectedChallenge.durationDays} days • {new Date(selectedChallenge.startDate).toLocaleDateString()} –{' '}
                {new Date(selectedChallenge.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950/80 border border-emerald-400/30 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">Leader</p>
              <p className="text-base font-semibold text-emerald-50">{winnerName(selectedChallenge)}</p>
              <p className="text-xs text-emerald-100/70">Average completion</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {selectedChallenge.participants?.map((p) => (
              <div key={p.user._id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{p.user.name}</p>
                    <p className="text-[11px] text-slate-400">Average {averagePct(p)}% across {p.dailySnapshots.length || 0} days</p>
                  </div>
                  <div className="text-right space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pctDraft[p.user._id] ?? 0}
                      onChange={(e) => setPctDraft((prev) => ({ ...prev, [p.user._id]: Number(e.target.value) }))}
                      className="w-32 accent-emerald-400"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-slate-300">{pctDraft[p.user._id] ?? 0}%</span>
                      <button
                        type="button"
                        onClick={() => appendPct(selectedChallenge._id, p.user._id)}
                        className="rounded-lg bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-emerald-400"
                      >
                        Log day
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.dailySnapshots.length ? (
                    p.dailySnapshots.map((snapshot, idx) => (
                      <div
                        key={idx}
                        className="h-10 w-8 rounded-lg bg-gradient-to-b from-emerald-400/70 to-slate-900/80 flex flex-col justify-end overflow-hidden"
                        title={`${snapshot.dateLabel}: ${snapshot.pct}%`}
                      >
                        <div style={{ height: `${snapshot.pct}%` }} className="w-full bg-emerald-500/80" />
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400">No daily percentages logged yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function averagePct(participant) {
  if (!participant?.dailySnapshots?.length) return 0;
  const sum = participant.dailySnapshots.reduce((a, b) => a + b.pct, 0);
  return Math.round(sum / participant.dailySnapshots.length);
}

function winnerName(challenge) {
  if (!challenge?.participants?.length) return '—';
  let top = { name: '—', avg: -1 };
  for (const p of challenge.participants) {
    const avg = averagePct(p);
    if (avg > top.avg) top = { name: p.user.name, avg };
  }
  return `${top.name} (${top.avg}%)`;
}