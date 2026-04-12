import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const AssignmentUpload = ({ user, studentData }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    class_name: '',
    subject: '',
    file: null,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.class_name) {
      toast.error('Please select a class');
      return;
    }

    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }

    if (!formData.file || formData.file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('prn', studentData?.roll_number || user.email);
      formDataToSend.append('class_name', formData.class_name);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('file', formData.file);

      await api.post('/assignments/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Assignment submitted successfully!');
      setFormData({
        class_name: '',
        subject: '',
        file: null,
      });
      
      // Trigger refresh of assignment list
      if (window.refreshAssignments) {
        window.refreshAssignments();
      }
    } catch (error) {
      console.error('Error uploading assignment:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload assignment');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      e.target.value = null;
      return;
    }
    setFormData({ ...formData, file });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle>Submit Assignment</CardTitle>
            <CardDescription>Upload your assignment PDF</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={formData.class_name}
              onValueChange={(value) => setFormData({ ...formData, class_name: value, subject: '' })}
            >
              <SelectTrigger id="class">
                <SelectValue placeholder="Select your class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FY">First Year (FY)</SelectItem>
                <SelectItem value="SY">Second Year (SY)</SelectItem>
                <SelectItem value="TY">Third Year (TY)</SelectItem>
                <SelectItem value="BE">Final Year (BE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
              disabled={!formData.class_name}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects
                  .filter((s) => s.class_name?.includes(formData.class_name))
                  .map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Assignment File (PDF)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-gray-500">Only PDF files are allowed (Max 10MB)</p>
          </div>

          {formData.file && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">{formData.file.name}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Assignment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssignmentUpload;
