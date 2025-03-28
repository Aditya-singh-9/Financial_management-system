
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, FileDown, Mail, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  joinDate: string;
  email: string;
}

const mockStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Ajay Kumar', role: 'Teacher', department: 'Science', joinDate: '2020-05-15', email: 'ajay.kumar@example.com' },
  { id: 'staff-2', name: 'Priya Singh', role: 'Teacher', department: 'Mathematics', joinDate: '2019-07-10', email: 'priya.singh@example.com' },
  { id: 'staff-3', name: 'Rohit Sharma', role: 'Teacher', department: 'Physical Education', joinDate: '2021-02-22', email: 'rohit.sharma@example.com' },
  { id: 'staff-4', name: 'Deepika Patel', role: 'Administrator', department: 'Admin', joinDate: '2018-11-05', email: 'deepika.patel@example.com' },
  { id: 'staff-5', name: 'Amit Verma', role: 'Librarian', department: 'Library', joinDate: '2020-01-15', email: 'amit.verma@example.com' },
  { id: 'staff-6', name: 'Neha Gupta', role: 'Accountant', department: 'Finance', joinDate: '2019-09-01', email: 'neha.gupta@example.com' },
  { id: 'staff-7', name: 'Sanjay Mishra', role: 'Teacher', department: 'History', joinDate: '2017-06-30', email: 'sanjay.mishra@example.com' },
  { id: 'staff-8', name: 'Kavita Joshi', role: 'Teacher', department: 'English', joinDate: '2020-08-12', email: 'kavita.joshi@example.com' },
];

interface SalarySlipGeneratorProps {
  onViewSlip?: (slipData: any) => void;
}

const SalarySlipGenerator: React.FC<SalarySlipGeneratorProps> = ({ onViewSlip }) => {
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isGenerating, setIsGenerating] = useState(false);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleGenerateSlip = () => {
    if (!selectedStaff || !month || !year) {
      toast({
        title: "Missing Information",
        description: "Please select staff member, month and year",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    const staffMember = mockStaff.find(staff => staff.id === selectedStaff);
    
    if (!staffMember) {
      toast({
        title: "Staff Not Found",
        description: "Could not find the selected staff member",
        variant: "destructive"
      });
      setIsGenerating(false);
      return;
    }
    
    // Generate mock salary details
    const basicSalary = Math.floor(40000 + Math.random() * 30000);
    const hra = basicSalary * 0.4;
    const da = basicSalary * 0.1;
    const ta = 3000;
    const pf = basicSalary * 0.12;
    const professionalTax = 200;
    const tds = (basicSalary + hra + da + ta) * 0.1;
    
    const grossSalary = basicSalary + hra + da + ta;
    const totalDeductions = pf + professionalTax + tds;
    const netSalary = grossSalary - totalDeductions;
    
    // Create salary slip data
    const salarySlipData = {
      staffDetails: staffMember,
      salaryMonth: month,
      salaryYear: year,
      paymentDate: new Date().toISOString(),
      salaryComponents: {
        earnings: {
          basicSalary,
          hra,
          da,
          ta
        },
        deductions: {
          pf,
          professionalTax,
          tds
        },
        grossSalary,
        totalDeductions,
        netSalary
      },
      slipId: `SAL-${year}${months.indexOf(month) + 1}-${selectedStaff.split('-')[1]}`,
      slipGeneratedOn: new Date().toISOString()
    };
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Salary Slip Generated",
        description: `Salary slip for ${staffMember.name} has been generated successfully.`,
      });
      
      if (onViewSlip) {
        onViewSlip(salarySlipData);
      }
    }, 1500);
  };
  
  const handlePrintSlip = () => {
    toast({
      title: "Print Requested",
      description: "Sending salary slip to printer",
    });
  };
  
  const handleEmailSlip = () => {
    const staffMember = mockStaff.find(staff => staff.id === selectedStaff);
    
    toast({
      title: "Email Sent",
      description: `Salary slip has been emailed to ${staffMember?.email || 'the staff member'}`,
    });
  };
  
  const handleDownloadSlip = () => {
    const staffMember = mockStaff.find(staff => staff.id === selectedStaff);
    
    toast({
      title: "Download Started",
      description: `Salary slip for ${staffMember?.name || 'the staff member'} is being downloaded`,
    });
    
    // In a real application, this would trigger the creation and download of a PDF
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Salary slip has been downloaded successfully",
      });
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Slip Generator</CardTitle>
        <CardDescription>Generate and manage salary slips for staff members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="staff-select">Select Staff Member</Label>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger id="staff-select">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {mockStaff.map(staff => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name} - {staff.role}, {staff.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="month-select">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger id="month-select">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year-input">Year</Label>
            <Input 
              id="year-input" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              placeholder="YYYY"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleGenerateSlip} 
            className="w-full bg-edu-purple-400 hover:bg-edu-purple-500"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Salary Slip'}
          </Button>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium mb-2">Recent Salary Slips</h3>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
              <div className="col-span-3">Staff Name</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Month/Year</div>
              <div className="col-span-2">Net Salary</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {mockStaff.slice(0, 3).map((staff, index) => {
                const mockNetSalary = Math.floor(40000 + Math.random() * 30000);
                const randomMonth = months[Math.floor(Math.random() * months.length)];
                
                return (
                  <div key={staff.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                    <div className="col-span-3 font-medium">{staff.name}</div>
                    <div className="col-span-2">{staff.department}</div>
                    <div className="col-span-2">{randomMonth}/{year}</div>
                    <div className="col-span-2">{formatCurrency(mockNetSalary)}</div>
                    <div className="col-span-3 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="Print Salary Slip"
                        onClick={handlePrintSlip}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="Email Salary Slip"
                        onClick={handleEmailSlip}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="Download Salary Slip"
                        onClick={handleDownloadSlip}
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="View Salary Slip"
                        className="text-edu-purple-500"
                        onClick={() => {
                          if (onViewSlip) {
                            // Generate mock data for viewing
                            const basicSalary = Math.floor(40000 + Math.random() * 30000);
                            const hra = basicSalary * 0.4;
                            const da = basicSalary * 0.1;
                            const ta = 3000;
                            const pf = basicSalary * 0.12;
                            const professionalTax = 200;
                            const tds = (basicSalary + hra + da + ta) * 0.1;
                            
                            const grossSalary = basicSalary + hra + da + ta;
                            const totalDeductions = pf + professionalTax + tds;
                            const netSalary = grossSalary - totalDeductions;
                            
                            onViewSlip({
                              staffDetails: staff,
                              salaryMonth: randomMonth,
                              salaryYear: year,
                              paymentDate: new Date().toISOString(),
                              salaryComponents: {
                                earnings: {
                                  basicSalary,
                                  hra,
                                  da,
                                  ta
                                },
                                deductions: {
                                  pf,
                                  professionalTax,
                                  tds
                                },
                                grossSalary,
                                totalDeductions,
                                netSalary
                              },
                              slipId: `SAL-${year}${months.indexOf(randomMonth) + 1}-${staff.id.split('-')[1]}`,
                              slipGeneratedOn: new Date().toISOString()
                            });
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalarySlipGenerator;
