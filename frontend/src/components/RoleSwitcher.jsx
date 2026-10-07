import React, { useState } from 'react';
import { ShieldCheck, GraduationCap, UserCheck, ChevronDown, Check, Sparkles, RefreshCw } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    id: 'admin-pawar',
    role: 'admin',
    name: 'Prof. Pawar V.K.',
    title: 'HOD / Admin',
    desc: 'Department Head & Admin Access',
    email: 'head.cse@ssiems.in',
    designation: 'Head of Department (CSE)',
    path: '/admin',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: ShieldCheck,
  },
  {
    id: 'teacher-bpg',
    role: 'teacher',
    name: 'Prof.Bais P.G.',
    title: 'Faculty / Teacher',
    desc: 'Class Teacher & Paper Evaluator',
    email: 'bpg@ssiems.org.in',
    designation: 'Class Teacher',
    path: '/teacher',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: UserCheck,
  },
  {
    id: 'student-asif',
    role: 'student',
    name: 'Syed Asif',
    title: 'Student Portal',
    desc: 'SY-CSE Roll No: 2024SYCSE001',
    email: 'asif@ssiems.org.in',
    roll_number: '2024SYCSE001',
    class_name: 'SY-CSE',
    path: '/student',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: GraduationCap,
  },
];

export default function RoleSwitcher({ currentRole, compact = false }) {
  const [open, setOpen] = useState(false);

  const activeAccount = DEMO_ACCOUNTS.find(a => a.role === currentRole) || DEMO_ACCOUNTS[0];

  const handleSwitch = (account) => {
    localStorage.setItem('user', JSON.stringify({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      designation: account.designation,
      roll_number: account.roll_number,
      class_name: account.class_name,
    }));
    localStorage.setItem('token', 'demo-session-token-' + account.role);
    window.location.href = account.path;
  };

  if (compact) {
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors shadow-sm"
          title="Switch Active Portal Role"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>Role: {activeAccount.title.split(' ')[0]}</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>

        {open && (
          <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-10 divide-y divide-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-t-xl">
              <p className="text-[10px] tracking-widest uppercase font-semibold text-indigo-300">GradeFlow Portal Switcher</p>
              <p className="text-xs text-slate-200 font-medium">Switch roles with 1 click</p>
            </div>
            <div className="p-1 space-y-0.5">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                const isCurrent = account.role === currentRole;
                return (
                  <button
                    key={account.id}
                    onClick={() => handleSwitch(account)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-md ${account.badgeColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{account.title}</div>
                        <div className="text-[11px] text-slate-500">{account.name}</div>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside 
      aria-label="Gradeflow Quick Portal Switcher"
      className="fixed bottom-4 right-4 z-50 flex items-center shadow-xl rounded-full bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/60 p-1.5 px-3 space-x-2 text-xs"
    >
      <div className="flex items-center space-x-1.5 text-slate-300 border-r border-slate-700 pr-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold tracking-wide text-[11px] uppercase hidden sm:inline">Role:</span>
      </div>
      <div className="flex items-center space-x-1">
        {DEMO_ACCOUNTS.map((account) => {
          const isCurrent = account.role === currentRole;
          const Icon = account.icon;
          return (
            <button
              key={account.id}
              onClick={() => handleSwitch(account)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all text-xs font-medium cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={`Switch to ${account.title} (${account.name})`}
            >
              <Icon className="w-3 h-3" />
              <span>{account.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
