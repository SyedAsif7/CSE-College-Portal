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
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
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
      console.error('Error viewing PDF:', error);
      toast.error('Failed to open PDF');
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
      console.error('Error downloading:', error);
      toast.error('Failed to download');
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
