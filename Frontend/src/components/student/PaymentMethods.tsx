
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Landmark, Smartphone, QrCode, CreditCardIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, generateTransactionId, updateStudentDashboardStats } from '@/utils/formatters';
import QrCodePayment from './QrCodePayment';
import RazorpayPayment from './RazorpayPayment';

interface PaymentMethodsProps {
  amount: number;
  feeTitle: string;
  onPaymentSuccess?: (paymentInfo: {
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
  }) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  amount, 
  feeTitle,
  onPaymentSuccess
}) => {
  const { toast } = useToast();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handlePayment = (method: string) => {
    setProcessingPayment(true);
    
    const paymentDetails = {
      cardNumber: method === 'card' ? cardNumber : undefined,
      upiId: method === 'upi' ? upiId : undefined,
      bankName: ['sbi', 'hdfc', 'icici', 'axis', 'pnb', 'bob'].includes(method) ? getMethodDisplayName(method) : undefined,
      accountLastFour: ['sbi', 'hdfc', 'icici', 'axis', 'pnb', 'bob'].includes(method) ? 
        (Math.floor(1000 + Math.random() * 9000)).toString() : undefined,
    };
    
    // Create payment info with transaction details
    const paymentInfo = {
      method: getMethodDisplayName(method),
      transactionId: generateTransactionId(),
      amount: amount,
      date: new Date().toISOString(),
      details: paymentDetails
    };
    
    // Mock payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      toast({
        title: "Payment Successful",
        description: `You have successfully paid ${formatCurrency(amount)} for ${feeTitle} using ${paymentInfo.method}`,
      });
      
      // Update student dashboard stats
      updateStudentDashboardStats({
        amount: amount,
        title: feeTitle,
        date: paymentInfo.date
      });
      
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentInfo);
      }
      
      // Reset form fields
      setCardNumber('');
      setNameOnCard('');
      setExpiryDate('');
      setCvv('');
      setUpiId('');
      setSelectedBank('');
    }, 2000);
  };

  const getMethodDisplayName = (method: string): string => {
    switch (method) {
      case 'card': return 'Credit Card';
      case 'upi': return 'UPI';
      case 'qrcode': return 'QR Code (UPI)';
      case 'razorpay': return 'Razorpay';
      case 'sbi': return 'Net Banking (SBI)';
      case 'hdfc': return 'Net Banking (HDFC)';
      case 'icici': return 'Net Banking (ICICI)';
      case 'axis': return 'Net Banking (Axis)';
      case 'pnb': return 'Net Banking (PNB)';
      case 'bob': return 'Net Banking (BoB)';
      default: return method;
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedMethod(value);
  };

  const handleBankSelection = (bank: string) => {
    setSelectedMethod(bank.toLowerCase());
    setSelectedBank(bank);
    handlePayment(bank.toLowerCase());
  };

  const handleQrPaymentSuccess = (paymentInfo: any) => {
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentInfo);
    }
  };

  const handleRazorpayPaymentSuccess = (paymentInfo: any) => {
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentInfo);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pay {feeTitle}</CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger value="upi" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>UPI</span>
            </TabsTrigger>
            <TabsTrigger value="qrcode" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="razorpay" className="flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4" />
              <span>Razorpay</span>
            </TabsTrigger>
            <TabsTrigger value="netbanking" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              <span>Net Banking</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input 
                    id="card-number" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-on-card">Name on Card</Label>
                  <Input 
                    id="name-on-card" 
                    placeholder="John Doe" 
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    type="password" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upi" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input 
                id="upi-id" 
                placeholder="your-upi@bank" 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Pay using your UPI apps like Google Pay, PhonePe, Paytm, etc.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="qrcode" className="pt-4">
            <QrCodePayment 
              amount={amount} 
              feeTitle={feeTitle} 
              onPaymentSuccess={handleQrPaymentSuccess}
            />
          </TabsContent>
          
          <TabsContent value="razorpay" className="pt-4">
            <RazorpayPayment
              amount={amount}
              feeTitle={feeTitle}
              onPaymentSuccess={handleRazorpayPaymentSuccess}
            />
          </TabsContent>
          
          <TabsContent value="netbanking" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["SBI", "HDFC", "ICICI", "Axis", "PNB", "BoB"].map((bank) => (
                <Button 
                  key={bank} 
                  variant="outline" 
                  className={`h-16 flex flex-col justify-center ${selectedBank === bank ? 'border-edu-purple-400 bg-edu-purple-50' : ''}`}
                  onClick={() => handleBankSelection(bank)}
                >
                  <Landmark className="h-5 w-5 mb-1" />
                  <span className="text-xs">{bank}</span>
                </Button>
              ))}
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="other-bank">Other Banks</Label>
              <select 
                id="other-bank" 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select Bank</option>
                <option value="kotak">Kotak Mahindra</option>
                <option value="idfc">IDFC First</option>
                <option value="federal">Federal Bank</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="font-bold text-lg">
          Amount: {formatCurrency(amount)}
        </div>
        {selectedMethod !== 'qrcode' && selectedMethod !== 'razorpay' && (
          <Button 
            onClick={() => handlePayment(selectedMethod)} 
            className="bg-edu-purple-400 hover:bg-edu-purple-500"
            disabled={processingPayment}
          >
            {processingPayment ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentMethods;
