import React, { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Search,
  Download,
  Filter,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Calendar,
  Sparkles,
  School
} from 'lucide-react';

const FacultyLeavesApproval = ({ onUpdate }) => {
  const [leaves, setLeaves] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all' | 'balances'
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Approval / Rejection dialog state
  const [actionDialog, setActionDialog] = useState({
    open: false,
    leave: null,
    type: 'approve', // 'approve' | 'reject'
    remarks: '',
  });

  const [summary, setSummary] = useState({
    total: 3,
    pending: 1,
    approved: 2,
    rejected: 0,
    on_leave_today: 0,
  });

  useEffect(() => {
    fetchLeaves();
    fetchSummary();
    fetchTeachers();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves');
      if (res.data) {
        setLeaves(res.data);
      }
    } catch (err) {
      console.warn('Leaves API failed, using fallback data');
      const defaults = [
        {
          id: 'lev-1',
          teacher_id: 't2',
          teacher_name: 'Prof. Bais P. G.',
          teacher_email: 'bais@ssiems.org.in',
          leave_type: 'CL',
          leave_title: 'Casual Leave (CL)',
          duration_type: 'Full Day',
          start_date: new Date().toISOString().slice(0, 10),
          end_date: new Date().toISOString().slice(0, 10),
          total_days: 1.0,
          reason: 'Personal urgent family function at native place',
          lecture_adjustment: 'Prof. Devkar R. S. to engage Discrete Mathematics lecture at 10:00 AM',
          contact_number: '+91 98220 12345',
          status: 'pending',
          hod_remarks: '',
          created_at: new Date().toISOString(),
        },
        {
          id: 'lev-2',
          teacher_id: 't3',
          teacher_name: 'Prof. Magar A. R.',
          teacher_email: 'magar@ssiems.org.in',
          leave_type: 'OD',
          leave_title: 'On-Duty Leave (OD)',
          duration_type: 'Full Day',
          start_date: '2026-10-02',
          end_date: '2026-10-03',
          total_days: 2.0,
          reason: 'DBATU University Central Assessment Valuation Duty at Sub-Center',
          lecture_adjustment: 'Prof. Pawar V.K. conducted combined Data Structures lab session',
          contact_number: '+91 94231 67890',
          status: 'approved',
          hod_remarks: 'Sanctioned on production of DBATU appointment letter',
          reviewed_by: 'Prof. Pawar V.K. (HOD)',
          reviewed_at: new Date().toISOString(),
          created_at: '2026-10-01T10:00:00Z',
        },
      ];
      setLeaves(defaults);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get('/leaves/summary');
      if (res.data) setSummary(res.data);
    } catch (e) {
      // Local fallback
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/teachers');
      if (res.data) setTeachers(res.data);
    } catch (e) {
      // Fallback list
      setTeachers([
        { id: 't1', name: 'Prof. Pawar V.K.', email: 'pawar@ssiems.org.in', role: 'HOD' },
        { id: 't2', name: 'Prof. Bais P. G.', email: 'bais@ssiems.org.in', role: 'Asst Professor' },
        { id: 't3', name: 'Prof. Magar A. R.', email: 'magar@ssiems.org.in', role: 'Asst Professor' },
        { id: 't4', name: 'Prof. Devkar R. S.', email: 'devkar@ssiems.org.in', role: 'Asst Professor' },
        { id: 't5', name: 'Prof. Lokhande S. M.', email: 'lokhande@ssiems.org.in', role: 'Asst Professor' },
        { id: 't6', name: 'Prof. Rathod K. D.', email: 'rathod@ssiems.org.in', role: 'Asst Professor' },
      ]);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    const { leave, type, remarks } = actionDialog;
    if (!leave) return;

    try {
      const payload = {
        status: type === 'approve' ? 'approved' : 'rejected',
        hod_remarks: remarks || (type === 'approve' ? 'Sanctioned by HOD Office under DBATU regulations' : 'Application could not be sanctioned due to critical academic schedule'),
        reviewed_by: 'Prof. Pawar V.K. (HOD)',
      };

      await api.put(`/leaves/${leave.id}/status`, payload);
      toast.success(
        type === 'approve'
          ? `Leave for ${leave.teacher_name} sanctioned successfully!`
          : `Leave application for ${leave.teacher_name} rejected.`
      );

      // Local update
      setLeaves(leaves.map(l => l.id === leave.id ? { ...l, status: payload.status, hod_remarks: payload.hod_remarks } : l));
      setActionDialog({ open: false, leave: null, type: 'approve', remarks: '' });
      fetchSummary();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to update leave status');
    }
  };

  // Export CSV
  const exportLeavesCSV = () => {
    if (!leaves.length) {
      toast.warning('No leave records to export');
      return;
    }

    const headers = ['Teacher Name', 'Email', 'Leave Category', 'Start Date', 'End Date', 'Days', 'Reason', 'Adjustment', 'Status', 'HOD Remarks'];
    const rows = leaves.map(l => [
      `"${l.teacher_name || ''}"`,
      l.teacher_email || '',
      `"${l.leave_title || l.leave_type || ''}"`,
      l.start_date || '',
      l.end_date || '',
      l.total_days || 1,
      `"${(l.reason || '').replace(/"/g, '""')}"`,
      `"${(l.lecture_adjustment || '').replace(/"/g, '""')}"`,
      l.status || '',
      `"${(l.hod_remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSIEMS_CSE_Faculty_Leave_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Department Faculty Leave Register exported to CSV');
  };

  // Filtered lists
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const filteredAllLeaves = leaves.filter(l => {
    if (typeFilter !== 'all' && l.leave_type !== typeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = (l.teacher_name || '').toLowerCase().includes(q);
      const matchEmail = (l.teacher_email || '').toLowerCase().includes(q);
      const matchReason = (l.reason || '').toLowerCase().includes(q);
      const matchType = (l.leave_title || l.leave_type || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchReason && !matchType) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Faculty Leave & Casual Leave (CL) Approval Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              HOD Authority
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Department of Computer Science & Engineering • Sanctioning authority Prof. Pawar V.K.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportLeavesCSV}
            variant="outline"
            size="sm"
            className="text-xs rounded-xl border-slate-200 dark:border-slate-700 font-bold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Leave Register
          </Button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Card (Urgent) */}
        <div 
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-400 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black ${activeTab === 'pending' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${activeTab === 'pending' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'}`}>
              Action Required
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black block tracking-tight">{pendingLeaves.length}</span>
            <span className={`text-xs font-bold ${activeTab === 'pending' ? 'text-slate-900 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
              Pending Authorization
            </span>
          </div>
        </div>

        {/* Total Applications Card */}
        <div 
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black ${activeTab === 'all' ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'}`}>
              Full Year
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black block tracking-tight">{leaves.length}</span>
            <span className={`text-xs font-bold ${activeTab === 'all' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
              Total Leave Register
            </span>
          </div>
        </div>

        {/* Sanctioned Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              Sanctioned
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
              {leaves.filter(l => l.status === 'approved').length}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Approved Applications
            </span>
          </div>
        </div>

        {/* On Leave Today Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
              Today
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
              {summary.on_leave_today}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Faculty on Leave Today
            </span>
          </div>
        </div>

      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'pending'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>Pending Approvals</span>
          <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
            activeTab === 'pending' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
          }`}>
            {pendingLeaves.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>Department Leave Register</span>
          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {leaves.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('balances')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'balances'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>Faculty Quota Tracker (CL Balances)</span>
        </button>
      </div>

      {/* 4. TAB CONTENT */}

      {/* VIEW A: PENDING APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingLeaves.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-900 dark:text-white">All Clear! No Pending Leave Requests</h4>
              <p className="text-xs text-slate-400 mt-1">All faculty leave applications have been reviewed and sanctioned.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center text-sm shadow-sm">
                        {leave.leave_type}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {leave.teacher_name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                            {leave.leave_title || leave.leave_type}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold">
                          {leave.teacher_email} • Department of CSE
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        {leave.start_date} {leave.start_date !== leave.end_date && `to ${leave.end_date}`}
                      </div>
                      <span className="text-[11px] text-amber-600 font-bold block">
                        Duration: {leave.total_days} Day(s) ({leave.duration_type})
                      </span>
                    </div>
                  </div>

                  {/* Purpose & Adjustment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reason for Leave</span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">{leave.reason}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Class & Lab Adjustment</span>
                        <span className="text-[10px] font-black text-emerald-600 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Arranged
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        {leave.lecture_adjustment || 'No adjustment required'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-400">
                      Emergency Contact: <strong className="text-slate-700 dark:text-slate-300">{leave.contact_number || 'N/A'}</strong>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActionDialog({ open: true, leave, type: 'reject', remarks: '' })}
                        className="rounded-xl text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => setActionDialog({ open: true, leave, type: 'approve', remarks: 'Sanctioned under CL quota by HOD' })}
                        className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Sanction & Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW B: FULL LEAVE REGISTER */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by faculty, purpose, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-500">Type:</span>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] text-xs h-8 rounded-xl">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="CL">Casual Leave (CL)</SelectItem>
                  <SelectItem value="OD">On-Duty (OD)</SelectItem>
                  <SelectItem value="ML">Medical Leave (ML)</SelectItem>
                  <SelectItem value="C-OFF">Compensatory Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-5">Faculty Member</th>
                    <th className="py-3 px-4">Leave Category</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Days</th>
                    <th className="py-3 px-4">Class Adjustment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAllLeaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-5">
                        <strong className="text-slate-900 dark:text-white block">{l.teacher_name}</strong>
                        <span className="text-[11px] text-slate-400">{l.teacher_email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {l.leave_title || l.leave_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {l.start_date} {l.start_date !== l.end_date && `to ${l.end_date}`}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {l.total_days} Day(s)
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 max-w-xs truncate">
                        {l.lecture_adjustment || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          l.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          l.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-[11px] text-slate-500 italic max-w-xs truncate">
                        {l.hod_remarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: FACULTY QUOTA & CL BALANCE TRACKER */}
      {activeTab === 'balances' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Annual Quota Allocation (DBATU Norms)</h3>
              <p className="text-xs text-slate-400">Annual CL: 12 Days • OD: 10 Days • Medical Leave: 10 Days</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-xl">
              12 Faculty Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-5">Faculty Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4 text-center">CL Availed</th>
                  <th className="py-3 px-4 text-center">CL Balance (12)</th>
                  <th className="py-3 px-4 text-center">OD Availed (10)</th>
                  <th className="py-3 px-4 text-center">ML Availed (10)</th>
                  <th className="py-3 px-5 text-right">Quota Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {teachers.map((t, idx) => {
                  const teacherLeaves = leaves.filter(l => (l.teacher_email === t.email || l.teacher_id === t.id) && l.status === 'approved');
                  const clUsed = teacherLeaves.filter(l => l.leave_type === 'CL').reduce((acc, curr) => acc + (curr.total_days || 1), 0);
                  const odUsed = teacherLeaves.filter(l => l.leave_type === 'OD').reduce((acc, curr) => acc + (curr.total_days || 1), 0);
                  const mlUsed = teacherLeaves.filter(l => l.leave_type === 'ML').reduce((acc, curr) => acc + (curr.total_days || 1), 0);
                  const clBal = Math.max(12 - clUsed, 0);

                  return (
                    <tr key={t.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                        {t.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">
                        {t.role || 'Assistant Professor'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-amber-600">
                        {clUsed} Days
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
                          {clBal} / 12
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {odUsed} Days
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {mlUsed} Days
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Active Entitlement
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. APPROVAL / REJECTION ACTION DIALOG */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, leave: null, type: 'approve', remarks: '' })}>
        <DialogContent className="rounded-3xl max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              {actionDialog.type === 'approve' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Sanction Leave Application
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Reject Leave Application
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {actionDialog.type === 'approve'
                ? `Officially endorse and sanction leave for ${actionDialog.leave?.teacher_name}.`
                : `Specify administrative rationale for declining leave request.`}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.leave && (
            <form onSubmit={handleStatusSubmit} className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Applicant:</span>
                  <strong className="text-slate-900 dark:text-white">{actionDialog.leave.teacher_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Period:</span>
                  <span className="font-mono">{actionDialog.leave.start_date} ({actionDialog.leave.total_days} Day)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Class Adjustment:</span>
                  <strong className="text-indigo-600">{actionDialog.leave.lecture_adjustment}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700 dark:text-slate-300">
                  HOD Endorsement / Reason:
                </Label>
                <Textarea
                  value={actionDialog.remarks}
                  onChange={(e) => setActionDialog({ ...actionDialog, remarks: e.target.value })}
                  placeholder={actionDialog.type === 'approve' ? 'e.g., Sanctioned under Casual Leave quota.' : 'e.g., Critical university audit / accreditation visit on scheduled day.'}
                  rows={3}
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActionDialog({ open: false, leave: null, type: 'approve', remarks: '' })}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={`rounded-xl text-xs font-bold text-white ${
                    actionDialog.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionDialog.type === 'approve' ? 'Confirm Sanction' : 'Confirm Rejection'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default FacultyLeavesApproval;
