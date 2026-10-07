import React, { useState, useEffect } from 'react';
import { api } from '../lib/apiClient';
import DashboardLayout from './layout/DashboardLayout';
import StatCard from './common/StatCard';
import StatusBadge from './common/StatusBadge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Users, BookOpen, ArrowLeftRight, FileText, CheckSquare, 
  UserCheck, UserX, BarChart3, MessageSquare, Calendar, Clock, 
  Bell, Search, Plus, CheckCircle2, Award, Layers, Zap, School, 
  CalendarCheck, AlertCircle, Send, X, ExternalLink, GraduationCap, 
  Eye, Trash2, Download, Upload, Filter, Sparkles, ShieldCheck, 
  Check, Settings, ArrowUpRight, TrendingUp, ChevronRight, CalendarDays
} from 'lucide-react';
import AssignmentReview from './teacher/AssignmentReview';
import TimetableView from './teacher/TimetableView';
import FacultyLeaveManagement from './teacher/FacultyLeaveManagement';

// Mock datasets for offline reliability & fast responsiveness
const MOCK_STUDENTS = [
  { id: 's1', name: 'Syed Asif', roll_number: '2024SYCSE001', class_name: 'SY-CSE', email: 'asif@ssiems.org.in', attendance: '92.3%' },
  { id: 's2', name: 'Shivani Lokhande', roll_number: '2024SYCSE002', class_name: 'SY-CSE', email: 'shivani@ssiems.org.in', attendance: '88.0%' },
  { id: 's3', name: 'Adarsh Surye', roll_number: '2024SYCSE003', class_name: 'SY-CSE', email: 'adarsh@ssiems.org.in', attendance: '87.5%' },
  { id: 's4', name: 'Vaishnavi Udawant', roll_number: '2024TYCSE001', class_name: 'TY-CSE', email: 'vaishnavi@ssiems.org.in', attendance: '91.0%' },
  { id: 's5', name: 'Karan Ingole', roll_number: '2024TYCSE002', class_name: 'TY-CSE', email: 'karan@ssiems.org.in', attendance: '85.2%' },
  { id: 's6', name: 'Shweta Ghuge', roll_number: '2024BECSE001', class_name: 'BE-CSE', email: 'shweta@ssiems.org.in', attendance: '94.1%' },
  { id: 's7', name: 'Onkar Patil', roll_number: '2024SYCSE004', class_name: 'SY-CSE', email: 'onkar@ssiems.org.in', attendance: '89.4%' },
  { id: 's8', name: 'Pranita Kulkarni', roll_number: '2024SYCSE005', class_name: 'SY-CSE', email: 'pranita@ssiems.org.in', attendance: '90.1%' },
];

const MOCK_SUBJECTS = [
  { id: 'sub1', name: 'Discrete Mathematics', code: 'DM101', class_name: 'SY-CSE', enrolled: 68, syllabusCompleted: 62 },
  { id: 'sub2', name: 'Data Structures & Algorithms', code: 'DSA102', class_name: 'SY-CSE', enrolled: 68, syllabusCompleted: 58 },
  { id: 'sub3', name: 'Machine Learning', code: 'ML301', class_name: 'BE-CSE', enrolled: 52, syllabusCompleted: 70 },
  { id: 'sub4', name: 'Object Oriented Programming', code: 'OOP103', class_name: 'SY-CSE', enrolled: 68, syllabusCompleted: 65 },
];

const MOCK_EXAMS = [
  { id: 'ex1', exam_type: 'CA-1', total_marks: 20, subject_id: 'sub1', class_name: 'SY-CSE', date: '2026-10-15', status: 'Grading Active' },
  { id: 'ex2', exam_type: 'Mid Semester', total_marks: 50, subject_id: 'sub1', class_name: 'SY-CSE', date: '2026-11-05', status: 'Upcoming' },
  { id: 'ex3', exam_type: 'CA-2', total_marks: 20, subject_id: 'sub2', class_name: 'SY-CSE', date: '2026-11-20', status: 'Upcoming' },
];

const MOCK_FACULTY = [
  { name: 'Prof. Pawar V.K.', role: 'HOD & Assistant Professor', email: 'head.cse@ssiems.in', phone: '+91 9876543201', dept: 'CSE' },
  { name: 'Prof. Bais P. G.', role: 'Class Teacher & Asst Professor', email: 'bpg@ssiems.org.in', phone: '+91 9876543210', dept: 'CSE' },
  { name: 'Prof. Magar A. R.', role: 'Assistant Professor', email: 'amol.magar@cse.ssiems.in', phone: '+91 9876543202', dept: 'CSE' },
  { name: 'Prof. Devkar R. S.', role: 'Assistant Professor', email: 'rajesh.devkar@cse.ssiems.in', phone: '+91 9876543211', dept: 'CSE' },
  { name: 'Prof. Shelke S. B.', role: 'Assistant Professor', email: 'snehal.shelke@cse.ssiems.in', phone: '+91 9876543203', dept: 'CSE' },
  { name: 'Prof. Panchalwar D. A.', role: 'Assistant Professor', email: 'divyani.panchalwar@cse.ssiems.in', phone: '+91 9876543204', dept: 'CSE' },
];

const TeacherDashboard = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Modals
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [quickAttendanceOpen, setQuickAttendanceOpen] = useState(false);
  const [lectureSwapModalOpen, setLectureSwapModalOpen] = useState(false);
  
  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Submit Discrete Mathematics CA-1 Question Key to HOD', category: 'Exam', completed: false, priority: 'High' },
    { id: 2, text: 'Verify SY-CSE lab attendance for Data Structures', category: 'Academic', completed: true, priority: 'Normal' },
    { id: 3, text: 'Review Batch A Mini-Project Problem Statements', category: 'Departmental', completed: false, priority: 'Medium' },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Academic');
  const [newTaskPriority, setNewTaskPriority] = useState('High');

  // Attendance Overview state
  const [selectedDate, setSelectedDate] = useState('04-10-2026');
  const [attendanceRecords, setAttendanceRecords] = useState({
    present: 61,
    absent: 5,
    late: 2,
    rate: 89.7,
    hasData: true
  });
  const [attendanceClass, setAttendanceClass] = useState('SY-CSE');
  const [studentAttendanceList, setStudentAttendanceList] = useState([]);

  // Backend state
  const [answerSheets, setAnswerSheets] = useState([]);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [exams, setExams] = useState(MOCK_EXAMS);
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [maskIdentity, setMaskIdentity] = useState(false);

  // Today's lecture schedule
  const todayLectures = [
    {
      id: 'lec1',
      subject: 'Discrete Mathematics (DM101)',
      class: 'SY-CSE (Batch A & B)',
      room: 'CR-204',
      time: '10:00 AM - 11:00 AM',
      type: 'Theory',
      status: 'Completed',
      attendance: '61 / 68 Present',
    },
    {
      id: 'lec2',
      subject: 'Data Structures Lab (DSA102)',
      class: 'SY-CSE (Batch A)',
      room: 'Lab 3 (Advanced Computing)',
      time: '01:00 PM - 03:00 PM',
      type: 'Laboratory',
      status: 'In Progress',
      attendance: '32 / 34 Present',
    },
    {
      id: 'lec3',
      subject: 'Discrete Mathematics Tutorial',
      class: 'SY-CSE (Batch B)',
      room: 'CR-204',
      time: '03:30 PM - 04:30 PM',
      type: 'Tutorial',
      status: 'Upcoming',
      attendance: 'Not Started',
    },
  ];

  // Lecture Swap state
  const [swapRequests, setSwapRequests] = useState([
    { id: 1, from: 'Prof. Bais P.G.', to: 'Prof. Devkar R. S.', date: '06-10-2026', slot: '10:00 - 11:00 AM', subject: 'Discrete Mathematics', status: 'Pending' },
    { id: 2, from: 'Prof. Magar A. R.', to: 'Prof. Bais P.G.', date: '08-10-2026', slot: '02:00 - 03:00 PM', subject: 'Software Engg', status: 'Approved' }
  ]);
  const [newSwap, setNewSwap] = useState({ colleague: 'Prof. Devkar R. S.', date: '', slot: '10:00 - 11:00 AM', reason: '' });

  // Community Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Prof. Pawar V.K. (HOD)', time: 'Yesterday 4:30 PM', text: 'Reminder: All faculty please submit CA-1 question papers by Friday.', isHOD: true },
    { id: 2, sender: 'Prof. Magar A. R.', time: 'Today 9:15 AM', text: 'SY-CSE lab schedule has been updated on the notice board.', isHOD: false },
    { id: 3, sender: 'Prof. Bais P. G.', time: 'Today 10:00 AM', text: 'Discrete Mathematics tutorial sheets uploaded for class review.', isHOD: false },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Department Alerts list
  const [departmentAlerts, setDepartmentAlerts] = useState([
    { id: 1, title: 'Continuous Assessment (CA-1) Schedule', time: '2 hours ago', priority: 'High', description: 'CA-1 for SY and TY commences from October 15th, 2026. Hall tickets available on portal.' },
    { id: 2, title: 'Department Faculty Meeting', time: '1 day ago', priority: 'Medium', description: 'Staff meeting scheduled on Tuesday at 3:30 PM in Seminar Hall regarding NAAC cycle review.' },
    { id: 3, title: 'AICTE Compliance Upload Reminder', time: '2 days ago', priority: 'Low', description: 'Faculty members are requested to update faculty publication profiles in the portal.' }
  ]);

  const teacherName = user?.name || 'Prof. Bais P. G.';
  const teacherRole = user?.designation || 'Class Teacher (SY-CSE)';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sheetsRes, studentsRes, examsRes, subjectsRes, noticesRes, tasksRes] = await Promise.allSettled([
        api.get('/answer-sheets'),
        api.get('/students'),
        api.get('/exams'),
        api.get('/subjects'),
        api.get('/notices'),
        api.get('/tasks'),
      ]);

      if (sheetsRes.status === 'fulfilled' && Array.isArray(sheetsRes.value?.data)) {
        setAnswerSheets(sheetsRes.value.data);
      }
      if (studentsRes.status === 'fulfilled' && Array.isArray(studentsRes.value?.data) && studentsRes.value.data.length > 0) {
        setStudents(studentsRes.value.data);
      }
      if (examsRes.status === 'fulfilled' && Array.isArray(examsRes.value?.data) && examsRes.value.data.length > 0) {
        setExams(examsRes.value.data);
      }
      if (subjectsRes.status === 'fulfilled' && Array.isArray(subjectsRes.value?.data) && subjectsRes.value.data.length > 0) {
        setSubjects(subjectsRes.value.data);
      }
      if (noticesRes.status === 'fulfilled' && Array.isArray(noticesRes.value?.data) && noticesRes.value.data.length > 0) {
        setDepartmentAlerts(noticesRes.value.data.map(n => ({
          id: n.id,
          title: n.title,
          time: n.date || 'Recent',
          priority: n.priority || (n.urgent ? 'High' : 'Normal'),
          description: n.content
        })));
      }
      if (tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value?.data) && tasksRes.value.data.length > 0) {
        setTasks(tasksRes.value.data);
      }
    } catch (e) {
      console.warn('Backend offline, loaded fallback datasets');
    }
  };

  // Task Handlers - Real Centralized Persistence
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const res = await api.post('/tasks', {
        text: newTaskText.trim(),
        category: newTaskCategory,
        priority: newTaskPriority,
        teacher_id: user?.id || 't2',
      });
      setTasks([res.data, ...tasks]);
      toast.success('Daily task scheduled & stored in centralized database');
    } catch (err) {
      const task = {
        id: Date.now(),
        text: newTaskText.trim(),
        category: newTaskCategory,
        priority: newTaskPriority,
        completed: false,
      };
      setTasks([task, ...tasks]);
      toast.success('Daily task scheduled locally');
    }
    setNewTaskText('');
    setAddTaskModalOpen(false);
  };

  const toggleTask = async (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      await api.put(`/tasks/${id}/toggle`);
    } catch (e) {
      // Local fallback
    }
  };

  const deleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.info('Task removed');
    try {
      await api.delete(`/tasks/${id}`);
    } catch (e) {
      // Local fallback
    }
  };

  // Quick Attendance Handlers - Centralized Sync with Students and HOD
  const openAttendanceModal = () => {
    const classStudents = students.filter(s => !attendanceClass || s.class_name === attendanceClass);
    setStudentAttendanceList(classStudents.map(s => ({ ...s, status: 'present' })));
    setQuickAttendanceOpen(true);
  };

  const toggleStudentStatus = (studentId, status) => {
    setStudentAttendanceList(studentAttendanceList.map(s => 
      s.id === studentId ? { ...s, status } : s
    ));
  };

  const saveAttendance = async () => {
    const total = studentAttendanceList.length;
    const presentCount = studentAttendanceList.filter(s => s.status === 'present').length;
    const absentCount = studentAttendanceList.filter(s => s.status === 'absent').length;
    const lateCount = studentAttendanceList.filter(s => s.status === 'late').length;
    const rate = total > 0 ? Number(((presentCount / total) * 100).toFixed(1)) : 0;

    try {
      const payload = {
        subject_id: 'DM101',
        subject_name: 'Discrete Mathematics',
        teacher_id: user?.id || 't2',
        teacher_name: teacherName,
        class_name: attendanceClass || 'SY-CSE',
        date: selectedDate || new Date().toISOString().slice(0, 10),
        time_slot: '10:00 - 11:00 AM',
        records: studentAttendanceList.map(s => ({
          student_id: s.id,
          roll_number: s.roll_number,
          name: s.name,
          status: s.status
        }))
      };
      await api.post('/attendance/session', payload);
      toast.success(`Attendance synchronized: ${presentCount} Present, ${absentCount} Absent (${rate}%)`);
    } catch (err) {
      toast.success(`Attendance logged locally: ${presentCount} Present, ${absentCount} Absent (${rate}%)`);
    }

    setAttendanceRecords({
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      rate: rate,
      hasData: true
    });
    setQuickAttendanceOpen(false);
  };

  // Lecture Swap Handlers
  const handleCreateSwap = (e) => {
    e.preventDefault();
    if (!newSwap.date) {
      toast.error('Please pick a date for the lecture swap');
      return;
    }
    const item = {
      id: Date.now(),
      from: teacherName,
      to: newSwap.colleague,
      date: newSwap.date,
      slot: newSwap.slot,
      subject: 'Discrete Mathematics',
      status: 'Pending'
    };
    setSwapRequests([item, ...swapRequests]);
    setLectureSwapModalOpen(false);
    setNewSwap({ colleague: 'Prof. Devkar R. S.', date: '', slot: '10:00 - 11:00 AM', reason: '' });
    toast.success('Lecture swap request submitted successfully');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now(),
      sender: teacherName,
      time: 'Just now',
      text: newMessage.trim(),
      isHOD: false
    };
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  // Calendar dates for October 2026
  const calendarDays = [
    { day: null, date: null }, { day: null, date: null }, { day: null, date: null }, { day: null, date: null },
    { day: 'TH', date: 1 }, { day: 'FR', date: 2 }, { day: 'SA', date: 3 },
    { day: 'SU', date: 4, isSunday: true, isToday: true },
    { day: 'MO', date: 5 }, { day: 'TU', date: 6 }, { day: 'WE', date: 7 }, { day: 'TH', date: 8 }, { day: 'FR', date: 9 }, { day: 'SA', date: 10 },
    { day: 'SU', date: 11, isSunday: true },
    { day: 'MO', date: 12 }, { day: 'TU', date: 13 }, { day: 'WE', date: 14 }, { day: 'TH', date: 15 }, { day: 'FR', date: 16 }, { day: 'SA', date: 17 },
    { day: 'SU', date: 18, isSunday: true },
    { day: 'MO', date: 19 }, { day: 'TU', date: 20 }, { day: 'WE', date: 21 }, { day: 'TH', date: 22 }, { day: 'FR', date: 23 }, { day: 'SA', date: 24 },
    { day: 'SU', date: 25, isSunday: true },
    { day: 'MO', date: 26 }, { day: 'TU', date: 27 }, { day: 'WE', date: 28 }, { day: 'TH', date: 29 }, { day: 'FR', date: 30 }, { day: 'SA', date: 31 },
  ];

  // Grouped Navigation matching Master Prompt Section 7
  const navigationSections = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'classes', label: 'My Classes', icon: BookOpen, badge: 'SY-CSE' },
        { id: 'timetable', label: 'Timetable', icon: Calendar, badge: 'Active' },
      ]
    },
    {
      title: 'ACADEMICS & EVALUATION',
      items: [
        { id: 'attendance', label: 'Attendance Register', icon: UserCheck, badge: `${attendanceRecords.rate}%` },
        { id: 'assignments', label: 'Assignments', icon: FileText, badge: 'Active' },
        { id: 'exams', label: 'Examinations & Marks', icon: CheckSquare, badge: 'CA-1' },
        { id: 'evaluation', label: 'Answer Sheet Evaluation', icon: GraduationCap, badge: '4 Pending' },
      ]
    },
    {
      title: 'COLLABORATION',
      items: [
        { id: 'leaves', label: 'Faculty Leaves & CL', icon: CalendarDays, badge: 'CL Quota' },
        { id: 'swap', label: 'Lecture Swap', icon: ArrowLeftRight, badge: swapRequests.length },
        { id: 'faculty', label: 'Faculty Directory', icon: School, badge: MOCK_FACULTY.length },
        { id: 'chat', label: 'Department Chat', icon: MessageSquare, badge: chatMessages.length },
      ]
    },
    {
      title: 'DIRECTORY & REPORTS',
      items: [
        { id: 'students', label: 'Student Directory', icon: Users, badge: students.length },
        { id: 'reports', label: 'Academic Reports', icon: BarChart3, badge: 'Live' },
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
      role="teacher"
      title="Faculty & Teacher Operations Center"
      onLogout={onLogout}
      navigationSections={navigationSections}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      notifications={departmentAlerts}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchPlaceholder="Search classes, students, assignments, answer sheets... (Press / to search)"
    >
      {/* 1. OVERVIEW DASHBOARD VIEW */}
      {activeNav === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Welcome Hero Banner with Deep Blue Gradient Accent */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs font-semibold mb-2 border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Academic Session 2026–2027 • SY-CSE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Welcome back, Prof.Bais P.G.
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  You have 2 lectures scheduled today and 1 priority task pending. All academic activities are synchronized in real-time.
                </p>
                
                {/* Hero Action Buttons */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Button
                    onClick={openAttendanceModal}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                    Take Today's Attendance
                  </Button>
                  <Button
                    onClick={() => setAddTaskModalOpen(true)}
                    size="sm"
                    className="bg-white/15 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Task
                  </Button>
                  <Button
                    onClick={() => setLectureSwapModalOpen(true)}
                    size="sm"
                    className="bg-white/15 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
                    Request Lecture Swap
                  </Button>
                  <Button
                    onClick={() => setActiveNav('leaves')}
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs rounded-xl shadow-sm"
                  >
                    <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                    Apply for CL / Leave
                  </Button>
                </div>
              </div>

              {/* Date & Time Badge */}
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-medium self-start">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tuesday 7 Oct 2026 • 10:24 AM</span>
              </div>
            </div>

            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-cyan-500/10 pointer-events-none"></div>
          </div>

          {/* 4 OVERVIEW STAT CARDS MATCHING MOCKUP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Assigned Students"
              value="199"
              subtitle="Class: SY-CSE (Batch A & B)"
              icon={Users}
              colorVariant="blue"
            />
            <StatCard
              title="Attendance Rate"
              value="89.7%"
              subtitle="61 Present Today"
              icon={UserCheck}
              colorVariant="emerald"
            />
            <StatCard
              title="Continuous Assessment"
              value="CA-1 Live"
              subtitle="Submissions in Review"
              icon={Award}
              colorVariant="amber"
            />
            <StatCard
              title="Pending Evaluations"
              value="2 Papers"
              subtitle="Discrete Math & DSA"
              icon={GraduationCap}
              colorVariant="rose"
            />
          </div>

          {/* SPLIT ROW: LEFT COL (SCHEDULE + NOTICES) & RIGHT COL (TASKS + ATTENDANCE TREND) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Today's Class Schedule Card */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      Today's Class Schedule
                    </h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Lecture timetable for SY-CSE
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveNav('timetable')}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 font-bold hover:text-blue-700"
                  >
                    View All
                  </Button>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-400 text-[11px]">09:00 AM</span>
                      <div className="font-bold text-slate-900 dark:text-white">Discrete Mathematics</div>
                      <div className="text-[11px] text-slate-500">SY-CSE (A)</div>
                    </div>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                      LT-1
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-400 text-[11px]">10:00 AM</span>
                      <div className="font-bold text-slate-900 dark:text-white">Data Structures & Algorithms</div>
                      <div className="text-[11px] text-slate-500">SY-CSE (A)</div>
                    </div>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                      LT-3
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-400 text-[11px]">01:00 PM</span>
                      <div className="font-bold text-slate-900 dark:text-white">Python Lab</div>
                      <div className="text-[11px] text-slate-500">SY-CSE (B)</div>
                    </div>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                      Lab-3
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-400 text-[11px]">02:00 PM</span>
                      <div className="font-bold text-slate-900 dark:text-white">Mentor Meeting</div>
                      <div className="text-[11px] text-slate-500">Department</div>
                    </div>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                      Seminar Hall
                    </span>
                  </div>
                </div>
              </Card>

              {/* Recent Department Notices Card */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      Recent Department Notices
                    </h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Directives from HOD and Examination section
                    </p>
                  </div>
                  <Button
                    onClick={() => toast.info('Displaying full notices archive')}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 font-bold hover:text-blue-700"
                  >
                    View All
                  </Button>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Continuous Assessment (CA-1) Schedule</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-100 text-rose-700">High</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      CA-1 for SY and TY scheduled from October 15th, 2026.
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
                      <span className="text-xs font-bold text-slate-900 dark:text-white">AICTE Compliance Upload Reminder</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-200 text-slate-700">Low</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Review faculty publication records on department portal.
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium pt-1">2026-10-01</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* My Tasks & Activities Card */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      My Tasks & Activities
                    </h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Checklist & pending evaluation reminders
                    </p>
                  </div>
                  <Button
                    onClick={() => setAddTaskModalOpen(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl h-8 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Task
                  </Button>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-200 line-through">Check CA-1 answer sheets</span>
                        <div className="text-[10px] text-slate-400">Discrete Mathematics</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Upload attendance for DSA Lab</span>
                        <div className="text-[10px] text-slate-400">SY-CSE (Batch A)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Prepare CO-PO mapping report</span>
                        <div className="text-[10px] text-slate-400">For NBA documentation</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Update lecture notes</span>
                        <div className="text-[10px] text-slate-400">For next week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Class Attendance Trend (SY-CSE) Line Chart Card */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      Class Attendance Trend (SY-CSE)
                    </h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Weekly attendance progression
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-sm">
                    89.7%
                  </span>
                </div>

                <div className="mt-6 h-36 w-full relative">
                  {/* SVG Line Graph */}
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10,75 L 75,55 L 150,30 L 225,45 L 290,15 L 290,100 L 10,100 Z"
                      fill="url(#trendGrad)"
                    />
                    <path
                      d="M 10,75 L 75,55 L 150,30 L 225,45 L 290,15"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="10" cy="75" r="4" fill="#2563EB" />
                    <circle cx="75" cy="55" r="4" fill="#2563EB" />
                    <circle cx="150" cy="30" r="4" fill="#2563EB" />
                    <circle cx="225" cy="45" r="4" fill="#2563EB" />
                    <circle cx="290" cy="15" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                </div>

                <div className="pt-4 flex justify-between text-xs text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                  <span className="font-bold text-blue-600">Current (89.7%)</span>
                </div>
              </Card>
            </div>

          </div>
        </div>
      )}
      {/* 2. MY CLASSES VIEW */}
      {activeNav === 'classes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Assigned Teaching Classes & Curriculum</h2>
              <p className="text-xs text-slate-500 font-medium">Undergraduate Computer Science courses assigned to {teacherName}</p>
            </div>
            <Button
              onClick={() => setActiveNav('timetable')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> View Timetable Grid
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((sub) => (
              <Card key={sub.id} className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                    {sub.code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">{sub.class_name}</span>
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">{sub.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Enrolled: {sub.enrolled} Students</p>
                </div>
                
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Syllabus Progress</span>
                    <span className="text-blue-600 font-bold">{sub.syllabusCompleted || 65}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${sub.syllabusCompleted || 65}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full text-xs rounded-xl"
                    onClick={() => toast.success(`Course plan & syllabus file downloaded for ${sub.name}`)}
                  >
                    <Download className="w-3 h-3 mr-1" /> Course File
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3. TIMETABLE VIEW */}
      {activeNav === 'timetable' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <TimetableView />
        </div>
      )}

      {/* 4. ATTENDANCE REGISTER */}
      {activeNav === 'attendance' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Attendance Marker & Register</h3>
              <p className="text-xs text-slate-500">Record classroom roll call for Semester III • Class: SY-CSE</p>
            </div>
            <Button 
              onClick={openAttendanceModal}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Mark Today's Attendance
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <div className="text-2xl font-black text-emerald-700">{attendanceRecords.present}</div>
              <div className="text-[10px] font-bold uppercase text-emerald-600">Total Present</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center">
              <div className="text-2xl font-black text-rose-700">{attendanceRecords.absent}</div>
              <div className="text-[10px] font-bold uppercase text-rose-600">Total Absent</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <div className="text-2xl font-black text-amber-700">{attendanceRecords.late}</div>
              <div className="text-[10px] font-bold uppercase text-amber-600">Total Late</div>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-center">
              <div className="text-2xl font-black text-sky-700">{attendanceRecords.rate}%</div>
              <div className="text-[10px] font-bold uppercase text-sky-600">Compliance Rate</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-black text-slate-400">
                <tr>
                  <th className="p-3 rounded-l-xl">Student Name</th>
                  <th className="p-3">PRN / Roll Number</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3 rounded-r-xl text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {student.name[0]}
                      </div>
                      <span>{student.name}</span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-600 dark:text-slate-300">{student.roll_number}</td>
                    <td className="p-3">{student.class_name}</td>
                    <td className="p-3 text-slate-500">{student.email}</td>
                    <td className="p-3 text-right font-black text-emerald-600">
                      {student.attendance || '88.5%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 5. ASSIGNMENTS VIEW */}
      {activeNav === 'assignments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <AssignmentReview user={user} />
        </div>
      )}

      {/* 6. EXAMINATIONS & MARKS VIEW */}
      {activeNav === 'exams' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Continuous Assessment (CA) & Exam Papers</h2>
              <p className="text-xs text-slate-500 font-medium">Evaluation portal for CA-1, Mid-Sem, and CA-2 answer sheets</p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setMaskIdentity(!maskIdentity)}
              className="rounded-xl text-xs font-bold"
            >
              {maskIdentity ? '🔓 Reveal Student Names' : '🔒 Mask Identity (Blind Grading)'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['CA-1', 'CA-2', 'Mid Semester'].map((type) => {
              const typeExams = exams.filter(e => e.exam_type === type);
              return (
                <Card key={type} className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">{type}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">Exam</span>
                  </div>
                  <div className="space-y-2">
                    {typeExams.map((exam) => (
                      <div key={exam.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                        <div className="font-bold text-slate-800 dark:text-slate-200">Discrete Mathematics</div>
                        <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                          <span>Max Marks: {exam.total_marks}</span>
                          <span className="font-semibold text-blue-600">{exam.status || 'Active'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Answer Sheets valuation list */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Student Answer Sheets Queue</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-black text-slate-400">
                  <tr>
                    <th className="p-3 rounded-l-xl">Student Name</th>
                    <th className="p-3">Course / Exam</th>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Grading Status</th>
                    <th className="p-3 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {maskIdentity ? `Blind Candidate #${100 + idx}` : student.name}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">Discrete Mathematics (CA-1)</td>
                      <td className="p-3 font-mono text-slate-500">{maskIdentity ? '***' : student.roll_number}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Review
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl h-7 px-3"
                          onClick={() => toast.success(`Answer paper loaded for ${maskIdentity ? 'Blind Candidate #' + (100 + idx) : student.name}`)}
                        >
                          Check Paper
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 7. ANSWER SHEET EVALUATION VIEW */}
      {activeNav === 'evaluation' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Answer Sheet Evaluation Queue</h3>
              <p className="text-xs text-slate-500">Grading rubric & blinded marking pipeline for Continuous Assessment</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMaskIdentity(!maskIdentity)}
                className="rounded-xl text-xs font-bold"
              >
                {maskIdentity ? '🔓 Reveal Names' : '🔒 Mask Identity'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-2xl font-black text-blue-700">68</div>
              <div className="text-[10px] font-bold uppercase text-blue-600">Total Scripts Logged</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="text-2xl font-black text-emerald-700">64</div>
              <div className="text-[10px] font-bold uppercase text-emerald-600">Graded & Validated</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="text-2xl font-black text-amber-700">4</div>
              <div className="text-[10px] font-bold uppercase text-amber-600">Pending Evaluation</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase text-slate-400">Papers Awaiting Evaluation</h4>
            {students.slice(0, 4).map((student, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {maskIdentity ? `Blind Candidate #${100 + idx}` : student.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Discrete Mathematics • CA-1 Answer Paper (Paper ID: #DM-2026-{idx + 1})
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    placeholder="Marks / 20" 
                    className="w-28 text-xs rounded-xl h-8"
                  />
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-8"
                    onClick={() => toast.success(`Marks recorded for candidate #${100 + idx}`)}
                  >
                    Save Score
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 8. LECTURE SWAP VIEW */}
      {activeNav === 'swap' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Faculty Lecture Swap & Adjustments</h3>
              <p className="text-xs text-slate-500">Request class coverage or swap slots with departmental colleagues</p>
            </div>
            <Button 
              onClick={() => setLectureSwapModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" /> Request Lecture Swap
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-black text-slate-400">
                <tr>
                  <th className="p-3 rounded-l-xl">From Teacher</th>
                  <th className="p-3">To Colleague</th>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Course / Subject</th>
                  <th className="p-3 rounded-r-xl text-right">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {swapRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{req.from}</td>
                    <td className="p-3 font-bold text-blue-600">{req.to}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{req.date} • {req.slot}</td>
                    <td className="p-3">{req.subject}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 9. FACULTY DIRECTORY VIEW */}
      {activeNav === 'faculty' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">CSE Department Faculty Directory</h3>
            <p className="text-xs text-slate-500">Contact information and designations of departmental colleagues</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_FACULTY.map((faculty, idx) => (
              <Card key={idx} className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black flex items-center justify-center text-sm">
                    {faculty.name.split(' ')[1]?.[0] || 'P'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{faculty.name}</h4>
                    <p className="text-[11px] text-slate-500">{faculty.role}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <p className="truncate">Email: {faculty.email}</p>
                  <p>Contact: {faculty.phone}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 10. DEPARTMENT CHAT VIEW */}
      {activeNav === 'chat' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 flex flex-col h-[520px] animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Department Faculty Chat & Announcements</h3>
            <p className="text-xs text-slate-500">Live communication channel for Computer Science & Engineering staff</p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 py-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`p-3.5 rounded-2xl max-w-[80%] text-xs ${
                msg.isHOD ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}>
                <div className="flex justify-between gap-4 font-bold pb-1">
                  <span>{msg.sender}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{msg.time}</span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Input
              placeholder="Post an announcement or reply..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="rounded-xl text-xs h-10"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-5 text-xs font-bold">
              <Send className="w-3.5 h-3.5 mr-1.5" /> Send
            </Button>
          </form>
        </Card>
      )}

      {/* 11. STUDENT DIRECTORY VIEW */}
      {activeNav === 'students' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">SY-CSE Class Student Directory</h3>
              <p className="text-xs text-slate-500">Class In-Charge: {teacherName} • Academic Session 2026-27</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
              Total Students: {students.length}
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-black text-slate-400">
                <tr>
                  <th className="p-3 rounded-l-xl">Student Name</th>
                  <th className="p-3">PRN / Roll Number</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3 rounded-r-xl text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {student.name[0]}
                      </div>
                      <span>{student.name}</span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-600 dark:text-slate-300">{student.roll_number}</td>
                    <td className="p-3">{student.class_name}</td>
                    <td className="p-3 text-slate-500">{student.email}</td>
                    <td className="p-3 text-right font-black text-emerald-600">
                      {student.attendance || '88.5%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 12. ACADEMIC REPORTS VIEW */}
      {activeNav === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Marksheet Excel Export</h3>
            <p className="text-xs text-slate-500">Download formatted University DBATU Continuous Assessment sheets</p>
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-semibold">Select Target Examination</Label>
              <Select defaultValue="ex1">
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ex1">Discrete Mathematics - CA-1</SelectItem>
                  <SelectItem value="ex2">Data Structures - Mid Semester</SelectItem>
                  <SelectItem value="ex3">OOP - Lab Continuous Evaluation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => toast.success('Marksheet exported successfully to Excel!')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-2" /> Download Marksheet Excel
            </Button>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">SY-CSE Performance Analytics</h3>
            <p className="text-xs text-slate-500">Class passing percentage and course metrics</p>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Discrete Mathematics Pass Rate</span>
                <strong className="text-emerald-600">94.2%</strong>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-semibold pt-2">
                <span>Data Structures Pass Rate</span>
                <strong className="text-blue-600">89.6%</strong>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89.6%' }}></div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 13. SETTINGS VIEW */}
      {activeNav === 'settings' && (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 max-w-2xl space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Faculty Portal Settings</h3>
            <p className="text-xs text-slate-500">Profile preferences, notification rules, and default assessment templates</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <Label className="text-xs font-bold">Faculty Name</Label>
              <Input defaultValue={teacherName} readOnly className="mt-1 rounded-xl bg-slate-50" />
            </div>
            <div>
              <Label className="text-xs font-bold">Designation & Role</Label>
              <Input defaultValue={teacherRole} readOnly className="mt-1 rounded-xl bg-slate-50" />
            </div>
            <div>
              <Label className="text-xs font-bold">Official Email</Label>
              <Input defaultValue={user?.email || 'bpg@ssiems.org.in'} readOnly className="mt-1 rounded-xl bg-slate-50" />
            </div>
            <div>
              <Label className="text-xs font-bold">Class Teacher Assignment</Label>
              <Input defaultValue="SY-CSE (Batch 2024-2028)" readOnly className="mt-1 rounded-xl bg-slate-50" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => toast.success('Profile settings updated successfully')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              Save Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* 14. FACULTY LEAVE & CL MANAGEMENT VIEW */}
      {activeNav === 'leaves' && (
        <FacultyLeaveManagement user={user} colleagues={MOCK_FACULTY} />
      )}

      {/* MODALS */}

      {/* A. ADD TASK MODAL */}
      <Dialog open={addTaskModalOpen} onOpenChange={setAddTaskModalOpen}>
        <DialogContent className="rounded-3xl max-w-md bg-white dark:bg-slate-900 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 dark:text-white">Schedule Academic Task</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Add an activity or grading reminder to your daily checklist</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTask} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-bold">Task Title / Description</Label>
              <Input
                placeholder="e.g. Verify CA-1 marks entry for Discrete Mathematics"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                required
                className="mt-1 rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-bold">Category</Label>
              <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic Lecture</SelectItem>
                  <SelectItem value="Exam">Examination & Grading</SelectItem>
                  <SelectItem value="Assignment">Assignment Evaluation</SelectItem>
                  <SelectItem value="Departmental">Department Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">Priority</Label>
              <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAddTaskModalOpen(false)} className="rounded-xl text-xs font-semibold">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold">
                Save Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* B. QUICK ATTENDANCE MODAL */}
      <Dialog open={quickAttendanceOpen} onOpenChange={setQuickAttendanceOpen}>
        <DialogContent className="rounded-3xl max-w-xl bg-white dark:bg-slate-900 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Mark Attendance — {attendanceClass} ({selectedDate})
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Click student badges to toggle Present / Absent / Late</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2 max-h-80 overflow-y-auto pr-1">
            {studentAttendanceList.map((stu) => (
              <div key={stu.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{stu.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{stu.roll_number}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleStudentStatus(stu.id, 'present')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      stu.status === 'present' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStudentStatus(stu.id, 'absent')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      stu.status === 'absent' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStudentStatus(stu.id, 'late')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      stu.status === 'late' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Late
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setQuickAttendanceOpen(false)} className="rounded-xl text-xs font-semibold">
              Cancel
            </Button>
            <Button onClick={saveAttendance} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold">
              Save Attendance Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* C. LECTURE SWAP MODAL */}
      <Dialog open={lectureSwapModalOpen} onOpenChange={setLectureSwapModalOpen}>
        <DialogContent className="rounded-3xl max-w-md bg-white dark:bg-slate-900 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              Propose Lecture Swap
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Exchange a lecture slot with a departmental colleague</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSwap} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-bold">Swap With Colleague</Label>
              <Select value={newSwap.colleague} onValueChange={(val) => setNewSwap({ ...newSwap, colleague: val })}>
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_FACULTY.filter(f => f.name !== teacherName).map((f, i) => (
                    <SelectItem key={i} value={f.name}>{f.name} ({f.dept})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">Lecture Date</Label>
              <Input
                type="date"
                value={newSwap.date}
                onChange={(e) => setNewSwap({ ...newSwap, date: e.target.value })}
                required
                className="mt-1 rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-bold">Time Slot</Label>
              <Select value={newSwap.slot} onValueChange={(val) => setNewSwap({ ...newSwap, slot: val })}>
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10:00 - 11:00 AM">10:00 - 11:00 AM</SelectItem>
                  <SelectItem value="11:00 - 12:00 PM">11:00 - 12:00 PM</SelectItem>
                  <SelectItem value="01:00 - 02:00 PM">01:00 - 02:00 PM</SelectItem>
                  <SelectItem value="02:00 - 03:00 PM">02:00 - 03:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setLectureSwapModalOpen(false)} className="rounded-xl text-xs font-semibold">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold">
                Submit Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
