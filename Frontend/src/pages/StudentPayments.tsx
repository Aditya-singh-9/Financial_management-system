
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, AlertTriangle, FileText } from 'lucide-react';
import PaymentMethods from '@/components/student/PaymentMethods';
import ReceiptGenerator from '@/components/student/ReceiptGenerator';
import { formatCurrency, formatDate, generateTransactionId, updateStudentDashboardStats } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Fee {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface Payment {
  id: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  status: string;
  transactionId?: string;
  details?: {
    cardNumber?: string;
    upiId?: string;
    bankName?: string;
    accountLastFour?: string;
  };
}

interface ReceiptData {
  id: string;
  feeTitle: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  details?: {
    cardNumber?: string;
    upiId?: string;
    bankName?: string;
    accountLastFour?: string;
  };
}

const StudentPayments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State management
  const [selectedFee, setSelectedFee] = useState<null | Fee>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<null | ReceiptData>(null);
  
  // Updated state for fees and payments that can be modified
  const [upcomingFees, setUpcomingFees] = useState<Fee[]>([
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
  ]);
  
  const [recentPayments, setRecentPayments] = useState<Payment[]>([
    {
      id: 'pay-1',
      title: 'Term 2 Tuition Fee',
      amount: 35000,
      date: '2023-01-10',
      method: 'UPI (Google Pay)',
      status: 'completed',
      transactionId: 'TXN-123456-789012'
    },
    {
      id: 'pay-2',
      title: 'Library Fee',
      amount: 5000,
      date: '2022-12-15',
      method: 'Credit Card',
      status: 'completed',
      transactionId: 'TXN-234567-890123'
    },
    {
      id: 'pay-3',
      title: 'Sports Fee',
      amount: 8000,
      date: '2022-12-05',
      method: 'Net Banking',
      status: 'completed',
      transactionId: 'TXN-345678-901234'
    },
  ]);

  // Track total fee amount and paid amount
  const [totalFeeAmount, setTotalFeeAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  
  // Calculate totals on component mount and when payments/fees change
  useEffect(() => {
    const feeTotal = upcomingFees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidTotal = recentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    setTotalFeeAmount(feeTotal);
    setTotalPaidAmount(paidTotal);
    
    // Update global data (in an actual app, this would call an API)
    // Since we don't have a real DB, we simulate this for now
    window.dispatchEvent(new CustomEvent('feePaymentUpdated', { 
      detail: { 
        totalPaid: paidTotal,
        pendingAmount: feeTotal,
        lastPayment: recentPayments[0] || null
      } 
    }));
  }, [upcomingFees, recentPayments]);

  const handleViewReceipt = (payment: Payment) => {
    setReceiptData({
      id: payment.id,
      feeTitle: payment.title,
      amount: payment.amount,
      paymentDate: payment.date,
      paymentMethod: payment.method,
      transactionId: payment.transactionId || generateTransactionId(),
      details: payment.details
    });
    setShowReceipt(true);
    setSelectedFee(null);
  };
  
  const handlePayFee = (fee: Fee) => {
    setSelectedFee(fee);
    setShowReceipt(false);
  };
  
  const handleBack = () => {
    setSelectedFee(null);
    setShowReceipt(false);
  };

  const handlePaymentSuccess = (paymentInfo: {
    method: string;
    transactionId: string;
    amount: number;
    date: string;
    details: {
      cardNumber?: string;
      upiId?: string;
      bankName?: string;
      accountLastFour?: string;
    };
  }) => {
    if (!selectedFee) return;
    
    // Create receipt data for the newly paid fee
    const newReceiptData: ReceiptData = {
      id: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      feeTitle: selectedFee.title,
      amount: selectedFee.amount,
      paymentDate: paymentInfo.date,
      paymentMethod: paymentInfo.method,
      transactionId: paymentInfo.transactionId,
      details: paymentInfo.details
    };
    
    // Add the payment to recent payments
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      title: selectedFee.title,
      amount: selectedFee.amount,
      date: paymentInfo.date,
      method: paymentInfo.method,
      status: 'completed',
      transactionId: paymentInfo.transactionId,
      details: paymentInfo.details
    };
    
    setRecentPayments([newPayment, ...recentPayments]);
    
    // Remove the fee from upcoming fees
    setUpcomingFees(upcomingFees.filter(fee => fee.id !== selectedFee.id));
    
    // Show the receipt
    setReceiptData(newReceiptData);
    setShowReceipt(true);
    setSelectedFee(null);
    
    // Update the UI with a toast
    toast({
      title: "Payment Successful",
      description: `You have successfully paid ${formatCurrency(selectedFee.amount)} for ${selectedFee.title}.`,
    });
    
    // Update student dashboard as well
    updateStudentDashboardStats({
      amount: selectedFee.amount,
      title: selectedFee.title,
      date: paymentInfo.date
    });
    
    // Broadcast the payment event for other components to react
    window.dispatchEvent(new CustomEvent('newPayment', { 
      detail: { 
        payment: newPayment,
        feeId: selectedFee.id
      } 
    }));
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Fee Payments</h1>
        <p className="text-muted-foreground">
          Manage your fee payments and view payment history
        </p>
      </div>
      
      {/* Payment Summary Card */}
      {!selectedFee && !showReceipt && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Your overall fee status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total Paid</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalPaidAmount)}
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Pending Amount</div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(totalFeeAmount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showReceipt && receiptData ? (
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-4"
          >
            &larr; Back to Fee List
          </Button>
          
          <ReceiptGenerator paymentData={receiptData} />
        </div>
      ) : selectedFee ? (
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-4"
          >
            &larr; Back to Fee List
          </Button>
          
          <PaymentMethods 
            amount={selectedFee.amount} 
            feeTitle={selectedFee.title}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Fees */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Fees</CardTitle>
                  <CardDescription>Due and upcoming payments</CardDescription>
                </div>
                {upcomingFees.some(fee => fee.status === 'due') && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>{upcomingFees.filter(fee => fee.status === 'due').length} Due Soon</span>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {upcomingFees.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {upcomingFees.map((fee) => (
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
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {formatDate(fee.dueDate)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(fee.amount)}</p>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-edu-purple-400 hover:bg-edu-purple-500"
                            onClick={() => handlePayFee(fee)}
                          >
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming fees due at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of your previous payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                      <div className="col-span-5">
                        <p className="font-medium">{payment.title}</p>
                        <p className="text-xs text-muted-foreground">{payment.method}</p>
                        <p className="text-xs text-muted-foreground">TX: {payment.transactionId}</p>
                        {payment.details?.bankName && (
                          <p className="text-xs text-muted-foreground">
                            {payment.details.bankName} 
                            {payment.details.accountLastFour && ` (${payment.details.accountLastFour})`}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="col-span-3 text-sm">{formatDate(payment.date)}</div>
                      <div className="col-span-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleViewReceipt(payment)}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>Your saved payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border rounded-md p-4">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 mr-4 text-edu-purple-400" />
                    <div>
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-muted-foreground">**** **** **** 4258</p>
                    </div>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;
