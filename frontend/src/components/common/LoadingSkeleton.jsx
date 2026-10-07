import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
        <div className="w-16 h-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div className="space-y-1.5 pt-1">
        <div className="w-20 h-3 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="w-28 h-6 rounded-md bg-slate-200 dark:bg-slate-800"></div>
        <div className="w-24 h-2.5 rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full max-w-[120px]"></div>
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-3 w-60 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
      <div className="flex justify-between pt-2">
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
  );
}

export default {
  StatCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  CardSkeleton,
};
