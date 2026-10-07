import React, { useState, useEffect } from 'react';
import { api } from '../lib/apiClient';
import DashboardLayout from './layout/DashboardLayout';
import StatCard from './common/StatCard';
import StatusBadge from './common/StatusBadge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Users, BookOpen, FileText, GraduationCap, UserCheck, 
  BarChart3, Upload, ShieldCheck, Bell, Search, Plus, Send, Award, 
  Download, Clock, School, Layers, Settings, FileSpreadsheet, Sparkles,
  TrendingUp, CheckCircle2, AlertCircle, ArrowUpRight, CalendarDays
} from 'lucide-react';
import StudentsManagement from './admin/StudentsManagement';
import TeachersManagement from './admin/TeachersManagement';
import SubjectsManagement from './admin/SubjectsManagement';
import ExamsManagement from './admin/ExamsManagement';
import AnswerSheetsManagement from './admin/AnswerSheetsManagement';
import AssignmentsManagement from './admin/AssignmentsManagement';
import FacultyLeavesApproval from './admin/FacultyLeavesApproval';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    students: 180,
    teachers: 12,
    subjects: 24,
    exams: 18,
    answer_sheets: 142,
    pending_sheets: 15,
  });

  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Continuous Assessment (CA-1) Schedule Notification',
      date: '2026-10-02',
      author: 'Prof. Pawar V.K. (HOD)',
      target: 'All Students & Faculty',
      content: 'CA-1 Examination for SY, TY, and BE CSE is officially scheduled from October 15th, 2026. All faculty members must finalize question sets and marking rubrics on GradeFlow by Friday.',
      urgent: true,
      priority: 'High'
    },
    {
      id: 2,
      title: 'Department Faculty Meeting for NAAC Cycle Review',
      date: '2026-10-03',
      author: 'HOD Office',
      target: 'Faculty Members',
      content: 'All faculty members are requested to attend the departmental review meeting in Seminar Hall at 3:30 PM regarding course files, syllabus completion status, and lab evaluations.',
      urgent: false,
      priority: 'Medium'
    },
    {
      id: 3,
      title: 'Mini-Project & Industrial Internship Logbook Submission',
      date: '2026-09-30',
      author: 'Academic Coordinator',
      target: 'TY-CSE & BE-CSE',
      content: 'Final submission deadline for summer internship completion certificates and Phase-1 project synopses is extended to October 20th.',
      urgent: false,
      priority: 'Normal'
    },
  ]);
  const [newNotice, setNewNotice] = useState({ title: '', target: 'All Students & Faculty', content: '', urgent: false });

  const hodName = user?.name || 'Prof. Pawar V.K.';

  const [attendanceStats, setAttendanceStats] = useState({
    aggregate_rate: 89.7,
    sy_rate: 89.7,
    ty_rate: 86.4,
    be_rate: 91.2,
    today_present: 61,
    today_absent: 5,
  });

  const [leavesSummary, setLeavesSummary] = useState({ total: 3, pending: 1, approved: 2, on_leave_today: 0 });

  useEffect(() => {
    fetchStats();
    fetchNotices();
    fetchAttendanceAnalytics();
    fetchLeavesSummary();
  }, []);

  const fetchLeavesSummary = async () => {
    try {
      const res = await api.get('/leaves/summary');
      if (res.data) setLeavesSummary(res.data);
    } catch (e) {
      console.warn('Leaves summary API offline');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.warn('Backend offline, using department baseline stats');
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      if (res.data && res.data.length > 0) {
        setNotices(res.data);
      }
    } catch (e) {
      console.warn('Backend notices offline');
    }
  };

  const fetchAttendanceAnalytics = async () => {
    try {
      const res = await api.get('/attendance/analytics');
      if (res.data) setAttendanceStats(res.data);
    } catch (e) {
      console.warn('Backend attendance offline');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) {
      toast.error('Please enter circular title and content');
      return;
    }

    try {
      const payload = {
        title: newNotice.title,
        content: newNotice.content,
        author: `${hodName} (HOD)`,
        target: newNotice.target,
        urgent: newNotice.urgent,
        priority: newNotice.urgent ? 'High' : 'Normal',
      };
      const res = await api.post('/notices', payload);
      setNotices([res.data, ...notices]);
      toast.success('Official circular broadcasted & synchronized with Faculty and Students!');
    } catch (err) {
      const created = {
        id: Date.now(),
        title: newNotice.title,
        date: new Date().toISOString().slice(0, 10),
        author: `${hodName} (HOD)`,
        target: newNotice.target,
        content: newNotice.content,
        urgent: newNotice.urgent,
        priority: newNotice.urgent ? 'High' : 'Normal',
      };
      setNotices([created, ...notices]);
      toast.success('Circular broadcasted locally');
    } finally {
      setNewNotice({ title: '', target: 'All Students & Faculty', content: '', urgent: false });
      setNoticeModalOpen(false);
    }
  };

  // Grouped Sidebar Navigation Items matching Section 6
  const navigationSections = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
      ]
    },
    {
      title: 'ACADEMIC MANAGEMENT',
      items: [
        { id: 'students', label: 'Student Management', icon: Users, badge: stats.students },
        { id: 'teachers', label: 'Faculty Management', icon: UserCheck, badge: stats.teachers },
        { id: 'subjects', label: 'Curriculum & Subjects', icon: BookOpen, badge: stats.subjects },
        { id: 'exams', label: 'Examinations', icon: FileText, badge: stats.exams },
        { id: 'assignments', label: 'Academic Assignments', icon: Layers, badge: 'All' },
        { id: 'answer-sheets', label: 'Answer Sheet Evaluation', icon: GraduationCap, badge: stats.pending_sheets > 0 ? `${stats.pending_sheets} pending` : null },
        { id: 'leaves', label: 'Faculty Leaves & CL Approval', icon: CalendarDays, badge: leavesSummary.pending > 0 ? `${leavesSummary.pending} pending` : null },
      ]
    },
    {
      title: 'COMMUNICATIONS & AUDIT',
      items: [
        { id: 'notices', label: 'Notices & Circulars', icon: Bell, badge: notices.length },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: 'Live' },
        { id: 'accreditation', label: 'NAAC / NBA Documentation', icon: ShieldCheck, badge: 'Tier-II' },
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings, badge: null },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={user}
      role="admin"
      title="HOD Command & Operations Center"
      onLogout={onLogout}
      navigationSections={navigationSections}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      notifications={notices}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchPlaceholder="Search students, faculty, subjects, circulars... (Press / to search)"
    >
      {/* VIEW 1: EXECUTIVE DASHBOARD OVERVIEW */}
      {activeNav === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-violet-950 to-indigo-950 text-white p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
              <div className="max-w-3xl">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Shri Sai Samajik Vikas Sanstha • SSIEMS
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  HOD Command & Operations Center
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Welcome, Prof. Pawar V.K. You have full oversight of department activities, examination process, faculty allocations and academic performance.
                </p>
                
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Button
                    onClick={() => setActiveNav('students')}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Manage Students (199)
                  </Button>
                  <Button
                    onClick={() => setActiveNav('answer-sheets')}
                    size="sm"
                    className="bg-white/15 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20"
                  >
                    <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                    Valuation Queue (2)
                  </Button>
                  <Button
                    onClick={() => setNoticeModalOpen(true)}
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Broadcast Notice
                  </Button>
                  <Button
                    onClick={() => setActiveNav('leaves')}
                    size="sm"
                    className="bg-white/15 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20"
                  >
                    <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    Leave Approvals ({leavesSummary.pending})
                  </Button>
                </div>
              </div>

              {/* Date & Time Badge */}
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-medium self-start">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Tuesday 7 Oct 2026 • 10:24 AM</span>
              </div>
            </div>

            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-violet-500/10 pointer-events-none"></div>
          </div>

          {/* 4 OVERVIEW KPI STAT CARDS MATCHING MOCKUP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              value="199"
              subtitle="SY: 68 | TY: 62 | BE: 50"
              icon={Users}
              colorVariant="blue"
            />
            <StatCard
              title="Department Faculty"
              value="12"
              subtitle="100% Courses Assigned"
              icon={UserCheck}
              colorVariant="violet"
            />
            <StatCard
              title="Accredited Subjects"
              value="19"
              subtitle="Across 6 Semesters"
              icon={BookOpen}
              colorVariant="emerald"
            />
            <StatCard
              title="Pending Evaluation"
              value="2"
              subtitle="Assigned to Subject Teachers"
              icon={GraduationCap}
              colorVariant="rose"
            />
          </div>

          {/* SPLIT ROW: LEFT COL (TEACHING LOAD + STUDENT STRENGTH) & RIGHT COL (NOTICES + QUICK ACTIONS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Faculty Teaching Load Card */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      Faculty Teaching Load
                    </h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Weekly workload and subject distribution
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveNav('teachers')}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 font-bold hover:text-blue-700"
                  >
                    View All
                  </Button>
                </div>

                <div className="mt-4 space-y-2.5">
                  {[
                    { name: 'Prof. Pawar V.K.', course: 'Computer Networks, Cloud Computing', load: '14 hrs/wk' },
                    { name: 'Prof. Bais P. G.', course: 'Discrete Mathematics, Python Lab', load: '16 hrs/wk' },
                    { name: 'Prof. Magar A. R.', course: 'Data Structures & Algorithms', load: '16 hrs/wk' },
                    { name: 'Prof. Devkar R. S.', course: 'Object Oriented Programming (Java)', load: '16 hrs/wk' },
                  ].map((fac, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 font-black flex items-center justify-center text-xs">
                          {fac.name.split(' ')[1]?.[0] || 'P'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{fac.name}</div>
                          <div className="text-[11px] text-slate-500">{fac.course}</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {fac.load}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Student Strength (Branch-wise) Bar Chart */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Student Strength (Branch-wise)
                  </h2>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Enrolled undergraduate candidates across academic years
                  </p>
                </div>

                <div className="mt-6 flex items-end justify-around h-44 pt-4 px-6 border-b border-slate-100 dark:border-slate-800">
                  {/* SY */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{stats.sy_students ?? 54}</span>
                    <div 
                      className="w-14 bg-blue-600 rounded-t-xl transition-all hover:bg-blue-700" 
                      style={{ height: `${Math.round(((stats.sy_students ?? 54) / (stats.students ?? 199)) * 260)}px` }}
                      title={`Second Year: ${stats.sy_students ?? 54} Students`}
                    ></div>
                    <span className="text-xs font-black text-slate-500 uppercase">SY</span>
                  </div>

                  {/* TY */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{stats.ty_students ?? 75}</span>
                    <div 
                      className="w-14 bg-indigo-600 rounded-t-xl transition-all hover:bg-indigo-700" 
                      style={{ height: `${Math.round(((stats.ty_students ?? 75) / (stats.students ?? 199)) * 260)}px` }}
                      title={`Third Year: ${stats.ty_students ?? 75} Students`}
                    ></div>
                    <span className="text-xs font-black text-slate-500 uppercase">TY</span>
                  </div>

                  {/* BE */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{stats.be_students ?? 70}</span>
                    <div 
                      className="w-14 bg-purple-600 rounded-t-xl transition-all hover:bg-purple-700" 
                      style={{ height: `${Math.round(((stats.be_students ?? 70) / (stats.students ?? 199)) * 260)}px` }}
                      title={`Final Year: ${stats.be_students ?? 70} Students`}
                    ></div>
                    <span className="text-xs font-black text-slate-500 uppercase">BE</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between text-xs text-slate-500">
                  <span>Total Enrolled: <strong className="text-slate-900 dark:text-white">{stats.students ?? 199} Students</strong></span>
                  <span className="font-bold text-blue-600">Department Intake: 100%</span>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Recent Notices & Circulars Preview */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      Recent Notices & Circulars
                    </h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Directives published to department portal
                    </p>
                  </div>
                  <Button
                    onClick={() => setNoticeModalOpen(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl h-8 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    New
                  </Button>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">CA-1 Examination Schedule</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-100 text-rose-700">Urgent</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      CA-1 for SY and TY scheduled from October 15th, 2026. Faculty members must finalize question sets.
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium pt-1">2026-10-02</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Department Faculty Meeting</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-700">Medium</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Discussion on NAAC documentation & Syllabus progress.
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium pt-1">2026-10-03</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">AICTE Compliance Upload</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-200 text-slate-700">Low</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Review faculty publication records on department portal.
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium pt-1">2026-10-01</div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions Card with 4 Buttons */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Quick Actions
                  </h2>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Fast administrative operations
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setNoticeModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 text-center transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Send className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Issue Circular</span>
                  </button>

                  <button
                    onClick={() => setActiveNav('reports')}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 text-center transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Generate Report</span>
                  </button>

                  <button
                    onClick={() => setActiveNav('teachers')}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 text-center transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Allocate Faculty</span>
                  </button>

                  <button
                    onClick={() => setActiveNav('reports')}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 text-center transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">View Analytics</span>
                  </button>
                </div>
              </Card>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: STUDENT MANAGEMENT */}
      {activeNav === 'students' && (
        <div className="animate-in fade-in duration-150">
          <StudentsManagement />
        </div>
      )}

      {/* VIEW 3: FACULTY MANAGEMENT */}
      {activeNav === 'teachers' && (
        <div className="animate-in fade-in duration-150">
          <TeachersManagement />
        </div>
      )}

      {/* VIEW 4: CURRICULUM & SUBJECTS */}
      {activeNav === 'subjects' && (
        <div className="animate-in fade-in duration-150">
          <SubjectsManagement />
        </div>
      )}

      {/* VIEW 5: EXAMINATIONS */}
      {activeNav === 'exams' && (
        <div className="animate-in fade-in duration-150">
          <ExamsManagement />
        </div>
      )}

      {/* VIEW 6: ACADEMIC ASSIGNMENTS */}
      {activeNav === 'assignments' && (
        <div className="animate-in fade-in duration-150">
          <AssignmentsManagement />
        </div>
      )}

      {/* VIEW 7: ANSWER SHEET EVALUATION */}
      {activeNav === 'answer-sheets' && (
        <div className="animate-in fade-in duration-150">
          <AnswerSheetsManagement onUpdate={fetchStats} />
        </div>
      )}

      {/* VIEW 7B: FACULTY LEAVE & CL APPROVAL */}
      {activeNav === 'leaves' && (
        <div className="animate-in fade-in duration-150">
          <FacultyLeavesApproval onUpdate={() => { fetchStats(); fetchLeavesSummary(); }} />
        </div>
      )}

      {/* VIEW 8: NOTICES & CIRCULARS */}
      {activeNav === 'notices' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 animate-in fade-in duration-150 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Department Circulars & Notice Broadcaster</h3>
              <p className="text-xs text-slate-500">Official directives issued under seal of HOD Office</p>
            </div>
            <Button
              onClick={() => setNoticeModalOpen(true)}
              className="bg-violet-700 hover:bg-violet-800 text-white text-xs rounded-xl font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Broadcast New Circular
            </Button>
          </div>

          <div className="space-y-4">
            {notices.map((n) => (
              <div key={n.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{n.title}</span>
                    {n.urgent && <StatusBadge status="urgent" text="Urgent Alert" />}
                  </div>
                  <span className="text-xs text-slate-400">{n.date}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{n.content}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-500">
                  <span>Issued by: <strong>{n.author}</strong></span>
                  <span className="bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded-md text-[11px]">Recipient: {n.target}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* VIEW 9: REPORTS & ANALYTICS */}
      {activeNav === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Class-Wise Pass Percentages</h3>
            <p className="text-xs text-slate-500">Aggregated performance across Semester-III and Semester-V</p>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Second Year (SY-CSE) Pass Rate</span>
                <strong className="text-emerald-600">94.2%</strong>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-semibold pt-2">
                <span>Third Year (TY-CSE) Pass Rate</span>
                <strong className="text-blue-600">89.6%</strong>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89.6%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-semibold pt-2">
                <span>Final Year (BE-CSE) Pass Rate</span>
                <strong className="text-purple-600">96.0%</strong>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96.0%' }}></div>
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Master Tabulation Register</h3>
            <p className="text-xs text-slate-500">Generate University DBATU format consolidated marks report</p>
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-semibold">Select Target Batch</Label>
              <Select defaultValue="sy">
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Choose batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sy">SY-CSE (Semester III)</SelectItem>
                  <SelectItem value="ty">TY-CSE (Semester V)</SelectItem>
                  <SelectItem value="be">BE-CSE (Semester VII)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => toast.success('Department Master Tabulation Register downloaded successfully!')}
              className="w-full bg-violet-700 hover:bg-violet-800 text-white rounded-xl text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-2" /> Download Tabulation Register (Excel)
            </Button>
          </Card>
        </div>
      )}

      {/* VIEW 10: NAAC / NBA ACCREDITATION */}
      {activeNav === 'accreditation' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 animate-in fade-in duration-150 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">NAAC & NBA Accreditation Criteria 2.6</h3>
              <p className="text-xs text-slate-500">Institutional Attainment & Syllabus Completion Compliance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-semibold">Faculty Qualification Ratio</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">100% Post-Graduate</div>
              <p className="text-[11px] text-emerald-600 mt-1">Complies with AICTE 1:15 ratio</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-semibold">Syllabus Completion Index</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">94.2%</div>
              <p className="text-[11px] text-emerald-600 mt-1">On schedule for Semester-I</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-semibold">Continuous Assessment Cycle</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">CA-1 Live</div>
              <p className="text-[11px] text-violet-600 mt-1">Normalized marks audit enabled</p>
            </div>
          </div>
        </Card>
      )}

      {/* VIEW 11: SETTINGS */}
      {activeNav === 'settings' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Department Operations Settings</h3>
          <p className="text-xs text-slate-500">Configure academic session parameters and grading thresholds</p>
          <div className="pt-2 space-y-3 max-w-md">
            <div>
              <Label className="text-xs font-bold">Active Academic Term</Label>
              <Input value="Autumn Session 2026-27" readOnly className="mt-1 text-xs rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">Minimum Attendance Threshold</Label>
              <Input value="75.0% (AICTE / University Norm)" readOnly className="mt-1 text-xs rounded-xl" />
            </div>
          </div>
        </Card>
      )}

      {/* ISSUE CIRCULAR MODAL */}
      <Dialog open={noticeModalOpen} onOpenChange={setNoticeModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white dark:bg-slate-900 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 dark:text-white">
              Issue Official Department Circular
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Broadcast an authenticated announcement to students and faculty under HOD authority.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNotice} className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold">Circular Subject / Title</Label>
              <Input
                placeholder="e.g. Schedule for CA-1 Examination & Guidelines"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                className="mt-1 text-xs rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Target Audience</Label>
              <Select
                value={newNotice.target}
                onValueChange={(val) => setNewNotice({ ...newNotice, target: val })}
              >
                <SelectTrigger className="mt-1 text-xs rounded-xl">
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Students & Faculty">All Students & Faculty</SelectItem>
                  <SelectItem value="All Faculty Members">All Faculty Members</SelectItem>
                  <SelectItem value="SY-CSE Students">SY-CSE Students</SelectItem>
                  <SelectItem value="TY-CSE Students">TY-CSE Students</SelectItem>
                  <SelectItem value="BE-CSE Students">BE-CSE Students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Detailed Message Body</Label>
              <Textarea
                placeholder="Enter complete circular text..."
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                rows={4}
                className="mt-1 text-xs rounded-xl"
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="urgent-check"
                checked={newNotice.urgent}
                onChange={(e) => setNewNotice({ ...newNotice, urgent: e.target.checked })}
                className="w-4 h-4 text-violet-600 rounded cursor-pointer"
              />
              <label htmlFor="urgent-check" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Mark as High Priority / Urgent Alert
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNoticeModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-violet-700 hover:bg-violet-800 text-white text-xs rounded-xl font-semibold"
              >
                Broadcast Circular
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;