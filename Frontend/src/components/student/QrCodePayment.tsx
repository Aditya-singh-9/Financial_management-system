
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw, Share2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface QrCodePaymentProps {
  amount: number;
  feeTitle: string;
  onPaymentSuccess?: (paymentInfo: any) => void;
}

const QrCodePayment: React.FC<QrCodePaymentProps> = ({ 
  amount, 
  feeTitle,
  onPaymentSuccess 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Generate QR code for payment
  const handleGenerateQR = () => {
    if (!upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID to generate a QR code",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // In a real application, this would call a backend API to generate a QR code
    // For demo purposes, we'll use a placeholder QR code after a delay
    setTimeout(() => {
      // Create UPI payment link
      const upiLink = `upi://pay?pa=${upiId}&pn=EduFinFlare&am=${amount}&cu=INR&tn=${encodeURIComponent(feeTitle)}`;
      
      // Generate QR code using a public API
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
      
      setQrCodeUrl(qrCodeApiUrl);
      setQrGenerated(true);
      setIsGenerating(false);
      
      toast({
        title: "QR Code Generated",
        description: "Scan this QR code with any UPI app to complete payment",
      });
    }, 1500);
  };
  
  // Simulate download QR code
  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `payment-qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been saved to your device",
    });
  };
  
  // Simulate sharing QR code
  const handleShareQR = () => {
    // In a real application, this would use the Web Share API if available
    toast({
      title: "Share QR Code",
      description: "Sharing functionality would be implemented here",
    });
  };
  
  // Simulate payment verification
  const handleVerifyPayment = () => {
    setIsVerifying(true);
    
    // In a real application, this would poll a backend API to check payment status
    // For demo purposes, we'll simulate success after a delay
    setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
      
      toast({
        title: "Payment Verified",
        description: `Your payment of ${formatCurrency(amount)} has been received`,
      });
      
      if (onPaymentSuccess) {
        onPaymentSuccess({
          method: "UPI (QR Code)",
          transactionId: `UPI${Date.now()}`,
          amount: amount,
          date: new Date().toISOString(),
          details: {
            upiId: upiId
          }
        });
      }
    }, 2000);
  };
  
  // Regenerate QR code (e.g. if expired)
  const handleRegenerateQR = () => {
    setQrGenerated(false);
    setQrCodeUrl('');
    setIsVerified(false);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>UPI QR Code Payment</CardTitle>
        <CardDescription>Pay {formatCurrency(amount)} for {feeTitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {!qrGenerated ? (
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="upi-id">Your UPI ID</Label>
              <div className="flex space-x-2">
                <Input 
                  id="upi-id" 
                  placeholder="yourname@bank" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <Button 
                  onClick={handleGenerateQR} 
                  disabled={isGenerating || !upiId}
                  className="bg-edu-purple-400 hover:bg-edu-purple-500 whitespace-nowrap"
                >
                  {isGenerating ? 'Generating...' : 'Generate QR'}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-6 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                {isGenerating ? (
                  <div className="animate-pulse">
                    <div className="h-40 w-40 bg-gray-300 dark:bg-gray-700 rounded-md mx-auto"></div>
                    <p className="mt-4">Generating QR code...</p>
                  </div>
                ) : (
                  <p>Enter your UPI ID and generate a QR code to pay</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full flex flex-col items-center">
            {isVerified ? (
              <div className="text-center">
                <div className="h-20 w-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Payment Successful</h3>
                <p className="text-muted-foreground mt-1">Your payment has been verified</p>
                <p className="font-medium mt-4">Amount: {formatCurrency(amount)}</p>
                <p className="text-sm text-muted-foreground">Payment Method: UPI</p>
                <p className="text-sm text-muted-foreground">UPI ID: {upiId}</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-2 rounded-md border">
                  <img 
                    src={qrCodeUrl} 
                    alt="Payment QR Code" 
                    className="h-52 w-52 object-contain"
                  />
                </div>
                
                <div className="space-y-2 w-full">
                  <p className="text-center text-sm">Scan this QR code with any UPI app</p>
                  <div className="flex space-x-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-1"
                      onClick={handleDownloadQR}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-1"
                      onClick={handleShareQR}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center"
                      onClick={handleRegenerateQR}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleVerifyPayment} 
                  className="w-full bg-edu-purple-400 hover:bg-edu-purple-500"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'I have completed the payment'}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Note: In a real application, payment verification would happen automatically.
                  For this demo, click the button after completing payment.
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Payment for: {feeTitle}</div>
        <div>Amount: {formatCurrency(amount)}</div>
      </CardFooter>
    </Card>
  );
};

export default QrCodePayment;
