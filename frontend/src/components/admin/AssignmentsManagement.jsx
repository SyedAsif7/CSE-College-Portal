import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { FileText, Download, TrendingUp } from 'lucide-react';

const MOCK_ASSIGNMENTS = [
  { id: 'asg1', prn: '2024SYCSE001', student_name: 'Syed Asif', class: 'SY-CSE', subject: 'Discrete Mathematics', title: 'Unit 1: Propositional Logic Proofs', submitted_at: '2026-10-01', status: 'Graded', grade: 'A', remarks: 'Excellent logical breakdown' },
  { id: 'asg2', prn: '2024SYCSE002', student_name: 'Shivani Lokhande', class: 'SY-CSE', subject: 'Data Structures', title: 'Binary Search Tree Implementation', submitted_at: '2026-10-02', status: 'Graded', grade: 'B+', remarks: 'Good recursive logic' },
  { id: 'asg3', prn: '2024SYCSE003', student_name: 'Adarsh Surye', class: 'SY-CSE', subject: 'Discrete Mathematics', title: 'Unit 1: Propositional Logic Proofs', submitted_at: '2026-10-03', status: 'Pending', grade: null, remarks: '' },
  { id: 'asg4', prn: '2024TYCSE001', student_name: 'Vaishnavi Udawant', class: 'TY-CSE', subject: 'Machine Learning', title: 'Linear Regression Modeling', submitted_at: '2026-10-01', status: 'Graded', grade: 'A+', remarks: 'Exceptional report and visual analysis' },
  { id: 'asg5', prn: '2024TYCSE002', student_name: 'Karan Ingole', class: 'TY-CSE', subject: 'Machine Learning', title: 'Linear Regression Modeling', submitted_at: '2026-10-02', status: 'Pending', grade: null, remarks: '' },
  { id: 'asg6', prn: '2024BECSE001', student_name: 'Shweta Ghuge', class: 'BE-CSE', subject: 'Cloud Computing', title: 'Kubernetes Microservices Architecture', submitted_at: '2026-09-29', status: 'Graded', grade: 'A', remarks: 'Well architected cluster diagram' },
];

const AssignmentsManagement = () => {
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [loading, setLoading] = useState(false);
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAssignments(response.data);
      }
    } catch (error) {
      console.warn('Backend offline, loaded department assignments demo records');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await api.get('/assignments/download-excel', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all_assignments.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Excel downloaded successfully');
    } catch (error) {
      // Client-side CSV export fallback
      const headers = ['PRN', 'Student Name', 'Class', 'Subject', 'Title', 'Date', 'Status', 'Grade'];
      const rows = assignments.map(a => [
        a.prn || '',
        `"${a.student_name || ''}"`,
        a.class || '',
        `"${a.subject || ''}"`,
        `"${a.title || ''}"`,
        a.submitted_at || '',
        a.status || '',
        a.grade || 'Pending'
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SSIEMS_Assignments_Report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Assignments CSV report downloaded successfully!');
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesClass = filterClass === 'all' || a.class === filterClass;
    const matchesSubject = filterSubject === 'all' || a.subject === filterSubject;
    return matchesClass && matchesSubject;
  });

  const stats = {
    total: assignments.length,
    graded: assignments.filter(a => a.grade).length,
    pending: assignments.filter(a => !a.grade).length,
  };

  const uniqueClasses = [...new Set(assignments.map(a => a.class))];
  const uniqueSubjects = [...new Set(assignments.map(a => a.subject))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Graded</p>
                <p className="text-3xl font-bold text-green-600">{stats.graded}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>Monitor all student assignment submissions</CardDescription>
            </div>
            <Button onClick={handleDownloadExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No assignments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold">PRN</th>
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-left py-3 px-4 font-semibold">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold">File</th>
                    <th className="text-left py-3 px-4 font-semibold">Grade</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium">{assignment.prn}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {assignment.class}
                        </span>
                      </td>
                      <td className="py-4 px-4">{assignment.subject}</td>
                      <td className="py-4 px-4 text-sm">{assignment.fileName}</td>
                      <td className="py-4 px-4">{assignment.grade || '-'}</td>
                      <td className="py-4 px-4">
                        {assignment.grade ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Graded
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentsManagement;
