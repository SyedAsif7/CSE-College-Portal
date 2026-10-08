import React, { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { 
  Bell, Plus, Trash2, Search, Filter, Calendar, 
  AlertCircle, ShieldCheck, Printer, Sparkles, School, 
  Send, Users, BookOpen, Clock, Tag
} from 'lucide-react';

const CATEGORY_COLORS = {
  'Academic': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200',
  'Examination': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200',
  'Administrative': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
  'Events': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
  'Holiday': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
};

const NoticeBoard = ({ user, role = 'student' }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State for Admin/HOD
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Academic',
    target: 'All Students & Faculty',
    content: '',
    urgent: false
  });

  const isAdmin = role === 'admin' || user?.role === 'admin';

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notices');
      if (res.data && res.data.length > 0) {
        setNotices(res.data);
        return;
      }
      throw new Error('No notices');
    } catch (e) {
      // Baseline fallbacks
      setNotices([
        {
          id: 'not-1',
          title: 'Continuous Assessment (CA-1) Schedule Notification',
          content: 'CA-1 Examination for SY, TY, and BE CSE is officially scheduled from October 15th, 2026. Hall tickets can be downloaded from the portal.',
          author: 'Prof. Pawar V.K. (HOD)',
          target: 'All Students & Faculty',
          category: 'Examination',
          priority: 'High',
          urgent: true,
          date: '2026-10-02'
        },
        {
          id: 'not-2',
          title: 'Department Faculty Meeting for NAAC Cycle Review',
          content: 'All faculty members are requested to attend the departmental review meeting in Seminar Hall at 3:30 PM regarding course files and lab evaluations.',
          author: 'Prof. Pawar V.K. (HOD)',
          target: 'Faculty Members',
          category: 'Administrative',
          priority: 'Medium',
          urgent: false,
          date: '2026-10-03'
        },
        {
          id: 'not-3',
          title: 'Smart India Hackathon 2026 Internal Screening',
          content: 'Interested teams must register their team ideas with faculty coordinator by October 10th. Open to SY, TY, and Final Year students.',
          author: 'Student Activity Cell',
          target: 'All Students',
          category: 'Events',
          priority: 'Normal',
          urgent: false,
          date: '2026-09-28'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      toast.error('Please enter title and notice body');
      return;
    }

    setSubmitting(true);
    const authorName = user?.name ? `${user.name} (HOD)` : 'Prof. Pawar V.K. (HOD)';

    const payload = {
      title: newNotice.title,
      category: newNotice.category,
      target: newNotice.target,
      content: newNotice.content,
      urgent: newNotice.urgent,
      priority: newNotice.urgent ? 'High' : 'Normal',
      author: authorName,
    };

    try {
      const res = await api.post('/notices', payload);
      setNotices([res.data, ...notices]);
      toast.success('Official circular broadcasted and synchronized with all users!');
      setModalOpen(false);
      setNewNotice({
        title: '',
        category: 'Academic',
        target: 'All Students & Faculty',
        content: '',
        urgent: false
      });
    } catch (err) {
      const local = {
        id: `not-${Date.now()}`,
        ...payload,
        date: new Date().toISOString().slice(0, 10)
      };
      setNotices([local, ...notices]);
      toast.success('Notice broadcasted locally');
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this official circular?')) return;
    try {
      await api.delete(`/notices/${id}`);
      setNotices(notices.filter(n => n.id !== id));
      toast.success('Circular removed successfully');
    } catch (err) {
      setNotices(notices.filter(n => n.id !== id));
      toast.success('Circular removed (local)');
    }
  };

  const handlePrintNotice = (notice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print circular');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${notice.title}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 24px; }
            .trust { font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 0.5px; }
            .college { font-size: 17px; font-weight: 900; color: #1e3a8a; margin: 3px 0; }
            .sub { font-size: 11px; color: #64748b; }
            .circular-banner { margin-top: 15px; font-size: 14px; font-weight: 800; background: #eff6ff; color: #1e3a8a; padding: 8px; border: 1px solid #bfdbfe; border-radius: 4px; text-transform: uppercase; text-align: center; }
            .meta { display: flex; justify-content: space-between; margin: 20px 0; font-size: 12px; font-weight: 600; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px; }
            .subject { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
            .content { font-size: 13px; color: #334155; white-space: pre-wrap; line-height: 1.8; text-align: justify; }
            .footer { margin-top: 60px; display: flex; justify-content: flex-end; }
            .signature-box { text-align: center; width: 220px; border-top: 1px solid #64748b; padding-top: 6px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="trust">SHRI SHIVAJI SAMAJIK VIKAS SANSTHA'S</div>
            <div class="college">SHRI SHIVAJI INSTITUTE OF ENGINEERING & MANAGEMENT STUDIES, PARBHANI</div>
            <div class="sub">Department of Computer Science & Engineering • Approved by AICTE, Affiliated to Dr. BATU, Lonere</div>
            <div class="circular-banner">OFFICIAL DEPARTMENTAL CIRCULAR / NOTIFICATION</div>
          </div>
          <div class="meta">
            <div>Ref No: SSIEMS/CSE/CIR/${new Date().getFullYear()}/042</div>
            <div>Date of Issue: ${notice.date || new Date().toISOString().slice(0, 10)}</div>
          </div>
          <div class="meta" style="margin-top: -10px;">
            <div>Target Audience: <strong>${notice.target}</strong></div>
            <div>Category: <strong>${notice.category || 'Academic'}</strong></div>
          </div>
          <div class="subject">SUBJECT: ${notice.title}</div>
          <div class="content">${notice.content}</div>
          <div class="footer">
            <div class="signature-box">
              <div>${notice.author || 'Prof. Pawar V.K.'}</div>
              <div style="font-size: 10px; font-weight: normal; color: #64748b;">Head of Department (CSE)</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const filteredNotices = notices.filter(n => {
    // Category filter
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) {
      if (selectedCategory === 'URGENT' && !n.urgent) return false;
      if (selectedCategory !== 'URGENT') return false;
    }
    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (n.title || '').toLowerCase().includes(q);
      const matchContent = (n.content || '').toLowerCase().includes(q);
      const matchAuthor = (n.author || '').toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor) return false;
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
              Notice Board & Official Circulars
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {notices.length} Published
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Department of Computer Science & Engineering • Official notifications issued by HOD & Academic Cell
          </p>
        </div>

        {isAdmin && (
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Issue New Circular
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-base font-black text-slate-900 dark:text-white">
                  Issue Official Department Circular
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Broadcast an authenticated announcement under HOD authority.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateNotice} className="space-y-4 mt-2">
                <div>
                  <Label className="text-xs font-bold">Circular Subject / Title</Label>
                  <Input
                    placeholder="e.g. Schedule for Continuous Assessment (CA-1)"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="mt-1 text-xs rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold">Category</Label>
                    <Select
                      value={newNotice.category}
                      onValueChange={(val) => setNewNotice({ ...newNotice, category: val })}
                    >
                      <SelectTrigger className="mt-1 text-xs rounded-xl">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Examination">Examination</SelectItem>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Holiday">Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold">Target Audience</Label>
                    <Select
                      value={newNotice.target}
                      onValueChange={(val) => setNewNotice({ ...newNotice, target: val })}
                    >
                      <SelectTrigger className="mt-1 text-xs rounded-xl">
                        <SelectValue placeholder="Target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Students & Faculty">All Students & Faculty</SelectItem>
                        <SelectItem value="Faculty Members">Faculty Members Only</SelectItem>
                        <SelectItem value="All Students">All Students</SelectItem>
                        <SelectItem value="SY-CSE Students">SY-CSE Students</SelectItem>
                        <SelectItem value="TY-CSE Students">TY-CSE Students</SelectItem>
                        <SelectItem value="BE-CSE Students">BE-CSE Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold">Message Content</Label>
                  <Textarea
                    placeholder="Provide full announcement details..."
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
                    id="urgent-box"
                    checked={newNotice.urgent}
                    onChange={(e) => setNewNotice({ ...newNotice, urgent: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="urgent-box" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    Flag as High Priority / Urgent Alert
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                    className="text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl font-bold"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Broadcast Circular
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'URGENT', 'Academic', 'Examination', 'Administrative', 'Events'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Circulars' : cat === 'URGENT' ? '🚨 Urgent Only' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Search circulars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* 3. Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">No circulars matching your criteria</p>
          </div>
        ) : (
          filteredNotices.map((n) => {
            const catColor = CATEGORY_COLORS[n.category] || CATEGORY_COLORS['Academic'];

            return (
              <Card
                key={n.id}
                className={`rounded-2xl border transition-all ${
                  n.urgent
                    ? 'border-rose-300 bg-rose-50/20 dark:border-rose-900/50 dark:bg-rose-950/10 shadow-sm shadow-rose-500/5'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                }`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {n.urgent && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 animate-pulse">
                          🚨 Urgent Notice
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${catColor}`}>
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {n.category || 'Academic'}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {n.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{n.date}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {n.content}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span>Authority: <strong>{n.author}</strong></span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Target: {n.target}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handlePrintNotice(n)}
                        variant="ghost"
                        size="sm"
                        className="text-xs rounded-xl text-slate-600 hover:text-slate-900"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        Print Notice
                      </Button>

                      {isAdmin && (
                        <Button
                          onClick={() => handleDeleteNotice(n.id)}
                          variant="ghost"
                          size="sm"
                          className="text-xs rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
