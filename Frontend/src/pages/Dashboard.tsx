import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import SeverityBadge from '@/components/dashboard/SeverityBadge';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  FileBox, 
  Users,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { 
  getDashboardStats, 
  getFeeAnalytics, 
  getExpenseBreakdown, 
  getBudgetTrends,
  getRecentTransactions,
  getPendingApprovals,
  getFraudAlerts
} from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, calculatePercentageChange, formatPercentage } from '@/utils/formatters';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(getDashboardStats());
  const [feeAnalytics, setFeeAnalytics] = useState(getFeeAnalytics());
  const [expenseBreakdown, setExpenseBreakdown] = useState(getExpenseBreakdown());
  const [budgetTrends, setBudgetTrends] = useState(getBudgetTrends());
  const [recentTransactions, setRecentTransactions] = useState(getRecentTransactions());
  const [pendingApprovals, setPendingApprovals] = useState(getPendingApprovals());
  const [fraudAlerts, setFraudAlerts] = useState(getFraudAlerts());
  
  const [expenseRecords, setExpenseRecords] = useState([
    { id: 'exp-1', department: 'Science', amount: 25000, status: 'approved', date: '2023-03-10', description: 'Laboratory equipment' },
    { id: 'exp-2', department: 'Library', amount: 15000, status: 'approved', date: '2023-03-05', description: 'New books and journals' },
    { id: 'exp-3', department: 'IT', amount: 35000, status: 'pending', date: '2023-03-15', description: 'Computer upgrades' },
    { id: 'exp-4', department: 'Sports', amount: 18000, status: 'pending', date: '2023-03-20', description: 'New equipment' },
    { id: 'exp-5', department: 'Administrative', amount: 12000, status: 'approved', date: '2023-03-01', description: 'Office supplies' },
  ]);
  
  const [departmentBudgets, setDepartmentBudgets] = useState([
    { department: 'Science', allocated: 120000, spent: 85000, remaining: 35000 },
    { department: 'Arts', allocated: 80000, spent: 45000, remaining: 35000 },
    { department: 'Sports', allocated: 70000, spent: 60000, remaining: 10000 },
    { department: 'Library', allocated: 50000, spent: 35000, remaining: 15000 },
    { department: 'IT', allocated: 100000, spent: 75000, remaining: 25000 },
    { department: 'Administrative', allocated: 150000, spent: 120000, remaining: 30000 },
  ]);

  const [studentDashboardData, setStudentDashboardData] = useState({
    totalFeesPaid: 48000,
    pendingAmount: 55000,
    overdueAmount: 35000,
    nextDueDate: '2023-04-15',
    completedPayments: 3,
    upcomingPayments: [
      {
        id: 'fee-1',
        title: 'Term 3 Tuition Fee',
        amount: 35000,
        dueDate: '2023-04-15',
        status: 'due',
      },
      {
        id: 'fee-2',
        title: 'Exam Fee',
        amount: 12500,
        dueDate: '2023-05-10',
        status: 'upcoming',
      },
      {
        id: 'fee-3',
        title: 'Lab Fee',
        amount: 7500,
        dueDate: '2023-05-25',
        status: 'upcoming',
      },
    ]
  });

  useEffect(() => {
    setStats(getDashboardStats());
    setFeeAnalytics(getFeeAnalytics());
    setExpenseBreakdown(getExpenseBreakdown());
    setBudgetTrends(getBudgetTrends());
    setRecentTransactions(getRecentTransactions());
    setPendingApprovals(getPendingApprovals());
    setFraudAlerts(getFraudAlerts());
    
    const handleFeePaymentUpdate = (event: CustomEvent) => {
      const { totalPaid, pendingAmount, lastPayment } = event.detail;
      
      if (lastPayment) {
        setRecentTransactions(prev => [
          {
            id: lastPayment.id,
            studentName: user?.name || 'Student',
            amount: lastPayment.amount,
            date: lastPayment.date,
            status: 'completed',
            paymentMethod: lastPayment.method,
          },
          ...prev.slice(0, 4)
        ]);
      }
      
      setStats(prev => ({
        ...prev,
        totalFeesPaid: totalPaid,
        pendingAmount: pendingAmount
      }));
      
      const currentMonth = new Date().getMonth();
      setFeeAnalytics(prev => {
        const updatedPaid = [...prev.paid];
        const updatedPending = [...prev.pending];
        
        if (lastPayment) {
          updatedPaid[currentMonth] += lastPayment.amount;
          updatedPending[currentMonth] -= lastPayment.amount;
        }
        
        return {
          ...prev,
          paid: updatedPaid,
          pending: updatedPending
        };
      });
    };
    
    const handleNewPayment = (event: CustomEvent) => {
      const { payment } = event.detail;
      
      setRecentTransactions(prev => [
        {
          id: payment.id,
          studentName: user?.name || 'Student',
          amount: payment.amount,
          date: payment.date,
          status: 'completed',
          paymentMethod: payment.method,
        },
        ...prev.slice(0, 4)
      ]);
    };
    
    const handleStudentPaymentCompleted = (event: CustomEvent) => {
      const { payment } = event.detail;
      
      if (user?.role === 'student') {
        setStudentDashboardData(prev => {
          const updatedUpcomingPayments = prev.upcomingPayments.filter(
            fee => fee.title !== payment.title
          );
          
          const newPendingAmount = updatedUpcomingPayments.reduce(
            (total, fee) => total + fee.amount, 
            0
          );
          
          const newTotalPaid = prev.totalFeesPaid + payment.amount;
          
          const wasOverdue = prev.upcomingPayments.find(
            fee => fee.title === payment.title && fee.status === 'due'
          );
          
          const newOverdueAmount = wasOverdue 
            ? prev.overdueAmount - payment.amount 
            : prev.overdueAmount;
          
          return {
            ...prev,
            totalFeesPaid: newTotalPaid,
            pendingAmount: newPendingAmount,
            overdueAmount: newOverdueAmount,
            completedPayments: prev.completedPayments + 1,
            upcomingPayments: updatedUpcomingPayments
          };
        });
      }
      
      if (payment) {
        setRecentTransactions(prev => [
          {
            id: `pay-${Date.now()}`,
            studentName: user?.name || 'Student',
            amount: payment.amount,
            date: payment.date,
            status: 'completed',
            paymentMethod: 'Online Payment',
          },
          ...prev.slice(0, 4)
        ]);
      }
      
      setStats(prev => ({
        ...prev,
        totalFeesPaid: prev.totalFeesPaid + payment.amount,
        pendingAmount: prev.pendingAmount - payment.amount
      }));
    };
    
    window.addEventListener('feePaymentUpdated', handleFeePaymentUpdate as EventListener);
    window.addEventListener('newPayment', handleNewPayment as EventListener);
    window.addEventListener('studentPaymentCompleted', handleStudentPaymentCompleted as EventListener);
    
    return () => {
      window.removeEventListener('feePaymentUpdated', handleFeePaymentUpdate as EventListener);
      window.removeEventListener('newPayment', handleNewPayment as EventListener);
      window.removeEventListener('studentPaymentCompleted', handleStudentPaymentCompleted as EventListener);
    };
  }, [user]);

  const combinedFeeData = feeAnalytics.months.map((month, index) => ({
    name: month,
    paid: feeAnalytics.paid[index],
    pending: feeAnalytics.pending[index],
  }));

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Completed</Badge>;
    } else if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">Pending</Badge>;
    } else if (status === 'approved') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Approved</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Failed</Badge>;
    }
  };

  const handleGenerateReport = () => {
    navigate('/reports');
    toast({
      title: "Reports Page Opened",
      description: "You can now generate various financial reports.",
    });
  };

  const handleInvestigateFraud = (alertId: string) => {
    navigate('/fraud-detection');
    toast({
      title: "Fraud Detection Page Opened",
      description: "You can now investigate fraud alerts.",
    });
  };

  const handlePayFees = () => {
    navigate('/payments');
    toast({
      title: "Payments Page Opened",
      description: "You can now make fee payments using various methods.",
    });
  };

  const handleViewStudents = () => {
    navigate('/students');
  };
  
  const handleApproveExpense = (id: string) => {
    setExpenseRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === id 
          ? { ...record, status: 'approved' } 
          : record
      )
    );
    
    toast({
      title: "Expense Approved",
      description: "The expense request has been approved.",
    });
  };
  
  const handleDenyExpense = (id: string) => {
    setExpenseRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === id 
          ? { ...record, status: 'denied' } 
          : record
      )
    );
    
    toast({
      title: "Expense Denied",
      description: "The expense request has been denied.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of {user?.role === 'admin' ? 'the institution\'s finances' : 'your finances'}.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {user?.role === 'admin' ? (
            <Button className="bg-edu-purple-400 hover:bg-edu-purple-500" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          ) : (
            <Button className="bg-edu-purple-400 hover:bg-edu-purple-500" onClick={handlePayFees}>
              Pay Fees
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fees Paid"
          value={formatCurrency(user?.role === 'admin' ? stats.totalFeesPaid : studentDashboardData.totalFeesPaid)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Pending Amount"
          value={formatCurrency(user?.role === 'admin' ? stats.pendingAmount : studentDashboardData.pendingAmount)}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 3.1, isPositive: false }}
        />
        <StatCard
          title={user?.role === 'admin' ? 'Total Students' : 'Overdue Amount'}
          value={user?.role === 'admin' ? stats.studentCount : formatCurrency(studentDashboardData.overdueAmount)}
          icon={user?.role === 'admin' ? <Users className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
          description={user?.role === 'admin' ? "Active enrollments" : `Due date: ${formatDate(studentDashboardData.nextDueDate)}`}
        />
        <StatCard
          title="Completed Payments"
          value={user?.role === 'admin' ? stats.completedPayments : studentDashboardData.completedPayments}
          icon={<FileBox className="h-5 w-5" />}
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      {user?.role === 'admin' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Fee Collection Analytics</CardTitle>
                <CardDescription>Monthly fee payment trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={combinedFeeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number)}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="paid" name="Fees Paid" fill="#9b87f5" />
                      <Bar dataKey="pending" name="Pending" fill="#F97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Budget vs. Actual Expenses</CardTitle>
                <CardDescription>Quarterly financial comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={budgetTrends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="budget" name="Planned Budget" stroke="#9b87f5" strokeWidth={2} />
                      <Line type="monotone" dataKey="actual" name="Actual Expenses" stroke="#1EAEDB" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Fee Distribution</CardTitle>
                <CardDescription>Category breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pending Refund Approvals</CardTitle>
                <CardDescription>Requests requiring your approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-edu-purple-200">
                            {approval.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{approval.studentName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Amount: {formatCurrency(approval.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reason: {approval.reason}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested on: {formatDate(approval.requestDate)}
                          </p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">Deny</Button>
                        <Button size="sm" className="bg-edu-purple-400 hover:bg-edu-purple-500">Approve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {user?.role === 'student' && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>Upcoming fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {studentDashboardData.upcomingPayments.length > 0 ? (
                studentDashboardData.upcomingPayments.map((fee) => (
                  <div 
                    key={fee.id}
                    className={`rounded-lg border p-4 ${
                      fee.status === 'due' 
                        ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{fee.title}</h4>
                        <p className="text-sm text-muted-foreground">Due: {formatDate(fee.dueDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(fee.amount)}</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-edu-purple-400 hover:bg-edu-purple-500"
                          onClick={handlePayFees}
                        >
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming fees due at this time.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
              <div className="col-span-5">Student</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                  <div className="col-span-5 flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-edu-purple-200">
                        {transaction.studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{transaction.studentName}</p>
                      <p className="text-xs text-muted-foreground">ID: {transaction.id}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-medium">
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="col-span-2 text-sm">{formatDate(transaction.date)}</div>
                  <div className="col-span-2">
                    <StatusBadge status={transaction.status} />
                  </div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {user?.role === 'admin' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Department Budget Allocation</CardTitle>
              <CardDescription>Monitoring budget utilization by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                  <div className="col-span-3">Department</div>
                  <div className="col-span-3">Allocated Budget</div>
                  <div className="col-span-2">Spent</div>
                  <div className="col-span-2">Remaining</div>
                  <div className="col-span-2">Utilization</div>
                </div>
                <div className="divide-y">
                  {departmentBudgets.map((budget, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-4 items-center">
                      <div className="col-span-3">
                        <p className="font-medium">{budget.department}</p>
                      </div>
                      <div className="col-span-3">
                        {formatCurrency(budget.allocated)}
                      </div>
                      <div className="col-span-2">
                        {formatCurrency(budget.spent)}
                      </div>
                      <div className="col-span-2">
                        {formatCurrency(budget.remaining)}
                      </div>
                      <div className="col-span-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              (budget.spent / budget.allocated) > 0.9 
                                ? 'bg-red-500' 
                                : (budget.spent / budget.allocated) > 0.7 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'
                            }`} 
                            style={{ width: `${(budget.spent / budget.allocated) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs mt-1 text-right">
                          {Math.round((budget.spent / budget.allocated) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Management</CardTitle>
              <CardDescription>Track and approve department expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
                  <TabsTrigger value="approved">Approved Expenses</TabsTrigger>
                  <TabsTrigger value="all">All Expenses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  <div className="space-y-4">
                    {expenseRecords.filter(record => record.status === 'pending').map(expense => (
                      <div key={expense.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{expense.department}</h4>
                            <p className="text-sm">{expense.description}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-muted-foreground">
                                Amount: {formatCurrency(expense.amount)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Requested: {formatDate(expense.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleDenyExpense(expense.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              Deny
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-edu-purple-400 hover:bg-edu-purple-500 flex items-center gap-1"
                              onClick={() => handleApproveExpense(expense.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {expenseRecords.filter(record => record.status === 'pending').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No pending expense requests.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="approved">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                      <div className="col-span-3">Department</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-3">Date</div>
                    </div>
                    <div className="divide-y">
                      {expenseRecords.filter(record => record.status === 'approved').map(expense => (
                        <div key={expense.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-3">{expense.department}</div>
                          <div className="col-span-4">{expense.description}</div>
                          <div className="col-span-2">{formatCurrency(expense.amount)}</div>
                          <div className="col-span-3">{formatDate(expense.date)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {expenseRecords.filter(record => record.status === 'approved').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No approved expenses yet.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                      <div className="col-span-2">Department</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-2">Status</div>
                    </div>
                    <div className="divide-y">
                      {expenseRecords.map(expense => (
                        <div key={expense.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-2">{expense.department}</div>
                          <div className="col-span-4">{expense.description}</div>
                          <div className="col-span-2">{formatCurrency(expense.amount)}</div>
                          <div className="col-span-2">{formatDate(expense.date)}</div>
                          <div className="col-span-2">
                            <StatusBadge status={expense.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle>Fraud Alerts</CardTitle>
              </div>
              <CardDescription>Potential security issues detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudAlerts.map((alert) => (
                  <div key={alert.id} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <SeverityBadge severity={alert.severity} />
                          <h4 className="font-medium">{alert.reason}</h4>
                        </div>
                        <p className="text-sm mt-1">Transaction ID: {alert.transactionId}</p>
                        <p className="text-sm">Amount: {formatCurrency(alert.amount)}</p>
                        <p className="text-sm">Date: {formatDate(alert.date)}</p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">Dismiss</Button>
                        <Button 
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleInvestigateFraud(alert.id)}
                        >
                          Investigate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const COLORS = ['#9b87f5', '#7E69AB', '#1EAEDB', '#F97316', '#D6BCFA'];

export default Dashboard;
