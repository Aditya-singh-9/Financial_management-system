
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for different academic sections
// DATABASE INTEGRATION POINT: Replace these with API calls to fetch student academic data

const PERSONAL_INFO = {
  id: 'STU12345',
  name: 'Alex Johnson',
  dob: '2000-05-15',
  gender: 'Male',
  address: '123 College Road, Academic City',
  contactNo: '+91 9876543210',
  email: 'alex.johnson@example.com',
  department: 'Computer Science',
  batch: '2021-2025',
  currentSemester: 4,
  admissionDate: '2021-08-10',
  parentName: 'Robert Johnson',
  parentContact: '+91 9876543211',
  bloodGroup: 'O+',
};

const GRADES = {
  cgpa: 3.8,
  semesters: [
    {
      id: 'SEM1',
      name: 'Semester 1',
      gpa: 3.7,
      subjects: [
        { code: 'CS101', name: 'Introduction to Programming', credits: 4, grade: 'A', points: 4.0 },
        { code: 'MA101', name: 'Calculus I', credits: 3, grade: 'A-', points: 3.7 },
        { code: 'PH101', name: 'Physics I', credits: 4, grade: 'B+', points: 3.3 },
        { code: 'EN101', name: 'English Composition', credits: 2, grade: 'A', points: 4.0 },
        { code: 'HU101', name: 'Ethics', credits: 2, grade: 'A-', points: 3.7 },
      ]
    },
    {
      id: 'SEM2',
      name: 'Semester 2',
      gpa: 3.9,
      subjects: [
        { code: 'CS102', name: 'Data Structures', credits: 4, grade: 'A', points: 4.0 },
        { code: 'MA102', name: 'Calculus II', credits: 3, grade: 'A', points: 4.0 },
        { code: 'PH102', name: 'Physics II', credits: 4, grade: 'A-', points: 3.7 },
        { code: 'EN102', name: 'Technical Writing', credits: 2, grade: 'B+', points: 3.3 },
        { code: 'CS103', name: 'Digital Logic', credits: 3, grade: 'A', points: 4.0 },
      ]
    },
    {
      id: 'SEM3',
      name: 'Semester 3',
      gpa: 3.8,
      subjects: [
        { code: 'CS201', name: 'Object-Oriented Programming', credits: 4, grade: 'A', points: 4.0 },
        { code: 'CS202', name: 'Database Systems', credits: 4, grade: 'A-', points: 3.7 },
        { code: 'MA201', name: 'Discrete Mathematics', credits: 3, grade: 'B+', points: 3.3 },
        { code: 'CS203', name: 'Computer Architecture', credits: 3, grade: 'A', points: 4.0 },
        { code: 'HU201', name: 'Economics', credits: 2, grade: 'A', points: 4.0 },
      ]
    }
  ]
};

const ATTENDANCE = {
  overallPercentage: 92.5,
  subjects: [
    { code: 'CS301', name: 'Algorithms', present: 38, total: 42, percentage: 90.5 },
    { code: 'CS302', name: 'Operating Systems', present: 40, total: 42, percentage: 95.2 },
    { code: 'CS303', name: 'Computer Networks', present: 39, total: 42, percentage: 92.9 },
    { code: 'CS304', name: 'Software Engineering', present: 37, total: 40, percentage: 92.5 },
    { code: 'HU301', name: 'Professional Ethics', present: 18, total: 20, percentage: 90.0 },
  ]
};

const TIMETABLE = {
  days: [
    {
      day: 'Monday',
      slots: [
        { time: '09:00 - 10:30', subject: 'CS301 - Algorithms', room: 'CS Lab 1' },
        { time: '10:45 - 12:15', subject: 'CS302 - Operating Systems', room: 'Room 201' },
        { time: '13:30 - 15:00', subject: 'CS303 - Computer Networks', room: 'Room 105' },
      ]
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '09:00 - 10:30', subject: 'CS304 - Software Engineering', room: 'Room 302' },
        { time: '10:45 - 12:15', subject: 'HU301 - Professional Ethics', room: 'Room 401' },
        { time: '13:30 - 15:00', subject: 'CS301 - Algorithms Lab', room: 'CS Lab 2' },
      ]
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '09:00 - 10:30', subject: 'CS302 - Operating Systems', room: 'Room 201' },
        { time: '10:45 - 12:15', subject: 'CS303 - Computer Networks', room: 'Room 105' },
        { time: '13:30 - 15:00', subject: 'CS304 - Software Engineering', room: 'Room 302' },
      ]
    },
    {
      day: 'Thursday',
      slots: [
        { time: '09:00 - 10:30', subject: 'CS301 - Algorithms', room: 'CS Lab 1' },
        { time: '10:45 - 12:15', subject: 'HU301 - Professional Ethics', room: 'Room 401' },
        { time: '13:30 - 16:30', subject: 'CS302 - Operating Systems Lab', room: 'CS Lab 3' },
      ]
    },
    {
      day: 'Friday',
      slots: [
        { time: '09:00 - 10:30', subject: 'CS303 - Computer Networks', room: 'Room 105' },
        { time: '10:45 - 12:15', subject: 'CS304 - Software Engineering', room: 'Room 302' },
        { time: '13:30 - 16:30', subject: 'CS303 - Computer Networks Lab', room: 'Network Lab' },
      ]
    },
  ]
};

const SYLLABUS = [
  {
    code: 'CS301',
    name: 'Algorithms',
    description: 'Study of algorithm design paradigms, complexity analysis, and common problem-solving approaches.',
    units: [
      { name: 'Unit 1', topics: 'Algorithm Analysis, Asymptotic Notation' },
      { name: 'Unit 2', topics: 'Divide and Conquer, Dynamic Programming' },
      { name: 'Unit 3', topics: 'Greedy Algorithms, Graph Algorithms' },
      { name: 'Unit 4', topics: 'NP-Completeness, Approximation Algorithms' },
    ],
    books: [
      'Introduction to Algorithms by Cormen, Leiserson, Rivest, and Stein',
      'Algorithm Design by Kleinberg and Tardos'
    ]
  },
  {
    code: 'CS302',
    name: 'Operating Systems',
    description: 'Fundamentals of operating system design and implementation.',
    units: [
      { name: 'Unit 1', topics: 'OS Introduction, Process Management' },
      { name: 'Unit 2', topics: 'CPU Scheduling, Process Synchronization' },
      { name: 'Unit 3', topics: 'Memory Management, Virtual Memory' },
      { name: 'Unit 4', topics: 'File Systems, I/O Systems' },
    ],
    books: [
      'Operating System Concepts by Silberschatz, Galvin, and Gagne',
      'Modern Operating Systems by Tanenbaum'
    ]
  },
  {
    code: 'CS303',
    name: 'Computer Networks',
    description: 'Principles and practice of computer networking and protocols.',
    units: [
      { name: 'Unit 1', topics: 'Network Models, Physical Layer' },
      { name: 'Unit 2', topics: 'Data Link Layer, Medium Access' },
      { name: 'Unit 3', topics: 'Network Layer, Routing' },
      { name: 'Unit 4', topics: 'Transport Layer, Application Layer' },
    ],
    books: [
      'Computer Networking: A Top-Down Approach by Kurose and Ross',
      'Computer Networks by Tanenbaum and Wetherall'
    ]
  }
];

// Render functions for different academic tabs
const renderPersonalInfo = (info: typeof PERSONAL_INFO) => (
  <Card>
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
      <CardDescription>Your registered personal details</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Student ID</p>
            <p className="font-medium">{info.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{info.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">{formatDate(info.dob)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium">{info.gender}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blood Group</p>
            <p className="font-medium">{info.bloodGroup}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{info.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{info.department}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Batch</p>
            <p className="font-medium">{info.batch}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Semester</p>
            <p className="font-medium">{info.currentSemester}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Admission Date</p>
            <p className="font-medium">{formatDate(info.admissionDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Parent/Guardian Name</p>
            <p className="font-medium">{info.parentName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Parent/Guardian Contact</p>
            <p className="font-medium">{info.parentContact}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const renderGrades = (grades: typeof GRADES) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance Summary</CardTitle>
        <CardDescription>Current CGPA: {grades.cgpa} / 4.0</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
          <div 
            className="h-6 bg-green-500 rounded-full" 
            style={{ width: `${(grades.cgpa / 4) * 100}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
              {grades.cgpa} / 4.0
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
    
    {grades.semesters.map((semester) => (
      <Card key={semester.id}>
        <CardHeader>
          <CardTitle>{semester.name}</CardTitle>
          <CardDescription>GPA: {semester.gpa} / 4.0</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semester.subjects.map((subject) => (
                <TableRow key={subject.code}>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>
                    <Badge className={
                      subject.grade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      subject.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                      subject.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                      'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }>
                      {subject.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{subject.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    ))}
  </div>
);

const renderAttendance = (attendance: typeof ATTENDANCE) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>Overall Attendance: {attendance.overallPercentage}%</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700 mb-6">
          <div 
            className={`h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
              attendance.overallPercentage >= 90 ? 'bg-green-500' : 
              attendance.overallPercentage >= 75 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${attendance.overallPercentage}%` }}
          >
            {attendance.overallPercentage}%
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Present/Total</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.subjects.map((subject) => (
              <TableRow key={subject.code}>
                <TableCell>{subject.code}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.present}/{subject.total}</TableCell>
                <TableCell>{subject.percentage}%</TableCell>
                <TableCell>
                  <Badge className={
                    subject.percentage >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    subject.percentage >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }>
                    {subject.percentage >= 90 ? 'Excellent' : 
                     subject.percentage >= 75 ? 'Good' : 
                     'At Risk'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

const renderFees = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Fee Details</CardTitle>
        <CardDescription>Your current fee structure and payment history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fee Structure (2023-2024)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Tuition Fee</TableCell>
                <TableCell>{formatCurrency(120000)}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Development Fee</TableCell>
                <TableCell>{formatCurrency(25000)}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Library Fee</TableCell>
                <TableCell>{formatCurrency(5000)}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Laboratory Fee</TableCell>
                <TableCell>{formatCurrency(15000)}</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">Due</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Exam Fee</TableCell>
                <TableCell>{formatCurrency(10000)}</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">Due</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <h3 className="text-lg font-semibold mt-6">Payment History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{formatDate('2023-07-15')}</TableCell>
                <TableCell>REC-78542</TableCell>
                <TableCell>Term 1 Tuition Fee</TableCell>
                <TableCell>{formatCurrency(60000)}</TableCell>
                <TableCell>Online Transfer</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{formatDate('2023-07-15')}</TableCell>
                <TableCell>REC-78543</TableCell>
                <TableCell>Development Fee</TableCell>
                <TableCell>{formatCurrency(25000)}</TableCell>
                <TableCell>Online Transfer</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{formatDate('2023-08-05')}</TableCell>
                <TableCell>REC-79125</TableCell>
                <TableCell>Library Fee</TableCell>
                <TableCell>{formatCurrency(5000)}</TableCell>
                <TableCell>Online Transfer</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{formatDate('2023-12-10')}</TableCell>
                <TableCell>REC-85436</TableCell>
                <TableCell>Term 2 Tuition Fee</TableCell>
                <TableCell>{formatCurrency(60000)}</TableCell>
                <TableCell>Credit Card</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
);

const renderTimetable = (timetable: typeof TIMETABLE) => (
  <div className="space-y-6">
    {timetable.days.map((day) => (
      <Card key={day.day}>
        <CardHeader>
          <CardTitle>{day.day}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {day.slots.map((slot, index) => (
                <TableRow key={index}>
                  <TableCell>{slot.time}</TableCell>
                  <TableCell>{slot.subject}</TableCell>
                  <TableCell>{slot.room}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    ))}
  </div>
);

const renderSyllabus = (syllabus: typeof SYLLABUS) => (
  <div className="space-y-6">
    {syllabus.map((course) => (
      <Card key={course.code}>
        <CardHeader>
          <CardTitle>{course.code}: {course.name}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Course Content</h3>
          <ul className="space-y-2 mb-4">
            {course.units.map((unit, index) => (
              <li key={index}>
                <p className="font-medium">{unit.name}</p>
                <p className="text-sm text-muted-foreground">{unit.topics}</p>
              </li>
            ))}
          </ul>
          
          <h3 className="font-semibold mb-2">Recommended Books</h3>
          <ul className="list-disc list-inside text-sm">
            {course.books.map((book, index) => (
              <li key={index}>{book}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    ))}
  </div>
);

const Academic = () => {
  const { user } = useAuth();
  
  // This data would normally be fetched from your database
  // DATABASE INTEGRATION POINT: Replace with API calls to fetch student data
  const studentInfo = PERSONAL_INFO;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Academic Information</h1>
        <p className="text-muted-foreground">
          View your academic details, performance, and schedule
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="grades">Grades & Report Card</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="mt-6">
          {renderPersonalInfo(studentInfo)}
        </TabsContent>
        
        <TabsContent value="grades" className="mt-6">
          {renderGrades(GRADES)}
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          {renderAttendance(ATTENDANCE)}
        </TabsContent>
        
        <TabsContent value="fees" className="mt-6">
          {renderFees()}
        </TabsContent>
        
        <TabsContent value="timetable" className="mt-6">
          {renderTimetable(TIMETABLE)}
        </TabsContent>
        
        <TabsContent value="syllabus" className="mt-6">
          {renderSyllabus(SYLLABUS)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Academic;
