import React, { useState } from 'react';
import { 
  Search, Bell, Moon, Sun, Menu, X, LogOut, User, 
  Settings, Shield, ChevronDown, Sparkles, School 
} from 'lucide-react';
import RoleSwitcher from '../RoleSwitcher';

export default function TopNavbar({
  user,
  role = 'teacher',
  title = 'Academic Portal',
  onLogout,
  darkMode,
  setDarkMode,
  onToggleSidebar,
  isSidebarOpen,
  notifications = [],
  onOpenNotifications,
  searchQuery,
  setSearchQuery,
  searchPlaceholder = 'Search across portal... (Press / to search)'
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const roleStyles = {
    admin: {
      badge: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800',
      tag: 'HOD / Admin Portal',
      avatarBg: 'from-indigo-600 to-purple-600',
    },
    teacher: {
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200/80 dark:border-blue-800',
      tag: 'Faculty Portal',
      avatarBg: 'from-blue-600 to-indigo-600',
    },
    student: {
      badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800',
      tag: 'Student Portal',
      avatarBg: 'from-emerald-600 to-teal-700',
    },
  };

  const currentRoleStyle = roleStyles[role] || roleStyles.teacher;
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Mobile Toggle & Institute Brand */}
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo & Brand Identity */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <School className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">SSIEMS</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentRoleStyle.badge}`}>
                    {currentRoleStyle.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                  Department of Computer Science & Engineering
                </p>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 text-xs rounded-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
              />
              <kbd className="hidden lg:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                /
              </kbd>
            </div>
          </div>

          {/* Right: Quick Role Switcher, Theme, Notifications, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Header Role Switcher (Compact Dropdown) */}
            <RoleSwitcher currentRole={role} compact={true} />

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Notifications & Directives"
              >
                <Bell className="w-4 h-4" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* User Profile Chip */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2 sm:pl-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    {user?.name || 'Academic User'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[130px]">
                    {user?.designation || user?.roll_number || 'Department Member'}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentRoleStyle.avatarBg} flex items-center justify-center text-white font-black text-xs shadow-sm`}>
                  {userInitials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-50 p-2 text-xs divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@ssiems.org.in'}</p>
                    <div className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {user?.role?.toUpperCase()} • {user?.class_name || 'CSE DEPT'}
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center space-x-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Account Profile</span>
                    </button>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40 font-bold flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out of Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
