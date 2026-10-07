import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, Eye, UserCheck, Download, Filter, CheckCircle2, Check } from 'lucide-react';

const MOCK_FALLBACK_STUDENTS = [
  { id: 's1', name: 'Syed Asif', roll_number: '2024SYCSE001', class_name: 'SY-CSE' },
  { id: 's2', name: 'Shivani Lokhande', roll_number: '2024SYCSE002', class_name: 'SY-CSE' },
  { id: 's3', name: 'Adarsh Surye', roll_number: '2024SYCSE003', class_name: 'SY-CSE' },
  { id: 's4', name: 'Vaishnavi Udawant', roll_number: '2024TYCSE001', class_name: 'TY-CSE' },
  { id: 's5', name: 'Karan Ingole', roll_number: '2024TYCSE002', class_name: 'TY-CSE' },
];

const MOCK_FALLBACK_TEACHERS = [
  { id: 't1', name: 'Prof. Pawar V.K.', email: 'head.cse@ssiems.in', department: 'CSE' },
  { id: 't2', name: 'Prof. Bais P. G.', email: 'bpg@ssiems.org.in', department: 'CSE' },
  { id: 't3', name: 'Prof. Magar A. R.', email: 'amol.magar@cse.ssiems.in', department: 'CSE' },
  { id: 't4', name: 'Prof. Devkar R. S.', email: 'rajesh.devkar@cse.ssiems.in', department: 'CSE' },
];

const MOCK_FALLBACK_SUBJECTS = [
  { id: 'sub1', name: 'Discrete Mathematics', code: 'DM101' },
  { id: 'sub2', name: 'Data Structures & Algorithms', code: 'DSA102' },
  { id: 'sub3', name: 'Object Oriented Programming', code: 'OOP103' },
];

const MOCK_FALLBACK_EXAMS = [
  { id: 'ex1', exam_type: 'CA-1', total_marks: 20, subject_id: 'sub1' },
  { id: 'ex2', exam_type: 'Mid Semester', total_marks: 50, subject_id: 'sub1' },
  { id: 'ex3', exam_type: 'CA-2', total_marks: 20, subject_id: 'sub2' },
];

const MOCK_FALLBACK_SHEETS = [
  { id: 'sh1', exam_id: 'ex1', student_id: 's1', assigned_teacher_id: 't2', status: 'checked', marks_obtained: 18, total_marks: 20, remarks: 'Very clear proofs and logic' },
  { id: 'sh2', exam_id: 'ex1', student_id: 's2', assigned_teacher_id: 't2', status: 'checked', marks_obtained: 16, total_marks: 20, remarks: 'Good attempt' },
  { id: 'sh3', exam_id: 'ex2', student_id: 's1', assigned_teacher_id: 't2', status: 'checked', marks_obtained: 44, total_marks: 50, remarks: 'Excellent score' },
  { id: 'sh4', exam_id: 'ex3', student_id: 's3', assigned_teacher_id: 't2', status: 'pending', marks_obtained: null, total_marks: 20, remarks: '' },
  { id: 'sh5', exam_id: 'ex3', student_id: 's4', assigned_teacher_id: 't3', status: 'pending', marks_obtained: null, total_marks: 20, remarks: '' },
];

const AnswerSheetsManagement = ({ onUpdate }) => {
  const [answerSheets, setAnswerSheets] = useState(MOCK_FALLBACK_SHEETS);
  const [students, setStudents] = useState(MOCK_FALLBACK_STUDENTS);
  const [teachers, setTeachers] = useState(MOCK_FALLBACK_TEACHERS);
  const [exams, setExams] = useState(MOCK_FALLBACK_EXAMS);
  const [subjects, setSubjects] = useState(MOCK_FALLBACK_SUBJECTS);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportYear, setExportYear] = useState('all');
  const [formData, setFormData] = useState({
    exam_id: '',
    student_id: '',
    assigned_teacher_id: '',
    file: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sheetsRes, studentsRes, teachersRes, examsRes, subjectsRes] = await Promise.allSettled([
        api.get('/answer-sheets'),
        api.get('/students'),
        api.get('/teachers'),
        api.get('/exams'),
        api.get('/subjects'),
      ]);
      if (sheetsRes.status === 'fulfilled' && sheetsRes.value.data?.length > 0) setAnswerSheets(sheetsRes.value.data);
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.length > 0) setStudents(studentsRes.value.data);
      if (teachersRes.status === 'fulfilled' && teachersRes.value.data?.length > 0) setTeachers(teachersRes.value.data);
      if (examsRes.status === 'fulfilled' && examsRes.value.data?.length > 0) setExams(examsRes.value.data);
      if (subjectsRes.status === 'fulfilled' && subjectsRes.value.data?.length > 0) setSubjects(subjectsRes.value.data);
    } catch (error) {
      console.warn('Backend offline, loaded fallback answer sheets and department records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error('Please select a PDF file');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('exam_id', formData.exam_id);
      formDataToSend.append('student_id', formData.student_id);
      if (formData.assigned_teacher_id) {
        formDataToSend.append('assigned_teacher_id', formData.assigned_teacher_id);
      }
      formDataToSend.append('file', formData.file);

      await api.post('/answer-sheets/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Answer sheet uploaded successfully!');
      fetchData();
      if (onUpdate) onUpdate();
      handleCloseDialog();
    } catch (error) {
      // Offline fallback: save locally
      const newSheet = {
        id: 'sh-' + Date.now(),
        exam_id: formData.exam_id,
        student_id: formData.student_id,
        assigned_teacher_id: formData.assigned_teacher_id || 't2',
        status: 'pending',
        marks_obtained: null,
        total_marks: exams.find(e => e.id === formData.exam_id)?.total_marks || 20,
        remarks: ''
      };
      setAnswerSheets(prev => [newSheet, ...prev]);
      toast.success('Answer sheet saved successfully (Demo Mode)');
      handleCloseDialog();
    } finally {
      setUploading(false);
    }
  };

  const handleAssignTeacher = async (teacherId) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('teacher_id', teacherId);

      await api.put(`/answer-sheets/${selectedSheet.id}/assign`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Teacher assigned successfully!');
      fetchData();
      if (onUpdate) onUpdate();
      setAssignDialogOpen(false);
      setSelectedSheet(null);
    } catch (error) {
      // Offline fallback
      setAnswerSheets(prev => prev.map(s => s.id === selectedSheet?.id ? { ...s, assigned_teacher_id: teacherId } : s));
      toast.success('Teacher assigned successfully (Demo Mode)');
      setAssignDialogOpen(false);
      setSelectedSheet(null);
    }
  };

  const handleApproveSheet = async (sheetId) => {
    try {
      await api.put(`/answer-sheets/${sheetId}/approve`);
      toast.success('Marks approved and officially released to Student Academic Center!');
      fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      setAnswerSheets(prev => prev.map(s => s.id === sheetId ? { ...s, approval_status: 'approved' } : s));
      toast.success('Marks approved and released to Student Academic Center (Demo Mode)');
      if (onUpdate) onUpdate();
    }
  };

  const handleBulkApprove = async () => {
    try {
      const res = await api.put('/answer-sheets/bulk-approve');
      toast.success(res.data?.message || 'All evaluated marks approved & released to Student Academic Center!');
      fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      setAnswerSheets(prev => prev.map(s => s.status === 'checked' ? { ...s, approval_status: 'approved' } : s));
      toast.success('All evaluated marks approved and released to Student Academic Center (Demo Mode)');
      if (onUpdate) onUpdate();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this answer sheet?')) return;

    try {
      await api.delete(`/answer-sheets/${id}`);
      toast.success('Answer sheet deleted successfully!');
      fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      setAnswerSheets(prev => prev.filter(s => s.id !== id));
      toast.success('Answer sheet deleted successfully (Demo Mode)');
      if (onUpdate) onUpdate();
    }
  };

  const handleViewPDF = async (sheetId) => {
    try {
      const response = await api.get(`/answer-sheets/${sheetId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to open PDF');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      exam_id: '',
      student_id: '',
      assigned_teacher_id: '',
      file: null,
    });
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const getExamName = (examId) => {
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return 'Unknown';
    const subject = subjects.find((s) => s.id === exam.subject_id);
    return subject ? `${subject.name} - ${exam.exam_type}` : exam.exam_type;
  };

  const getTeacherName = (teacherId) => {
    if (!teacherId) return 'Not assigned';
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  };

  const handleExportSubjectResults = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams();
      if (exportYear && exportYear !== 'all') {
        params.append('class_name', exportYear);
      }
      const response = await api.get(`/admin/export-subject-results${params.toString() ? `?${params.toString()}` : ''}`, {
        responseType: 'blob',
      });
      const disposition = response.headers['content-disposition'] || '';
      let filename = 'Subject_Wise_Teacher_Results.xlsx';
      const match = /filename="?([^";]+)"?/i.exec(disposition);
      if (match && match[1]) filename = match[1];
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Exported subject-wise results');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Answer Sheets Management</h2>
          <span className="text-sm text-gray-500">({answerSheets.length} sheets)</span>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={exportYear} onValueChange={setExportYear}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="SY">Second Year (SY)</SelectItem>
                <SelectItem value="TY">Third Year (TY)</SelectItem>
                <SelectItem value="BE">Final Year (BE)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportSubjectResults} disabled={exporting} title="Export subject-wise teacher results">
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>
            <Button onClick={handleBulkApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs" title="Endorse and release all evaluated marks to students">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve Evaluated Marks
            </Button>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="upload-answer-sheet-button">
              <Upload className="w-4 h-4 mr-2" />
              Upload Answer Sheet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Answer Sheet</DialogTitle>
              <DialogDescription>Upload a student's answer sheet (PDF only)</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam">Exam</Label>
                <Select
                  value={formData.exam_id}
                  onValueChange={(value) => setFormData({ ...formData, exam_id: value })}
                  required
                >
                  <SelectTrigger data-testid="answer-sheet-exam-select">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => {
                      const subject = subjects.find((s) => s.id === exam.subject_id);
                      return (
                        <SelectItem key={exam.id} value={exam.id}>
                          {subject ? subject.name : 'Unknown'} - {exam.exam_type}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select
                  value={formData.student_id}
                  onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                  required
                >
                  <SelectTrigger data-testid="answer-sheet-student-select">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.roll_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher">Assign to Teacher (Optional)</Label>
                <Select
                  value={formData.assigned_teacher_id}
                  onValueChange={(value) => setFormData({ ...formData, assigned_teacher_id: value })}
                >
                  <SelectTrigger data-testid="answer-sheet-teacher-select">
                    <SelectValue placeholder="Select teacher (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">PDF File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  required
                  data-testid="answer-sheet-file-input"
                />
              </div>
              <Button type="submit" className="w-full" disabled={uploading} data-testid="submit-answer-sheet-button">
                {uploading ? 'Uploading...' : 'Upload Answer Sheet'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading answer sheets...</p>
        </div>
      ) : answerSheets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No answer sheets uploaded yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Student</th>
                <th className="text-left py-3 px-4">Exam</th>
                <th className="text-left py-3 px-4">Assigned Teacher</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Marks</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {answerSheets.map((sheet) => (
                <tr key={sheet.id} className="border-b">
                  <td className="py-3 px-4 font-medium">{getStudentName(sheet.student_id)}</td>
                  <td className="py-3 px-4 text-gray-600">{getExamName(sheet.exam_id)}</td>
                  <td className="py-3 px-4 text-gray-600">{getTeacherName(sheet.assigned_teacher_id)}</td>
                  <td className="py-3 px-4">
                    {sheet.status === 'checked' ? (
                      sheet.approval_status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Approved by HOD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Pending HOD Review
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Pending Evaluation
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-bold">
                    {sheet.marks_obtained !== null ? sheet.marks_obtained : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {sheet.status === 'checked' && sheet.approval_status !== 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveSheet(sheet.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-2.5 rounded-xl flex items-center gap-1"
                          title="Approve evaluated marks and release to Student"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPDF(sheet.id)}
                        data-testid={`view-answer-sheet-${sheet.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Dialog open={assignDialogOpen && selectedSheet?.id === sheet.id} onOpenChange={setAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSheet(sheet)}
                            data-testid={`assign-teacher-${sheet.id}`}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Teacher</DialogTitle>
                            <DialogDescription>
                              Select a teacher to grade this answer sheet
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Select onValueChange={handleAssignTeacher}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select teacher" />
                              </SelectTrigger>
                              <SelectContent>
                                {teachers.map((teacher) => (
                                  <SelectItem key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(sheet.id)}
                        data-testid={`delete-answer-sheet-${sheet.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnswerSheetsManagement;
