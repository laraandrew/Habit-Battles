import React, { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import ModifyScreen from './screens/ModifyScreen.jsx';
import LogScreen from './screens/LogScreen.jsx';
import OnboardingDialog from './components/OnboardingDialog.jsx';
import GettingStarted from './screens/GettingStarted.jsx';
import ChallengesScreen from './screens/ChallengesScreen.jsx';

const HABIT_COLORS = [
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

export default function App() {
  const [tab, setTab] = useState('log');
  const [health, setHealth] = useState('Checking…');
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users?limit=200');
      const list = res.data?.items || [];
      setUsers(list);
      if (!activeUser && list.length) {
        await selectUser(list[0]._id);
      } else if (activeUser) {
        const updated = list.find((u) => u._id === activeUser._id);
        if (updated) setActiveUser(updated);
      }
      if (!list.length) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const selectUser = async (id) => {
    if (!id) return;
    try {
      const { data } = await api.get(`/users/${id}`);
      setActiveUser(data);
    } catch (err) {
      console.error('Unable to load selected user', err);
    }
  };

  const refreshActiveUser = async () => {
    if (!activeUser?._id) return;
    await selectUser(activeUser._id);
    await loadUsers();
  };

  const handleOnboard = async ({ name, age, habits }) => {
    try {
      const { data: created } = await api.post('/users', { name, age });
      if (habits?.length) {
        const palette = [...HABIT_COLORS];
        await Promise.all(
          habits
            .filter((h) => h.name)
            .map((h, idx) =>
              api.post(`/habits/${created._id}`, {
                name: h.name,
                color: h.color || palette[idx % palette.length],
                isActive: true
              })
            )
        );
      }
      setShowOnboarding(false);
      await loadUsers();
      await selectUser(created._id);
    } catch (err) {
      console.error('Onboarding failed', err);
      alert(err.response?.data?.error || 'Unable to finish onboarding.');
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completionPct = useMemo(() => activeUser?.completionPct ?? 0, [activeUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 space-y-6">
        <header className="rounded-3xl border border-white/5 bg-slate-900/70 backdrop-blur px-5 py-4 shadow-2xl shadow-emerald-900/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/80 to-sky-500/80 text-lg font-bold text-slate-950 shadow-inner">
                {activeUser?.name ? activeUser.name.slice(0, 2).toUpperCase() : 'HB'}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Habit Battles</p>
                <h1 className="text-2xl font-semibold leading-tight">Daily habits & social accountability</h1>
                <p className="text-xs text-slate-400">
                  Status: {health}
                  {checking ? ' (checking...)' : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-slate-950/70 px-3 py-2 shadow-inner">
                <div className="text-xs text-slate-400">Completion</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  readOnly
                  value={completionPct}
                  className="h-1.5 w-40 accent-emerald-400"
                />
                <span className="text-sm font-semibold text-emerald-300">{completionPct}%</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-slate-950/70 px-3 py-2 shadow-inner">
                <div className="text-xs text-slate-400">User</div>
                <select
                  value={activeUser?._id || ''}
                  onChange={(e) => selectUser(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="" disabled>
                    {loadingUsers ? 'Loading...' : 'Select user'}
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.age ?? '—'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowOnboarding(true)}
                  className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  + New
                </button>
              </div>
            </div>
          </div>
          {activeUser && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 border border-emerald-500/30">
                <p className="text-xs text-emerald-200">User</p>
                <p className="text-base font-semibold text-emerald-100">{activeUser.name}</p>
                <p className="text-[11px] text-emerald-200/80">Age {activeUser.age ?? '—'}</p>
              </div>
              <div className="rounded-2xl bg-sky-500/10 px-4 py-3 border border-sky-500/30">
                <p className="text-xs text-sky-200">Habits</p>
                <p className="text-base font-semibold text-sky-100">{activeUser.habits?.length || 0}</p>
                <p className="text-[11px] text-sky-200/80">Active: {activeUser.habits?.filter((h) => h.isActive).length || 0}</p>
              </div>
              <div className="rounded-2xl bg-violet-500/10 px-4 py-3 border border-violet-500/30 sm:col-span-2 lg:col-span-1">
                <p className="text-xs text-violet-200">Friends</p>
                <p className="text-base font-semibold text-violet-100">{activeUser.friendCount ?? 0}</p>
                <p className="text-[11px] text-violet-200/80">Connected in backend</p>
              </div>
            </div>
          )}
        </header>

        <div className="rounded-3xl border border-white/5 bg-slate-950/80 backdrop-blur p-3 shadow-xl">
          <nav className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-900/80 p-1">
            {[
              { key: 'log', label: 'Daily Log' },
              { key: 'challenges', label: 'Challenges' },
              { key: 'modify', label: 'Profile & Habits' },
              { key: 'getting-started', label: 'Getting started' }
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={
                  'flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition ' +
                  (tab === t.key
                    ? 'bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800')
                }
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {tab === 'modify' && (
              <ModifyScreen
                user={activeUser}
                allUsers={users}
                onUserChange={setActiveUser}
                onRefreshUsers={loadUsers}
                onSelectUser={selectUser}
              />
            )}
            {tab === 'log' && <LogScreen user={activeUser} onUserChange={setActiveUser} onReloadUser={refreshActiveUser} />}
            {tab === 'challenges' && (
              <ChallengesScreen
                user={activeUser}
                users={users}
                onRefreshUsers={loadUsers}
                onSelectUser={selectUser}
              />
            )}
            {tab === 'getting-started' && <GettingStarted users={users} activeUser={activeUser} />}
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-4 shadow-lg">
              <h3 className="text-sm font-semibold">Platform roster</h3>
              <p className="text-xs text-slate-400">Switch users or scout potential friends.</p>
              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                {users.map((u) => (
                  <button
                    key={u._id}
                    type="button"
                    onClick={() => selectUser(u._id)}
                    className={
                      'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ' +
                      (activeUser?._id === u._id
                        ? 'border-emerald-400/50 bg-emerald-500/10'
                        : 'border-white/5 bg-slate-950/60 hover:border-slate-700')
                    }
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-50">{u.name}</p>
                      <p className="text-[11px] text-slate-400">Age {u.age ?? '—'} • Habits {u.habits?.length || 0}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-200">{u.friendCount ?? 0} friends</span>
                  </button>
                ))}
                {!users.length && !loadingUsers && (
                  <p className="text-xs text-slate-500">No users yet. Start onboarding to create one.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowOnboarding(true)}
                className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md hover:from-emerald-300 hover:to-sky-300"
              >
                Launch onboarding
              </button>
            </div>
          </aside>
        </main>
      </div>

      <OnboardingDialog
        open={showOnboarding}
        colors={HABIT_COLORS}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboard}
      />
    </div>
  );
}