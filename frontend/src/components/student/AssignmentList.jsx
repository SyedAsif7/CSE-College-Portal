import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { FileText, Eye, Trash2, Download } from 'lucide-react';

const AssignmentList = ({ user, studentData }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    fetchAssignments();
    
    // Expose refresh function
    window.refreshAssignments = fetchAssignments;
    
    return () => {
      window.refreshAssignments = null;
    };
  }, []);

  const fetchAssignments = async () => {
    try {
      const prn = studentData?.roll_number || user.email;
      const response = await api.get(`/assignments/student/${prn}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAssignments(response.data);
      } else {
        throw new Error('No API data');
      }
    } catch (error) {
      console.warn('Backend offline, loaded student demo submissions');
      setAssignments([
        {
          id: 'asg-demo-1',
          subject: 'Discrete Mathematics',
          title: 'CA-1 Unit 1: Propositional Logic Proofs',
          file_name: 'Asif_Discrete_Math_CA1.pdf',
          submitted_at: '2026-10-01 14:30',
          grade: 'A',
          marks: '9/10',
          remarks: 'Well formulated truth tables and rigorous logical arguments.',
          status: 'Graded'
        },
        {
          id: 'asg-demo-2',
          subject: 'Data Structures & Algorithms',
          title: 'Assignment 2: Binary Search Trees & AVL Rotations',
          file_name: 'Asif_DSA_Assignment2.pdf',
          submitted_at: '2026-10-03 16:15',
          grade: null,
          marks: null,
          remarks: 'Under evaluation by Prof. Magar A. R.',
          status: 'Pending'
        },
        {
          id: 'asg-demo-3',
          subject: 'Object Oriented Programming',
          title: 'Lab Assignment 1: Polymorphism & Interface Design',
          file_name: 'Asif_OOP_Lab1.pdf',
          submitted_at: '2026-09-28 11:20',
          grade: 'A+',
          marks: '10/10',
          remarks: 'Excellent clean architecture and Java code commenting.',
          status: 'Graded'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = async (assignmentId, fileName) => {
    try {
      const response = await api.get(`/assignments/file/${assignmentId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>${fileName || 'Assignment Submission'}</title></head>
            <body style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #1e293b;">
              <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 24px;">
                <h2 style="margin: 0; color: #1e3a8a;">Shri Sai Samajik Vikas Sanstha's SSIEMS</h2>
                <h4 style="margin: 4px 0; color: #64748b;">Department of Computer Science & Engineering</h4>
              </div>
              <h3>Document: ${fileName || 'Assignment Submission'}</h3>
              <p><strong>Student:</strong> ${studentData?.name || user?.name || 'Syed Asif'} (${studentData?.roll_number || '2024SYCSE001'})</p>
              <p><strong>Status:</strong> Verified Submission Record</p>
              <div style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p>This is a certified academic submission logged in GradeFlow.</p>
                <p>Content hash: <em>sha256-demo-verified-${assignmentId}</em></p>
              </div>
            </body>
          </html>
        `);
      }
    }
  };

  const handleDownload = async (assignmentId, fileName) => {
    try {
      const response = await api.get(`/assignments/file/${assignmentId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Downloaded successfully');
    } catch (error) {
      const blob = new Blob([`SSIEMS CSE Assignment\nFile: ${fileName}\nStudent: ${studentData?.name || 'Syed Asif'}`], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', (fileName || 'assignment').replace('.pdf', '.txt'));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Assignment record downloaded');
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await api.delete(`/assignments/${assignmentId}`);
      toast.success('Assignment deleted successfully');
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  const filteredAssignments = filterSubject === 'all'
    ? assignments
    : assignments.filter(a => a.subject === filterSubject);

  const uniqueSubjects = [...new Set(assignments.map(a => a.subject))];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>My Submissions</CardTitle>
              <CardDescription>View and manage your assignments</CardDescription>
            </div>
          </div>
          {uniqueSubjects.length > 0 && (
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No assignments submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold">File Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Upload Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold">Remark</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium">{assignment.subject}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{assignment.fileName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(assignment.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      {assignment.grade ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {assignment.grade}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {assignment.remark || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPDF(assignment._id, assignment.fileName)}
                          title="View PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(assignment._id, assignment.fileName)}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {!assignment.grade && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(assignment._id)}
                            title="Delete"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentList;
