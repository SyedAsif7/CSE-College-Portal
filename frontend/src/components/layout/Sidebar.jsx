import React from 'react';
import { Card } from '../ui/card';
import { LogOut, School, ShieldCheck } from 'lucide-react';

export default function Sidebar({
  navigationSections = [],
  activeNav,
  setActiveNav,
  role = 'teacher',
  onLogout,
  isSidebarOpen,
  onCloseSidebar,
}) {
  const roleStyles = {
    admin: {
      activeClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 dark:shadow-none',
      headerGradient: 'from-slate-900 via-indigo-950 to-purple-950',
      badgeBg: 'bg-indigo-500/20 border-indigo-400/30',
      iconColor: 'text-indigo-300',
      title: 'HOD Command Center',
      statusText: 'Accreditation: A+',
    },
    teacher: {
      activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 dark:shadow-none',
      headerGradient: 'from-slate-900 via-blue-950 to-indigo-950',
      badgeBg: 'bg-blue-500/20 border-blue-400/30',
      iconColor: 'text-cyan-300',
      title: 'Faculty Academic Desk',
      statusText: 'Biometrics: Active',
    },
    student: {
      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 dark:shadow-none',
      headerGradient: 'from-slate-900 via-emerald-950 to-teal-950',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/30',
      iconColor: 'text-emerald-300',
      title: 'Student Academic Center',
      statusText: 'Standing: Distinction',
    },
  };

  const style = roleStyles[role] || roleStyles.teacher;

  const sidebarContent = (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Sidebar Header Badge */}
      <div className={`p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r ${style.headerGradient} text-white shrink-0`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl border ${style.badgeBg}`}>
            <School className={`w-4 h-4 ${style.iconColor}`} />
          </div>
          <div>
            <h3 className="font-black text-xs tracking-tight">{style.title}</h3>
            <p className="text-[10px] text-slate-300">Academic Year 2026–27</p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="p-3 space-y-4 flex-1 overflow-y-auto">
        {navigationSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {sec.title && (
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {sec.title}
              </div>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (onCloseSidebar) onCloseSidebar();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? style.activeClass
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Status Card & Sign Out */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {style.statusText}
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">Term: Autumn</span>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </Card>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-120px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onCloseSidebar}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full p-4 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
