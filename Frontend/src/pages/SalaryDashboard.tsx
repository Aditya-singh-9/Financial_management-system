
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import SalarySlipGenerator from '@/components/admin/SalarySlipGenerator';
import SalarySlipViewer from '@/components/admin/SalarySlipViewer';
import { formatCurrency } from '@/utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { CreditCard, Users, TrendingUp, ArrowUp, ArrowDown, Calendar, FileDown, FileText } from 'lucide-react';

interface SalarySlipData {
  staffDetails: {
    id: string;
    name: string;
    role: string;
    department: string;
    joinDate: string;
    email: string;
  };
  salaryMonth: string;
  salaryYear: string;
  paymentDate: string;
  salaryComponents: {
    earnings: {
      basicSalary: number;
      hra: number;
      da: number;
      ta: number;
    };
    deductions: {
      pf: number;
      professionalTax: number;
      tds: number;
    };
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
  };
  slipId: string;
  slipGeneratedOn: string;
}

const departmentData = [
  { name: 'Science', value: 2500000 },
  { name: 'Mathematics', value: 1800000 },
  { name: 'Languages', value: 1500000 },
  { name: 'Administration', value: 800000 },
  { name: 'Sports', value: 650000 },
  { name: 'Arts', value: 750000 },
];

const salaryTrendData = [
  { month: 'Jan', amount: 7800000 },
  { month: 'Feb', amount: 7750000 },
  { month: 'Mar', amount: 7900000 },
  { month: 'Apr', amount: 7850000 },
  { month: 'May', amount: 7950000 },
  { month: 'Jun', amount: 8100000 },
  { month: 'Jul', amount: 8150000 },
  { month: 'Aug', amount: 8000000 },
  { month: 'Sep', amount: 8050000 },
  { month: 'Oct', amount: 8200000 },
  { month: 'Nov', amount: 8250000 },
  { month: 'Dec', amount: 8300000 },
];

const staffDistributionData = [
  { name: 'Teachers', value: 65 },
  { name: 'Admin Staff', value: 15 },
  { name: 'Support Staff', value: 20 },
];

const COLORS = ['#9b87f5', '#1EAEDB', '#F97316', '#D6BCFA', '#7E69AB', '#6E59A5'];

const SalaryDashboard = () => {
  const { user } = useAuth();
  const [viewSlipData, setViewSlipData] = useState<SalarySlipData | null>(null);
  
  const totalSalaryBudget = departmentData.reduce((total, dept) => total + dept.value, 0);
  
  const averageSalary = 48000;
  const numberOfStaff = 160;
  const totalMonthlySalary = 8300000;
  const salaryGrowthRate = 5.2;
  
  const handleViewSlip = (slipData: SalarySlipData) => {
    setViewSlipData(slipData);
  };
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p>You do not have access to this page.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Salary Management</h1>
        <p className="text-muted-foreground">
          Manage staff salaries, generate salary slips, and analyze payroll data
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Monthly Salary</p>
                <h2 className="text-3xl font-bold">{formatCurrency(totalMonthlySalary)}</h2>
                <p className="flex items-center text-sm text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  {salaryGrowthRate}% from last year
                </p>
              </div>
              <div className="h-12 w-12 bg-edu-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-edu-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                <h2 className="text-3xl font-bold">{numberOfStaff}</h2>
                <p className="flex items-center text-sm text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  3.2% increase
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Salary</p>
                <h2 className="text-3xl font-bold">{formatCurrency(averageSalary)}</h2>
                <p className="flex items-center text-sm text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  4.5% increase
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Payday</p>
                <h2 className="text-3xl font-bold">25th</h2>
                <p className="text-sm text-muted-foreground">10 days remaining</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="salary-slips">Salary Slips</TabsTrigger>
          <TabsTrigger value="reports">Payroll Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Salary Trends</CardTitle>
                <CardDescription>Monthly salary expenditure for the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salaryTrendData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => {
                          if (value === 0) return '0';
                          return `${(value / 1000000).toFixed(1)}M`;
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), "Amount"]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        name="Total Salary" 
                        stroke="#9b87f5" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Staff Distribution</CardTitle>
                <CardDescription>By role category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={staffDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {staffDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Salary Allocation</CardTitle>
                <CardDescription>Budget breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tickFormatter={(value) => {
                          if (value === 0) return '0';
                          return `${(value / 100000).toFixed(0)}L`;
                        }}
                      />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), "Budget"]}
                      />
                      <Bar dataKey="value" name="Budget Allocation" fill="#9b87f5">
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Payroll Activities</CardTitle>
                <CardDescription>Latest salary-related changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Salary Increments Processed</p>
                        <p className="text-sm text-muted-foreground">Annual salary revision for 45 staff members</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Completed
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Yesterday</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">New Tax Deduction Rules Applied</p>
                        <p className="text-sm text-muted-foreground">Updated taxation calculations for all employees</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        In Effect
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">3 days ago</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Bonus Disbursement</p>
                        <p className="text-sm text-muted-foreground">Performance bonus credited to eligible staff</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Completed
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">1 week ago</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">New Teachers Onboarded</p>
                        <p className="text-sm text-muted-foreground">3 new teachers added to payroll</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Completed
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="salary-slips" className="pt-4">
          <SalarySlipGenerator onViewSlip={handleViewSlip} />
          
          {viewSlipData && (
            <SalarySlipViewer 
              slipData={viewSlipData}
              onClose={() => setViewSlipData(null)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Generate comprehensive reports for analysis and compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-edu-purple-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-edu-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Monthly Payroll Summary</h3>
                      <p className="text-sm text-muted-foreground">Overview of salary disbursements</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Month</option>
                      <option value="jan">January 2023</option>
                      <option value="feb">February 2023</option>
                      <option value="mar">March 2023</option>
                      <option value="apr">April 2023</option>
                      <option value="may">May 2023</option>
                      <option value="jun">June 2023</option>
                      <option value="jul">July 2023</option>
                      <option value="aug">August 2023</option>
                      <option value="sep">September 2023</option>
                      <option value="oct">October 2023</option>
                      <option value="nov">November 2023</option>
                      <option value="dec">December 2023</option>
                    </select>
                    <button className="bg-edu-purple-400 hover:bg-edu-purple-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Department Wise Salary Report</h3>
                      <p className="text-sm text-muted-foreground">Breakdown by academic department</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Department</option>
                      <option value="science">Science</option>
                      <option value="math">Mathematics</option>
                      <option value="lang">Languages</option>
                      <option value="arts">Arts</option>
                      <option value="admin">Administration</option>
                      <option value="sports">Sports</option>
                      <option value="all">All Departments</option>
                    </select>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Tax Deduction Report</h3>
                      <p className="text-sm text-muted-foreground">Summary of all tax deductions</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Period</option>
                      <option value="q1">Q1 2023 (Jan - Mar)</option>
                      <option value="q2">Q2 2023 (Apr - Jun)</option>
                      <option value="q3">Q3 2023 (Jul - Sep)</option>
                      <option value="q4">Q4 2023 (Oct - Dec)</option>
                      <option value="fy">Full Year 2023</option>
                    </select>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Salary Comparison Report</h3>
                      <p className="text-sm text-muted-foreground">Year-over-year salary comparison</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Comparison</option>
                      <option value="yoy">Year-over-Year</option>
                      <option value="qoq">Quarter-over-Quarter</option>
                      <option value="mom">Month-over-Month</option>
                      <option value="custom">Custom Period</option>
                    </select>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalaryDashboard;
