import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import RoleSwitcher from '../RoleSwitcher';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Bell, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({
  user,
  role = 'teacher',
  title = 'Academic Portal',
  onLogout,
  navigationSections = [],
  activeNav,
  setActiveNav,
  notifications = [],
  children,
  searchQuery,
  setSearchQuery,
  searchPlaceholder,
}) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [darkMode]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/80 text-slate-800'} font-sans flex flex-col`}>
      {/* 1. Global Top Navbar */}
      <TopNavbar
        user={user}
        role={role}
        title={title}
        onLogout={onLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder={searchPlaceholder}
      />

      {/* 2. Main Container with Sidebar + Canvas */}
      <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        {/* Unified Sidebar */}
        <Sidebar
          navigationSections={navigationSections}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          role={role}
          onLogout={onLogout}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Workspace Canvas */}
        <main className="flex-1 min-w-0 space-y-6">
          {children}
        </main>
      </div>

      {/* 3. Global Notifications & Directives Drawer */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="rounded-3xl max-w-lg bg-white dark:bg-slate-900 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              Department Notices & Bulletins
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Official circulars and academic alerts for SSIEMS CSE
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 max-h-96 overflow-y-auto pr-1">
            {notifications && notifications.length > 0 ? (
              notifications.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                    {item.priority && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-100 text-indigo-700">
                        {item.priority}
                      </span>
                    )}
                    {item.urgent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-100 text-rose-700">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.content || item.description}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium pt-1">
                    {item.date || item.time || 'Recently published'} • {item.author || 'Department Office'}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No active notifications or bulletins.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              onClick={() => setIsNotificationsOpen(false)}
              className="rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Global Floating Role Switcher Pill */}
      <RoleSwitcher currentRole={role} />
    </div>
  );
}
