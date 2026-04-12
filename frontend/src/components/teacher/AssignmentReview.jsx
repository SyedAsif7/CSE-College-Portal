import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { FileText, Eye, Download } from 'lucide-react';

const AssignmentReview = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [grade, setGrade] = useState('');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async () => {
    if (!gradingAssignment) return;

    try {
      await api.put(`/assignments/${gradingAssignment._id}/grade`, {
        grade,
        remark,
      });

      toast.success('Grade submitted successfully!');
      setGradingAssignment(null);
      setGrade('');
      setRemark('');
      fetchAssignments();
    } catch (error) {
      console.error('Error submitting grade:', error);
      toast.error('Failed to submit grade');
    }
  };

  const handleViewPDF = async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/file/${assignmentId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing PDF:', error);
      toast.error('Failed to open PDF');
    }
  };

  const handleDownloadExcel = async () => {
    if (assignments.length === 0) {
      toast.info('No assignments available to export');
      return;
    }

    try {
      const response = await api.get('/assignments/download-excel', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'assignments.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Excel downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      if (error.status === 404) {
        toast.error('No assignments available to export');
      } else {
        toast.error('Failed to download Excel');
      }
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesClass = filterClass === 'all' || a.class === filterClass;
    const matchesSubject = filterSubject === 'all' || a.subject === filterSubject;
    return matchesClass && matchesSubject;
  });

  const uniqueClasses = [...new Set(assignments.map(a => a.class))];
  const uniqueSubjects = [...new Set(assignments.map(a => a.subject))];

  const openGradeDialog = (assignment) => {
    setGradingAssignment(assignment);
    setGrade(assignment.grade || '');
    setRemark(assignment.remark || '');
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Review Assignments</CardTitle>
                <CardDescription>Grade and provide feedback on student submissions</CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleDownloadExcel} 
              variant="outline"
              disabled={assignments.length === 0}
              title={assignments.length === 0 ? 'No assignments to export' : 'Export marks to Excel'}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label className="text-sm mb-2 block">Filter by Class</Label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-sm mb-2 block">Filter by Subject</Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
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
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
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
                      <td className="py-4 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPDF(assignment._id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
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
                      <td className="py-4 px-4">
                        <Button
                          size="sm"
                          onClick={() => openGradeDialog(assignment)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500"
                        >
                          {assignment.grade ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grading Dialog */}
      {gradingAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Grade Assignment</h3>
            <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm"><strong>PRN:</strong> {gradingAssignment.prn}</p>
              <p className="text-sm"><strong>Subject:</strong> {gradingAssignment.subject}</p>
              <p className="text-sm"><strong>File:</strong> {gradingAssignment.fileName}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g., A, B+, 85/100"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="remark">Remark / Feedback</Label>
                <Input
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Optional feedback for student"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleGradeSubmit}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500"
              >
                Submit Grade
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGradingAssignment(null);
                  setGrade('');
                  setRemark('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentReview;
