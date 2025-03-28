
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar } from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { formatCurrency, calculatePercentageChange, formatPercentage } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockBudgetData = [
  { month: 'Jan', budget: 150000, actual: 145000, optimal: 140000 },
  { month: 'Feb', budget: 160000, actual: 155000, optimal: 145000 },
  { month: 'Mar', budget: 165000, actual: 170000, optimal: 150000 },
  { month: 'Apr', budget: 170000, actual: 165000, optimal: 155000 },
  { month: 'May', budget: 175000, actual: 180000, optimal: 160000 },
  { month: 'Jun', budget: 180000, actual: 175000, optimal: 165000 },
];

const savingsData = [
  { category: 'Administrative', current: 45000, optimized: 38000, potential: 7000 },
  { category: 'Faculty', current: 85000, optimized: 85000, potential: 0 },
  { category: 'Infrastructure', current: 35000, optimized: 30000, potential: 5000 },
  { category: 'Technology', current: 25000, optimized: 22000, potential: 3000 },
  { category: 'Student Services', current: 15000, optimized: 13000, potential: 2000 },
  { category: 'Marketing', current: 10000, optimized: 8000, potential: 2000 },
];

// Department expense trend data for new graph
const departmentExpenseTrends = [
  { department: 'Science', q1: 20000, q2: 25000, q3: 30000, q4: 20000 },
  { department: 'Arts', q1: 15000, q2: 18000, q3: 17000, q4: 19000 },
  { department: 'Sports', q1: 18000, q2: 15000, q3: 16000, q4: 20000 },
  { department: 'Library', q1: 12000, q2: 14000, q3: 13000, q4: 11000 },
  { department: 'IT', q1: 22000, q2: 25000, q3: 28000, q4: 30000 },
  { department: 'Admin', q1: 35000, q2: 32000, q3: 34000, q4: 35000 },
];

// Mock approved expenses
const approvedExpenses = [
  { id: '001', department: 'Science', amount: 25000, date: '2023-01-10', purpose: 'Laboratory equipment', approved: '2023-01-05' },
  { id: '002', department: 'IT', amount: 32000, date: '2023-01-15', purpose: 'Computer upgrades', approved: '2023-01-12' },
  { id: '003', department: 'Library', amount: 15000, date: '2023-02-05', purpose: 'New books', approved: '2023-01-30' },
  { id: '004', department: 'Sports', amount: 20000, date: '2023-02-15', purpose: 'Equipment', approved: '2023-02-10' },
  { id: '005', department: 'Administrative', amount: 12000, date: '2023-03-01', purpose: 'Office supplies', approved: '2023-02-25' },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const BudgetOptimization: React.FC = () => {
  // Calculate total potential savings
  const totalPotentialSavings = savingsData.reduce((acc, item) => acc + item.potential, 0);
  
  // Track active department in the chart
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  
  // Format data for department expense chart
  const quarterlyData = [
    { name: 'Q1', ...departmentExpenseTrends.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.q1 }), {}) },
    { name: 'Q2', ...departmentExpenseTrends.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.q2 }), {}) },
    { name: 'Q3', ...departmentExpenseTrends.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.q3 }), {}) },
    { name: 'Q4', ...departmentExpenseTrends.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.q4 }), {}) },
  ];
  
  // Calculate expense changes for departments
  const departmentChanges = departmentExpenseTrends.map(dept => {
    const q1Total = dept.q1;
    const q4Total = dept.q4;
    const percentChange = calculatePercentageChange(q1Total, q4Total);
    return {
      department: dept.department,
      percentChange,
      isPositive: percentChange >= 0
    };
  }).sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Budget Optimization</h2>
          <p className="text-muted-foreground">
            AI-powered budget recommendations and insights
          </p>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
          <ArrowTrendingDownIcon className="h-5 w-5" />
          <span className="font-medium">Potential Savings: {formatCurrency(totalPotentialSavings)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Actual vs. Optimized</CardTitle>
            <CardDescription>
              Comparing current spending with AI-recommended optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockBudgetData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  name="Allocated Budget" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Spending" 
                  stroke="#F97316" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="optimal" 
                  name="AI Optimized" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Potential Savings by Category</CardTitle>
            <CardDescription>
              AI-identified areas for cost optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  name="Current Budget" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                />
                <Area 
                  type="monotone" 
                  dataKey="optimized" 
                  name="Optimized Budget" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                />
                <Area 
                  type="monotone" 
                  dataKey="potential" 
                  name="Potential Savings" 
                  stackId="3" 
                  stroke="#F97316" 
                  fill="#F97316" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Expense Trends</CardTitle>
          <CardDescription>
            Quarterly expenses across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="changes">Expense Changes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend onClick={(e) => {
                      // Fix type error by checking if dataKey is a string
                      if (typeof e.dataKey === 'string') {
                        setActiveDepartment(e.dataKey === activeDepartment ? null : e.dataKey);
                      }
                    }} />
                    {departmentExpenseTrends.map((dept, index) => (
                      <Bar 
                        key={dept.department}
                        dataKey={dept.department} 
                        fill={COLORS[index % COLORS.length]}
                        stackId="a"
                        hide={activeDepartment !== null && activeDepartment !== dept.department}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="changes">
              <div className="space-y-4">
                {departmentChanges.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{dept.department}</span>
                    <Badge className={dept.isPositive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {dept.isPositive ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {formatPercentage(dept.percentChange)}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>
              Smart suggestions to optimize your budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Administrative Expenses</h3>
                <p className="mt-1 text-sm">Digitize more administrative workflows to reduce paper and processing costs. Potential savings of 15%.</p>
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" className="text-sm">Implement Suggestion</Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <h3 className="font-medium text-purple-800 dark:text-purple-300">Infrastructure Maintenance</h3>
                <p className="mt-1 text-sm">Consolidate vendor contracts for maintenance services. Potential savings of 10-12%.</p>
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" className="text-sm">Implement Suggestion</Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Technology Resources</h3>
                <p className="mt-1 text-sm">Move from on-premises servers to cloud-based solutions. Potential savings of 18% over 3 years.</p>
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" className="text-sm">Implement Suggestion</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Approved Expenses</CardTitle>
            <CardDescription>
              Latest department expenses approved by management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-2 p-3 font-medium border-b text-sm">
                <div className="col-span-3">Department</div>
                <div className="col-span-3">Purpose</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Approved</div>
              </div>
              <div className="divide-y max-h-[300px] overflow-auto">
                {approvedExpenses.map((expense) => (
                  <div key={expense.id} className="grid grid-cols-12 gap-2 p-3 items-center text-sm">
                    <div className="col-span-3">{expense.department}</div>
                    <div className="col-span-3">{expense.purpose}</div>
                    <div className="col-span-2">{formatCurrency(expense.amount)}</div>
                    <div className="col-span-2">{formatDate(expense.date)}</div>
                    <div className="col-span-2">{formatDate(expense.approved)}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const COLORS = ['#9b87f5', '#7E69AB', '#1EAEDB', '#F97316', '#D6BCFA', '#60a5fa'];

export default BudgetOptimization;
