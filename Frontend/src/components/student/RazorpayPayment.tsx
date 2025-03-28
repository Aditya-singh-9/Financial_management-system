
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { RazorpayService } from '@/services/razorpay';
import { CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';

interface RazorpayPaymentProps {
  amount: number;
  feeTitle: string;
  onPaymentSuccess?: (paymentInfo: any) => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ 
  amount, 
  feeTitle,
  onPaymentSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phone, setPhone] = useState('');
  
  const handlePayment = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await RazorpayService.makePayment({
        amount: amount,
        feeTitle: feeTitle,
        studentName: user?.name || 'Student',
        email: user?.email,
        phone: phone,
        onSuccess: (response) => {
          console.log("Payment successful:", response);
          
          setIsProcessing(false);
          setIsSuccess(true);
          
          toast({
            title: "Payment Successful",
            description: `You have successfully paid ${formatCurrency(amount)} for ${feeTitle}`,
          });
          
          // Create payment object
          const paymentInfo = {
            method: "Razorpay",
            transactionId: response.razorpay_payment_id,
            amount: amount,
            date: new Date().toISOString(),
            details: {
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            }
          };
          
          if (onPaymentSuccess) {
            onPaymentSuccess(paymentInfo);
          }
        },
        onFailure: (error) => {
          console.error("Payment failed:", error);
          
          setIsProcessing(false);
          
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      
      setIsProcessing(false);
      
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Razorpay Payment
        </CardTitle>
        <CardDescription>Secure online payment powered by Razorpay</CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-800/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-muted-foreground mt-2">
              Your payment of {formatCurrency(amount)} for {feeTitle} has been processed successfully.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-edu-purple-50 dark:bg-edu-purple-900/20 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount:</span>
                <span className="text-xl font-bold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Fee:</span>
                <span className="text-muted-foreground">{feeTitle}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="Enter your 10-digit phone number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Your phone number will be used for payment verification
              </p>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={handlePayment} 
                className="w-full bg-edu-purple-400 hover:bg-edu-purple-500 flex items-center justify-center gap-2"
                disabled={isProcessing}
              >
                <DollarSign className="h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
            
            <div className="flex justify-center mt-4">
              <img 
                src="https://razorpay.com/assets/razorpay-glyph.svg" 
                alt="Razorpay" 
                className="h-6"
              />
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Note: In a real application, this would integrate with the actual Razorpay API.
              For this demo, we simulate the Razorpay checkout experience.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Secure Payment</div>
        <div>Powered by Razorpay</div>
      </CardFooter>
    </Card>
  );
};

export default RazorpayPayment;
