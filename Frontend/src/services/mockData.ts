
// Mock data service to simulate API calls

// Dashboard statistics
export const getDashboardStats = () => {
  return {
    totalFeesPaid: 128500,
    pendingAmount: 35000,
    overdueAmount: 12500,
    nextDueDate: '2023-04-15',
    studentCount: 1250,
    completedPayments: 345,
    pendingPayments: 78,
  };
};

// Chart data
export const getFeeAnalytics = () => {
  return {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    paid: [12000, 15000, 13500, 14000, 16500, 17000, 16000, 15500, 18000, 19500, 21000, 20000],
    pending: [3000, 3500, 4000, 3200, 2800, 3300, 3700, 3900, 4200, 3800, 3600, 4000],
  };
};

export const getExpenseBreakdown = () => {
  return [
    { name: 'Tuition', value: 65 },
    { name: 'Facilities', value: 15 },
    { name: 'Books', value: 10 },
    { name: 'Activities', value: 7 },
    { name: 'Others', value: 3 },
  ];
};

export const getBudgetTrends = () => {
  return [
    { name: 'Q1', budget: 150000, actual: 142000 },
    { name: 'Q2', budget: 160000, actual: 158000 },
    { name: 'Q3', budget: 170000, actual: 175000 },
    { name: 'Q4', budget: 180000, actual: 168000 },
  ];
};

// Transactions
export const getRecentTransactions = () => {
  return [
    {
      id: 'tx-001',
      studentName: 'Alice Johnson',
      amount: 12500,
      date: '2023-03-28',
      status: 'completed',
      paymentMethod: 'credit_card',
    },
    {
      id: 'tx-002',
      studentName: 'Bob Smith',
      amount: 15000,
      date: '2023-03-27',
      status: 'completed',
      paymentMethod: 'upi',
    },
    {
      id: 'tx-003',
      studentName: 'Charlie Brown',
      amount: 9500,
      date: '2023-03-25',
      status: 'completed',
      paymentMethod: 'bank_transfer',
    },
    {
      id: 'tx-004',
      studentName: 'David Wilson',
      amount: 18000,
      date: '2023-03-22',
      status: 'completed',
      paymentMethod: 'credit_card',
    },
    {
      id: 'tx-005',
      studentName: 'Eva Martinez',
      amount: 8500,
      date: '2023-03-20',
      status: 'failed',
      paymentMethod: 'credit_card',
    },
  ];
};

// Student-specific data
export const getStudentFeeDetails = () => {
  return {
    tuitionFee: 85000,
    libraryFee: 5000,
    examFee: 10000,
    sportsFee: 7500,
    transportFee: 12000,
    totalFee: 119500,
    paid: 85000,
    pending: 34500,
    dueDate: '2023-04-15',
  };
};

// Admin-specific data
export const getPendingApprovals = () => {
  return [
    {
      id: 'ref-001',
      studentName: 'Grace Lee',
      amount: 8500,
      requestDate: '2023-03-26',
      reason: 'Duplicate payment',
    },
    {
      id: 'ref-002',
      studentName: 'Henry Davis',
      amount: 12000,
      requestDate: '2023-03-24',
      reason: 'Course dropped',
    },
    {
      id: 'ref-003',
      studentName: 'Isla Robinson',
      amount: 6500,
      requestDate: '2023-03-21',
      reason: 'Excess payment',
    },
  ];
};

// Fraud alerts
export const getFraudAlerts = () => {
  return [
    {
      id: 'alert-001',
      transactionId: 'tx-098',
      amount: 25000,
      date: '2023-03-28',
      reason: 'Unusual large payment',
      severity: 'medium',
    },
    {
      id: 'alert-002',
      transactionId: 'tx-099',
      amount: 15000,
      date: '2023-03-27',
      reason: 'Multiple failed attempts',
      severity: 'high',
    },
    {
      id: 'alert-003',
      transactionId: 'tx-100',
      amount: 12000,
      date: '2023-03-26',
      reason: 'Suspicious IP address',
      severity: 'low',
    },
  ];
};

// Fee predictions
export const getFeePredictions = () => {
  return {
    currentTuition: 85000,
    nextYearPrediction: 92000,
    twoYearPrediction: 98500,
    inflationRate: 7.5,
    confidenceScore: 85,
  };
};
