import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Calendar, Clock, BookOpen, MapPin } from 'lucide-react';

const TimetableView = () => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedView, setSelectedView] = useState('timetable');

  // Sample timetable data - you can replace this with API data later
  const timetableData = {
    'SY-CSE': [
      { day: 'Monday', time: '9:00 - 10:00', subject: 'Discrete Mathematics', teacher: 'Prof. Bais P.G.', room: 'Room 101' },
      { day: 'Monday', time: '10:00 - 11:00', subject: 'Data Structures', teacher: 'Prof. Jadhav S.M.', room: 'Room 102' },
      { day: 'Monday', time: '11:00 - 12:00', subject: 'Engineering Mathematics', teacher: 'Prof. Devkar R.S.', room: 'Room 103' },
      { day: 'Tuesday', time: '9:00 - 10:00', subject: 'Database Systems', teacher: 'Prof. Shelke S.B.', room: 'Lab 1' },
      { day: 'Tuesday', time: '10:00 - 11:00', subject: 'Discrete Mathematics', teacher: 'Prof. Bais P.G.', room: 'Room 101' },
    ],
    'TY-CSE': [
      { day: 'Monday', time: '9:00 - 10:00', subject: 'Software Engineering', teacher: 'Prof. Magar A.R.', room: 'Room 201' },
      { day: 'Monday', time: '10:00 - 11:00', subject: 'Web Technologies', teacher: 'Prof. Late A.G.', room: 'Lab 2' },
      { day: 'Tuesday', time: '9:00 - 10:00', subject: 'Computer Networks', teacher: 'Prof. Pawar V.K.', room: 'Room 202' },
    ],
    'BE-CSE': [
      { day: 'Monday', time: '9:00 - 10:00', subject: 'Machine Learning', teacher: 'Prof. Shriramwar S.D.', room: 'Room 301' },
      { day: 'Monday', time: '10:00 - 11:00', subject: 'Cloud Computing', teacher: 'Prof. Kalyankar S.B.', room: 'Lab 3' },
    ]
  };

  const examSchedules = [
    { type: 'CA-1', date: '2024-03-15', time: '10:00 AM - 12:00 PM', subject: 'Discrete Mathematics', room: 'Hall A' },
    { type: 'CA-1', date: '2024-03-18', time: '2:00 PM - 4:00 PM', subject: 'Data Structures', room: 'Hall B' },
    { type: 'Mid Semester', date: '2024-04-01', time: '10:00 AM - 1:00 PM', subject: 'Engineering Mathematics', room: 'Hall A' },
  ];

  const filteredTimetable = selectedYear === 'all' 
    ? Object.values(timetableData).flat()
    : timetableData[selectedYear] || [];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Academic Timetable</CardTitle>
                <CardDescription>View class schedules and exam timetables</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label className="text-sm mb-2 block">Select Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="SY-CSE">Second Year (SY)</SelectItem>
                  <SelectItem value="TY-CSE">Third Year (TY)</SelectItem>
                  <SelectItem value="BE-CSE">Final Year (BE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-sm mb-2 block">View Type</Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger>
                  <SelectValue placeholder="Class Timetable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timetable">Class Timetable</SelectItem>
                  <SelectItem value="exams">Exam Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timetable View */}
          {selectedView === 'timetable' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Class Schedule
              </h3>
              
              {filteredTimetable.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No timetable data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold">Day</th>
                        <th className="text-left py-3 px-4 font-semibold">Time</th>
                        <th className="text-left py-3 px-4 font-semibold">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold">Teacher</th>
                        <th className="text-left py-3 px-4 font-semibold">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimetable.map((slot, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 font-medium">{slot.day}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {slot.time}
                            </span>
                          </td>
                          <td className="py-4 px-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            {slot.subject}
                          </td>
                          <td className="py-4 px-4">{slot.teacher}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 text-sm">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {slot.room}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Exam Schedule View */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                Examination Schedule
              </h3>
              
              {examSchedules.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No exam schedule available</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {examSchedules.map((exam, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                exam.type === 'CA-1' ? 'bg-green-100 text-green-800' :
                                exam.type === 'CA-2' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {exam.type}
                              </span>
                              <h4 className="font-semibold text-lg">{exam.subject}</h4>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(exam.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {exam.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {exam.room}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
          <CardTitle className="text-lg">Quick Links</CardTitle>
          <CardDescription>Access additional timetable resources</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => window.open('/timetable/pages/timetable.html', '_blank')}
            >
              <Calendar className="w-5 h-5" />
              <span>Full Timetable</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => window.open('/timetable/pages/midsem.html', '_blank')}
            >
              <BookOpen className="w-5 h-5" />
              <span>Mid-Sem Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => window.open('/timetable/pages/classtest.html', '_blank')}
            >
              <Clock className="w-5 h-5" />
              <span>Class Test Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetableView;
