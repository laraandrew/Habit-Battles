import React from 'react';

const COLOR_BG = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-400',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500'
};

const COLOR_RING = {
  red: 'ring-red-400',
  orange: 'ring-orange-400',
  amber: 'ring-amber-400',
  yellow: 'ring-yellow-300',
  lime: 'ring-lime-400',
  green: 'ring-green-400',
  emerald: 'ring-emerald-400',
  teal: 'ring-teal-400',
  blue: 'ring-blue-400',
  indigo: 'ring-indigo-400',
  violet: 'ring-violet-400'
};

export default function HabitPill({
  label,
  color = 'blue',
  active = true,
  completed = false,
  onToggle
}) {
  const bgClass = COLOR_BG[color] || COLOR_BG.blue;
  const ringClass = COLOR_RING[color] || COLOR_RING.blue;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'relative inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium shadow-sm transition',
        completed ? `${bgClass} text-white` : 'bg-slate-900/60 text-slate-100',
        active ? 'opacity-100' : 'opacity-40',
        'hover:scale-[1.03] hover:-translate-y-px',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        ringClass
      ].join(' ')}
    >
      <span className="truncate max-w-[8rem]">{label}</span>
      <span
        className={
          'ml-2 h-1.5 w-1.5 rounded-full border border-white/40 ' +
          (completed ? 'bg-white' : 'bg-white/20')
        }
      />
    </button>
  );
}
