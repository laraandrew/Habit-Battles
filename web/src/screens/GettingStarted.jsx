import React from 'react';

export default function GettingStarted({ users, activeUser }) {
  const hasUsers = (users || []).length > 0;
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/5 bg-slate-900/70 p-6 shadow-xl space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300">Orientation</p>
          <h2 className="text-2xl font-semibold">Getting started with Habit Battles</h2>
          <p className="text-sm text-slate-400">A quick primer on onboarding, switching users, logging habits, adding friends, and exploring challenges.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <GuideCard
            title="Create or switch users"
            bullets={[
              'Use the header selector to switch between people instantly.',
              'Click "+ New" to onboard someone with name, age, and starter habits.',
              'Profiles stay in sync with the backend so you can hop across devices.'
            ]}
          />
          <GuideCard
            title="Craft and color your habits"
            bullets={[
              'Open the "Profile & Habits" tab to add, edit, or retire habits.',
              'Pick a palette color so logging is visually consistent everywhere.',
              'Active habits automatically appear on the Daily Log.'
            ]}
          />
          <GuideCard
            title="Log your day"
            bullets={[
              'Head to the Daily Log tab and tap the large cards to mark completion.',
              'Progress and streak visuals update instantly with subtle celebration.',
              'Everything writes back to the API so friends and challenges stay up-to-date.'
            ]}
          />
          <GuideCard
            title="Add and explore friends"
            bullets={[
              'Use the friends card within Profile & Habits to search and add users.',
              'Your right-hand roster shows everyone available on the platform.',
              'Friend counts sync from the backend so you can gauge your network health.'
            ]}
          />
          <GuideCard
            title="Join or build challenges"
            bullets={[
              'Open the Challenges tab to see every running challenge.',
              'Spin up a new challenge, invite friends, and set a duration and start date.',
              'Track historical completion percentages per participant day-by-day.'
            ]}
          />
          <GuideCard
            title="Polish for production"
            bullets={[
              'Responsive layouts with gradients, glassmorphism, and focus states.',
              'Favicon, typography, and consistent spacing make the app feel finished.',
              'Backend health indicator sits in the header for quick diagnostics.'
            ]}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">Next step</p>
            <h3 className="text-lg font-semibold text-emerald-50">{hasUsers ? 'Dive into the Daily Log' : 'Onboard your first user'}</h3>
            <p className="text-sm text-emerald-100/80">
              {hasUsers
                ? 'Switch to any profile in the header, then tap a habit card to see the new animations.'
                : 'Use the header “+ New” button to add a name, age, and first set of habits.'}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950/70 border border-emerald-400/30 px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">Current user</p>
            <p className="text-base font-semibold text-emerald-50">{activeUser?.name || 'None selected'}</p>
            <p className="text-xs text-emerald-100/70">{activeUser ? `Age ${activeUser.age ?? '—'}` : 'Pick anyone from the roster.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function GuideCard({ title, bullets }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-4 shadow-inner">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <ul className="space-y-1 text-sm text-slate-300">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-emerald-300">•</span>
            <span className="leading-snug">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}