import React from 'react';

export default function StatusBadge({ status, text }) {
  const normalized = (status || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (normalized.includes('present') || normalized.includes('checked') || normalized.includes('approved') || normalized.includes('active') || normalized.includes('regular') || normalized.includes('compliant')) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    dotColor = 'bg-emerald-500';
  } else if (normalized.includes('pending') || normalized.includes('review') || normalized.includes('late')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    dotColor = 'bg-amber-500';
  } else if (normalized.includes('absent') || normalized.includes('failed') || normalized.includes('urgent') || normalized.includes('rejected')) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    dotColor = 'bg-rose-500';
  } else if (normalized.includes('upcoming') || normalized.includes('scheduled')) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    dotColor = 'bg-blue-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{text || status}</span>
    </span>
  );
}
