export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const maskAccountNumber = (accountNumber: string) => {
  if (!accountNumber) return '';
  const last4 = accountNumber.slice(-4);
  return '•'.repeat(accountNumber.length - 4) + last4;
};

export const generateTransactionId = (prefix = 'TXN') => {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  const timestamp = new Date().getTime().toString().slice(-6);
  return `${prefix}-${randomPart}-${timestamp}`;
};

export const calculatePercentageChange = (oldValue: number, newValue: number) => {
  if (oldValue === 0) return 100; // If old value is 0, we consider it 100% increase
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

export const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const updateStudentDashboardStats = (
  payment: {
    amount: number;
    title: string;
    date: string;
  }
) => {
  window.dispatchEvent(new CustomEvent('studentPaymentCompleted', { 
    detail: { 
      payment
    } 
  }));
};

export const fetchStudentData = async (studentId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: studentId,
        name: 'Student Name',
        // ... other student data
      });
    }, 500);
  });
};

export const generatePdfReport = (reportType: string, data: any) => {
  console.log(`Generating ${reportType} PDF report with data:`, data);
  
  // In a real implementation, this would create and download a PDF
  // using a library like jsPDF
  
  // Simulate PDF generation delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        reportUrl: '#',
        message: `${reportType} report generated successfully`
      });
    }, 1000);
  });
};

export const generateExcelReport = (reportType: string, data: any) => {
  console.log(`Generating ${reportType} Excel report with data:`, data);
  
  // In a real implementation, this would create and download an Excel file
  // using a library like xlsx
  
  // Simulate Excel generation delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        reportUrl: '#',
        message: `${reportType} report generated successfully`
      });
    }, 1000);
  });
};
