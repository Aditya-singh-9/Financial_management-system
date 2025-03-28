
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Download, Mail, Phone, UserCircle, Building, BookOpen, Calendar, Pencil, Save, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock teacher data
const teachersData = [
  {
    id: 'T001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@edufinflare.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    qualification: 'PhD in Computer Science',
    joiningDate: '2018-06-15',
    role: 'Professor',
    subjects: ['Data Structures', 'Algorithms', 'Machine Learning'],
    salary: {
      basic: 85000,
      hra: 25500,
      da: 8500,
      allowances: 15000,
      deductions: 18000,
      netSalary: 116000
    },
    bankDetails: {
      accountName: 'Rajesh Kumar',
      accountNumber: 'XXXX1234',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234'
    },
    attendance: 92,
    performance: 96,
    address: '123 Faculty Housing, University Campus, Bangalore',
    achievements: [
      'Best Teacher Award 2022',
      'Published 15 research papers in international journals',
      'Principal Investigator for 2 government-funded projects'
    ]
  },
  {
    id: 'T002',
    name: 'Prof. Anita Desai',
    email: 'anita.desai@edufinflare.edu',
    phone: '+91 87654 32109',
    department: 'Mathematics',
    qualification: 'PhD in Applied Mathematics',
    joiningDate: '2017-08-10',
    role: 'Associate Professor',
    subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
    salary: {
      basic: 75000,
      hra: 22500,
      da: 7500,
      allowances: 12000,
      deductions: 15000,
      netSalary: 102000
    },
    bankDetails: {
      accountName: 'Anita Desai',
      accountNumber: 'XXXX5678',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0002345'
    },
    attendance: 96,
    performance: 94,
    address: '456 Faculty Quarters, University Road, Bangalore',
    achievements: [
      'Excellence in Teaching Award 2021',
      'Member of State Mathematics Education Board',
      'Authored 3 textbooks on advanced mathematics'
    ]
  },
  {
    id: 'T003',
    name: 'Dr. Vikram Sharma',
    email: 'vikram.sharma@edufinflare.edu',
    phone: '+91 76543 21098',
    department: 'Physics',
    qualification: 'PhD in Theoretical Physics',
    joiningDate: '2016-05-20',
    role: 'HOD',
    subjects: ['Quantum Mechanics', 'Classical Mechanics', 'Electromagnetism'],
    salary: {
      basic: 95000,
      hra: 28500,
      da: 9500,
      allowances: 22000,
      deductions: 20000,
      netSalary: 135000
    },
    bankDetails: {
      accountName: 'Vikram Sharma',
      accountNumber: 'XXXX9012',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0003456'
    },
    attendance: 94,
    performance: 98,
    address: '789 Faculty Enclave, College Road, Bangalore',
    achievements: [
      'National Science Award 2020',
      'Published 25 research papers',
      'Visiting Faculty at MIT for 2 years'
    ]
  },
  {
    id: 'T004',
    name: 'Dr. Priya Patel',
    email: 'priya.patel@edufinflare.edu',
    phone: '+91 65432 10987',
    department: 'Chemistry',
    qualification: 'PhD in Organic Chemistry',
    joiningDate: '2019-07-05',
    role: 'Assistant Professor',
    subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Biochemistry'],
    salary: {
      basic: 65000,
      hra: 19500,
      da: 6500,
      allowances: 10000,
      deductions: 12000,
      netSalary: 89000
    },
    bankDetails: {
      accountName: 'Priya Patel',
      accountNumber: 'XXXX3456',
      bankName: 'Axis Bank',
      ifscCode: 'UTIB0004567'
    },
    attendance: 98,
    performance: 92,
    address: '234 Faculty Housing, South Campus, Bangalore',
    achievements: [
      'Young Scientist Award 2021',
      'Research grant of 50 lakhs for pharmaceutical project',
      'Mentor for 5 PhD students'
    ]
  }
];

// Payment history for selected teacher
const paymentHistory = [
  { id: 'P2023-03', date: '2023-03-31', amount: 116000, status: 'Completed' },
  { id: 'P2023-02', date: '2023-02-28', amount: 116000, status: 'Completed' },
  { id: 'P2023-01', date: '2023-01-31', amount: 115000, status: 'Completed' },
  { id: 'P2022-12', date: '2022-12-31', amount: 115000, status: 'Completed' },
  { id: 'P2022-11', date: '2022-11-30', amount: 112000, status: 'Completed' },
  { id: 'P2022-10', date: '2022-10-31', amount: 112000, status: 'Completed' },
];

const TeacherDetails = () => {
  const { toast } = useToast();
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachersData[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState(teachersData[0]);
  
  const handleSelectTeacher = (id: string) => {
    setSelectedTeacher(id);
    setEditedTeacher(teachersData.find(teacher => teacher.id === id) || teachersData[0]);
    setIsEditing(false);
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Teacher information has been updated successfully.",
    });
    setIsEditing(false);
  };
  
  const handleInputChange = (field: string, value: string) => {
    setEditedTeacher({
      ...editedTeacher,
      [field]: value
    });
  };
  
  const handleDownloadSalarySlip = (paymentId: string) => {
    const selectedTeacherData = teachersData.find(teacher => teacher.id === selectedTeacher);
    
    if (!selectedTeacherData) {
      toast({
        title: "Error",
        description: "Teacher data not found",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Downloading Salary Slip",
      description: `Salary slip for ${selectedTeacherData.name} - ${paymentId} is being downloaded.`,
    });
  };
  
  const getTeacherById = (id: string) => {
    return teachersData.find(teacher => teacher.id === id) || teachersData[0];
  };
  
  const currentTeacher = getTeacherById(selectedTeacher);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">
            View and manage teacher information, qualifications, and salaries
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Select value={selectedTeacher} onValueChange={handleSelectTeacher}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachersData.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teacher Details</CardTitle>
            <CardDescription>Personal and professional information</CardDescription>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <Button onClick={handleSaveChanges} className="bg-edu-purple-400 hover:bg-edu-purple-500">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button variant="outline" onClick={handleEditToggle}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl bg-edu-purple-200">
                  {currentTeacher.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">{currentTeacher.name}</h3>
                <p className="text-muted-foreground">{currentTeacher.role}</p>
                <p className="text-sm">{currentTeacher.department}</p>
              </div>
              
              <div className="w-full mt-4 space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{currentTeacher.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{currentTeacher.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Joined: {formatDate(currentTeacher.joiningDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <Tabs defaultValue="info">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="info">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Information
                  </TabsTrigger>
                  <TabsTrigger value="salary">
                    <FileText className="h-4 w-4 mr-2" />
                    Salary & Payments
                  </TabsTrigger>
                  <TabsTrigger value="academic">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Academic Details
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Full Name</Label>
                      <Input 
                        value={isEditing ? editedTeacher.name : currentTeacher.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input 
                        value={isEditing ? editedTeacher.email : currentTeacher.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input 
                        value={isEditing ? editedTeacher.phone : currentTeacher.phone} 
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input 
                        value={isEditing ? editedTeacher.department : currentTeacher.department} 
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div>
                      <Label>Qualification</Label>
                      <Input 
                        value={isEditing ? editedTeacher.qualification : currentTeacher.qualification} 
                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input 
                        value={isEditing ? editedTeacher.role : currentTeacher.role} 
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <Input 
                        value={isEditing ? editedTeacher.address : currentTeacher.address} 
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-3">Achievements & Recognitions</h4>
                    <ul className="space-y-2 pl-6 list-disc">
                      {currentTeacher.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="salary" className="space-y-4 pt-4">
                  <div>
                    <h4 className="font-medium mb-3">Salary Structure</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">Basic Salary</p>
                        <p className="font-semibold">{formatCurrency(currentTeacher.salary.basic)}</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">HRA</p>
                        <p className="font-semibold">{formatCurrency(currentTeacher.salary.hra)}</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">DA</p>
                        <p className="font-semibold">{formatCurrency(currentTeacher.salary.da)}</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">Allowances</p>
                        <p className="font-semibold">{formatCurrency(currentTeacher.salary.allowances)}</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">Deductions</p>
                        <p className="font-semibold">{formatCurrency(currentTeacher.salary.deductions)}</p>
                      </div>
                      <div className="p-3 border rounded-md bg-muted">
                        <p className="text-sm text-muted-foreground">Net Salary</p>
                        <p className="font-semibold">{formatCurrency(currentTeacher.salary.netSalary)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium mb-3">Bank Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">Account Holder</p>
                        <p className="font-medium">{currentTeacher.bankDetails.accountName}</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-medium">{currentTeacher.bankDetails.accountNumber}</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">Bank Name</p>
                        <p className="font-medium">{currentTeacher.bankDetails.bankName}</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-muted-foreground">IFSC Code</p>
                        <p className="font-medium">{currentTeacher.bankDetails.ifscCode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-3">Payment History</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>{payment.id.substring(1)}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadSalarySlip(payment.id)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Slip
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="academic" className="space-y-4 pt-4">
                  <div>
                    <h4 className="font-medium mb-3">Teaching Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentTeacher.subjects.map((subject, index) => (
                        <div key={index} className="px-3 py-1 bg-edu-purple-100 text-edu-purple-800 rounded-full text-sm">
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Attendance</span>
                          <span className="text-sm font-medium">{currentTeacher.attendance}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-edu-purple-400" 
                            style={{ width: `${currentTeacher.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Performance Rating</span>
                          <span className="text-sm font-medium">{currentTeacher.performance}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-edu-purple-400" 
                            style={{ width: `${currentTeacher.performance}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-3">Department & Responsibilities</h4>
                    <div className="p-4 border rounded-md">
                      <div className="flex items-start">
                        <Building className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <h5 className="font-medium">{currentTeacher.department}</h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentTeacher.role === 'HOD' 
                              ? 'Manages the department as Head of Department, responsible for curriculum development, faculty mentoring, and administrative oversight.'
                              : `Serves as ${currentTeacher.role} in the department, responsible for teaching, research, and student mentoring.`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDetails;
