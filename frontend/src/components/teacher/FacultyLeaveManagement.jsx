import React, { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  Trash2,
  Download,
  Info,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const FacultyLeaveManagement = ({ user, colleagues = [] }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Leave Quotas & Balances
  const [balance, setBalance] = useState({
    cl: { total: 12, used: 1.0, balance: 11.0 },
    od: { total: 10, used: 0.0, balance: 10.0 },
    ml: { total: 10, used: 0.0, balance: 10.0 },
    coff: { total: 3, used: 0.0, balance: 3.0 },
  });

  const teacherId = user?.id || 't2';
  const teacherName = user?.name || 'Prof. Bais P. G.';
  const teacherEmail = user?.email || 'bais@ssiems.org.in';

  // Form State
  const [formData, setFormData] = useState({
    leave_type: 'CL',
    leave_title: 'Casual Leave (CL)',
    duration_type: 'Full Day',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
    total_days: 1.0,
    reason: '',
    lecture_adjustment: '',
    contact_number: '+91 98220 12345',
  });

  const facultyOptions = colleagues.length > 0 ? colleagues : [
    { name: 'Prof. Pawar V.K. (HOD)', email: 'pawar@ssiems.org.in' },
    { name: 'Prof. Devkar R. S.', email: 'devkar@ssiems.org.in' },
    { name: 'Prof. Magar A. R.', email: 'magar@ssiems.org.in' },
    { name: 'Prof. Lokhande S. M.', email: 'lokhande@ssiems.org.in' },
    { name: 'Prof. Rathod K. D.', email: 'rathod@ssiems.org.in' },
  ];

  useEffect(() => {
    fetchMyLeaves();
    fetchLeaveBalance();
  }, [teacherId, teacherEmail]);

  const fetchMyLeaves = async () => {
    try {
      const res = await api.get(`/leaves?teacher_id=${encodeURIComponent(teacherEmail)}`);
      if (res.data) {
        setLeaves(res.data);
      }
    } catch (err) {
      console.warn('Leaves offline or empty, fetching all records fallback');
      try {
        const fallbackRes = await api.get('/leaves');
        if (fallbackRes.data) {
          const myOnly = fallbackRes.data.filter(l => l.teacher_email === teacherEmail || l.teacher_id === teacherId);
          setLeaves(myOnly.length > 0 ? myOnly : fallbackRes.data);
        }
      } catch (e) {
        // Mock fallback
        setLeaves([
          {
            id: 'lev-1',
            teacher_name: teacherName,
            teacher_email: teacherEmail,
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
            created_at: new Date().toISOString()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const res = await api.get(`/leaves/balance/${encodeURIComponent(teacherEmail)}`);
      if (res.data) {
        setBalance(res.data);
      }
    } catch (err) {
      console.warn('Leave balance API failed, using standard DBATU quotas');
    }
  };

  // Compute total days when dates or duration changes
  const handleDateChange = (start, end, duration) => {
    if (!start || !end) return 1.0;
    if (duration !== 'Full Day') return 0.5;
    
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = d2.getTime() - d1.getTime();
    if (diffTime < 0) return 1.0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(diffDays, 1.0);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      toast.error('Please specify the reason for your leave');
      return;
    }
    if (!formData.lecture_adjustment.trim()) {
      toast.error('Academic policy requires alternative lecture/lab arrangement details');
      return;
    }

    try {
      const payload = {
        teacher_id: teacherId,
        teacher_name: teacherName,
        teacher_email: teacherEmail,
        leave_type: formData.leave_type,
        leave_title: 
          formData.leave_type === 'CL' ? 'Casual Leave (CL)' :
          formData.leave_type === 'OD' ? 'On-Duty Leave (OD)' :
          formData.leave_type === 'ML' ? 'Medical Leave (ML)' :
          formData.leave_type === 'EL' ? 'Earned Leave (EL)' : 'Compensatory Off (C-OFF)',
        duration_type: formData.duration_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_days: Number(formData.total_days),
        reason: formData.reason,
        lecture_adjustment: formData.lecture_adjustment,
        contact_number: formData.contact_number,
      };

      const res = await api.post('/leaves', payload);
      setLeaves([res.data, ...leaves]);
      toast.success('Leave application submitted to HOD Office for sanction!');
      setApplyDialogOpen(false);
      fetchLeaveBalance();
      
      // Reset form
      setFormData({
        leave_type: 'CL',
        leave_title: 'Casual Leave (CL)',
        duration_type: 'Full Day',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        total_days: 1.0,
        reason: '',
        lecture_adjustment: '',
        contact_number: '+91 98220 12345',
      });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit leave application');
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to withdraw this leave request?')) return;
    try {
      await api.delete(`/leaves/${leaveId}`);
      setLeaves(leaves.filter(l => l.id !== leaveId));
      toast.success('Leave application withdrawn successfully');
      fetchLeaveBalance();
    } catch (err) {
      toast.error('Failed to cancel leave request');
    }
  };

  const filteredLeaves = leaves.filter(l => {
    if (statusFilter === 'all') return true;
    return l.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Faculty Leave & CL Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Session 2026–27
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Apply for Casual Leave (CL), On-Duty (OD), and track HOD endorsements • DBATU Academic Regulations
          </p>
        </div>

        <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-600/30">
              <Plus className="w-4 h-4 mr-1.5" />
              Apply for Leave / CL
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Faculty Leave Application Form
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Submit application with lecture adjustment for official sanction by Head of Department.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleApply} className="space-y-4 pt-2 text-xs">
              
              {/* Applicant Name & Email (Readonly) */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant Faculty</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{teacherName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                  <span className="text-blue-600 font-bold">Computer Science & Engg</span>
                </div>
              </div>

              {/* Leave Type & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">Leave Category</Label>
                  <Select
                    value={formData.leave_type}
                    onValueChange={(val) => setFormData({ ...formData, leave_type: val })}
                  >
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="CL">Casual Leave (CL) — {balance.cl.balance} Left</SelectItem>
                      <SelectItem value="OD">On-Duty / Duty Leave (OD) — {balance.od.balance} Left</SelectItem>
                      <SelectItem value="ML">Medical Leave (ML) — {balance.ml.balance} Left</SelectItem>
                      <SelectItem value="C-OFF">Compensatory Off (C-Off)</SelectItem>
                      <SelectItem value="EL">Earned Leave (EL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">Duration Type</Label>
                  <Select
                    value={formData.duration_type}
                    onValueChange={(val) => {
                      const days = handleDateChange(formData.start_date, formData.end_date, val);
                      setFormData({ ...formData, duration_type: val, total_days: days });
                    }}
                  >
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue placeholder="Full / Half Day" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Full Day">Full Day (1.0 Day)</SelectItem>
                      <SelectItem value="Half Day (Morning)">Half Day — Morning Session (0.5)</SelectItem>
                      <SelectItem value="Half Day (Afternoon)">Half Day — Afternoon Session (0.5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Ranges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const newEnd = formData.end_date < newStart ? newStart : formData.end_date;
                      const days = handleDateChange(newStart, newEnd, formData.duration_type);
                      setFormData({ ...formData, start_date: newStart, end_date: newEnd, total_days: days });
                    }}
                    required
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    min={formData.start_date}
                    onChange={(e) => {
                      const newEnd = e.target.value;
                      const days = handleDateChange(formData.start_date, newEnd, formData.duration_type);
                      setFormData({ ...formData, end_date: newEnd, total_days: days });
                    }}
                    required
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">Total Days</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.total_days}
                    readOnly
                    className="rounded-xl text-xs bg-slate-100 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Reason for Leave */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700 dark:text-slate-300">Reason for Leave / Purpose</Label>
                <Textarea
                  placeholder="e.g., Attending DBATU syllabus revision committee / Personal medical checkup / Family engagement..."
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              {/* Lecture & Lab Alternative Adjustment (DBATU Requirement) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">
                    Alternative Lecture / Lab Arrangement
                  </Label>
                  <span className="text-[10px] text-amber-600 font-bold">*Mandatory</span>
                </div>
                <Input
                  placeholder="e.g., Prof. Devkar R. S. to engage SY-CSE DM lecture at 10:00 AM"
                  value={formData.lecture_adjustment}
                  onChange={(e) => setFormData({ ...formData, lecture_adjustment: e.target.value })}
                  required
                  className="rounded-xl text-xs"
                />
                <p className="text-[10px] text-slate-400">
                  Specify which colleague will engage your scheduled class/lab during absence.
                </p>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700 dark:text-slate-300">Emergency Contact Number</Label>
                <Input
                  type="tel"
                  placeholder="+91 98220 XXXXX"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApplyDialogOpen(false)}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Application to HOD
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. Leave Balance KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Casual Leave (CL) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black">
              CL
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              Casual Leave
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {balance.cl.balance}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">/ {balance.cl.total} Days Left</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {balance.cl.used} Days Used
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min((balance.cl.balance / balance.cl.total) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: On-Duty (OD) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-black">
              OD
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              On-Duty Leave
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {balance.od.balance}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">/ {balance.od.total} Days</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {balance.od.used} Availed
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min((balance.od.balance / balance.od.total) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Medical Leave (ML) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black">
              ML
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              Medical Leave
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {balance.ml.balance}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">/ {balance.ml.total} Days</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {balance.ml.used} Availed
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min((balance.ml.balance / balance.ml.total) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 4: Compensatory Off (C-OFF) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
              CO
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              Compensatory
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {balance.coff.balance}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">/ {balance.coff.total} Days</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {balance.coff.used} Availed
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min((balance.coff.balance / balance.coff.total) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* 3. Filter Bar & Application History */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Filter Status:</span>
          {['all', 'pending', 'approved', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-semibold text-slate-500">
          Showing <strong>{filteredLeaves.length}</strong> applications for {teacherName}
        </div>
      </div>

      {/* 4. Applications Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-xs font-semibold text-slate-500">Loading leave records from database...</p>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No leave applications found</h4>
            <p className="text-xs text-slate-400 mt-1">You can apply for Casual Leave (CL) or On-Duty leave anytime.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-5">Leave Category</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Lecture / Lab Adjustment</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4">HOD Endorsement</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeaves.map((leave) => {
                  const isPending = leave.status === 'pending';
                  const isApproved = leave.status === 'approved';
                  const isRejected = leave.status === 'rejected';

                  const badgeClass = 
                    isApproved ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200' :
                    isRejected ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200' :
                    'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';

                  return (
                    <tr key={leave.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Leave Type */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black flex items-center justify-center text-[10px]">
                            {leave.leave_type}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {leave.leave_title || leave.leave_type}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                              {leave.reason}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-xs">{leave.start_date}</span>
                          {leave.start_date !== leave.end_date && (
                            <>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="font-mono text-xs">{leave.end_date}</span>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
                          {leave.duration_type || 'Full Day'}
                        </span>
                      </td>

                      {/* Total Days */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {leave.total_days} {leave.total_days === 1 ? 'Day' : 'Days'}
                      </td>

                      {/* Lecture Adjustment */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs">
                        {leave.lecture_adjustment ? (
                          <div className="flex items-start space-x-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="truncate">{leave.lecture_adjustment}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None Specified</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeClass}`}>
                          {isApproved && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {isRejected && <XCircle className="w-3 h-3 mr-1" />}
                          {isPending && <Clock className="w-3 h-3 mr-1" />}
                          {isPending ? 'Pending HOD' : isApproved ? 'Sanctioned' : 'Rejected'}
                        </span>
                      </td>

                      {/* HOD Remarks */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] italic">
                        {leave.hod_remarks || (isPending ? 'Awaiting Review' : 'Endorsed under DBATU norms')}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedLeave(leave);
                              setViewDialogOpen(true);
                            }}
                            className="h-8 px-2.5 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[11px] font-bold"
                          >
                            Details
                          </Button>

                          {isPending && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancelLeave(leave.id)}
                              className="h-8 px-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px]"
                              title="Withdraw Leave Request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. View Leave Details Slip Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="rounded-3xl max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Faculty Leave Application Slip
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Department of Computer Science & Engineering • SSIEMS
            </DialogDescription>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Applicant:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedLeave.teacher_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <strong className="text-blue-600">{selectedLeave.leave_title || selectedLeave.leave_type}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Period:</span>
                  <span className="font-mono">{selectedLeave.start_date} to {selectedLeave.end_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Count:</span>
                  <strong>{selectedLeave.total_days} Day(s) ({selectedLeave.duration_type})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-black uppercase text-blue-600">{selectedLeave.status}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason:</span>
                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedLeave.reason}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Alternative Class Arrangement:</span>
                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedLeave.lecture_adjustment || 'No adjustment required'}
                </p>
              </div>

              {selectedLeave.hod_remarks && (
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">HOD Remarks:</span>
                  <p className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {selectedLeave.hod_remarks}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setViewDialogOpen(false)}
                  className="rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                >
                  Close Slip
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default FacultyLeaveManagement;
