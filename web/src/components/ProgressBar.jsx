import React from 'react';

export default function ProgressBar({ pct = 0 }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="w-full rounded-full bg-slate-900 border border-slate-800 h-3 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
