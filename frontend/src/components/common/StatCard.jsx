import React from 'react';
import { Card } from '../ui/card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40',
  trend,
  trendPositive = true,
}) {
  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl p-4 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
        {value}
      </div>
      <div className="flex items-center justify-between mt-1 text-[11px]">
        {subtitle && (
          <span className="text-slate-500 dark:text-slate-400 font-medium truncate">
            {subtitle}
          </span>
        )}
        {trend && (
          <span className={`font-bold ml-1 ${trendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}
