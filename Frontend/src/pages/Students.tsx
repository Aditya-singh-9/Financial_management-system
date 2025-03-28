
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, Download, Mail, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Mock data for students
const mockStudents = [
  { 
    id: 'STU001', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    program: 'Computer Science',
    year: '3rd Year',
    status: 'active',
    feeDue: 0,
    lastPayment: '2023-03-15',
  },
  { 
    id: 'STU002', 
    name: 'Bob Smith', 
    email: 'bob@example.com', 
    program: 'Mechanical Engineering',
    year: '2nd Year',
    status: 'active',
    feeDue: 15000,
    lastPayment: '2023-02-20',
  },
  { 
    id: 'STU003', 
    name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    program: 'Business Administration',
    year: '1st Year',
    status: 'active',
    feeDue: 25000,
    lastPayment: '2023-01-10',
  },
  { 
    id: 'STU004', 
    name: 'Diana Ross', 
    email: 'diana@example.com', 
    program: 'Physics',
    year: '4th Year',
    status: 'inactive',
    feeDue: 5000,
    lastPayment: '2023-03-01',
  },
  { 
    id: 'STU005', 
    name: 'Edward Miller', 
    email: 'edward@example.com', 
    program: 'Mathematics',
    year: '2nd Year',
    status: 'active',
    feeDue: 0,
    lastPayment: '2023-03-20',
  },
];

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReminder = (student: typeof students[0]) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${student.name}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage student records and fee information
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="bg-edu-purple-400 hover:bg-edu-purple-500 flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>A total of {filteredStudents.length} students</CardDescription>
            </div>
            <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-8 w-full sm:w-[250px]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
              <div className="col-span-4">Student</div>
              <div className="col-span-2">Program</div>
              <div className="col-span-2">Year</div>
              <div className="col-span-2">Due Amount</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div key={student.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                    <div className="col-span-4 flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-edu-purple-200">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.email} • ID: {student.id}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 text-sm">{student.program}</div>
                    <div className="col-span-2 text-sm">{student.year}</div>
                    <div className="col-span-2 text-sm font-medium">
                      {student.feeDue > 0 ? (
                        <span className="text-red-500">{formatCurrency(student.feeDue)}</span>
                      ) : (
                        <span className="text-green-500">Paid</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <Badge 
                        variant={student.status === 'active' ? 'outline' : 'secondary'}
                        className={student.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                        }
                      >
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Fee History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleSendReminder(student)}
                            disabled={student.feeDue === 0}
                          >
                            Send Payment Reminder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No students found matching your search criteria.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
