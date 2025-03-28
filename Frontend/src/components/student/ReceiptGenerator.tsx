
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReceiptGeneratorProps {
  paymentData: {
    id: string;
    feeTitle: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    transactionId: string;
  };
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ paymentData }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (receiptRef.current) {
      // Set a loading toast
      toast({
        title: "Generating PDF",
        description: "Please wait while your receipt is being generated...",
      });

      try {
        // Use html2canvas to capture the receipt element
        const canvas = await html2canvas(receiptRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Save the PDF with a specific name
        const fileName = `receipt-${paymentData.id}.pdf`;
        pdf.save(fileName);
        
        // Notify user of success
        toast({
          title: "Receipt Downloaded",
          description: `Your receipt has been successfully downloaded as ${fileName}`,
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Download Failed",
          description: "There was an error generating your receipt. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="print:block" ref={receiptRef}>
        <Card className="border-2 border-gray-200 print:border-none">
          <CardHeader className="border-b bg-muted/50 print:bg-transparent">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-edu-purple-500">Payment Receipt</CardTitle>
                <CardDescription>Official payment confirmation</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-edu-purple-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">EF</span>
                </div>
                <span className="font-bold text-lg">EduFinFlare</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Receipt No.</h3>
                <p className="font-medium">{paymentData.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                <p className="font-medium">{formatDate(paymentData.paymentDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Student Name</h3>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Student ID</h3>
                <p className="font-medium">{user?.id || 'STU-12345'}</p>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                <div className="col-span-6">Description</div>
                <div className="col-span-6 text-right">Amount</div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-12 gap-2 items-center py-2">
                  <div className="col-span-6">
                    <p className="font-medium">{paymentData.feeTitle}</p>
                  </div>
                  <div className="col-span-6 text-right font-medium">
                    {formatCurrency(paymentData.amount)}
                  </div>
                </div>
              </div>
              <div className="border-t p-4 bg-muted/20">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6 font-bold">
                    Total
                  </div>
                  <div className="col-span-6 text-right font-bold text-lg">
                    {formatCurrency(paymentData.amount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                <p className="font-medium">{paymentData.paymentMethod}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
                <p className="font-medium">{paymentData.transactionId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Transaction Status</h3>
                <p className="font-medium text-green-600">Completed</p>
              </div>
            </div>

            <div className="border-t pt-4 text-center text-sm text-muted-foreground">
              <p>This is a computer-generated receipt and does not require a physical signature.</p>
              <p>For any queries, please contact the finance department.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-3 print:hidden">
        <Button onClick={handleDownloadPDF} className="bg-edu-purple-400 hover:bg-edu-purple-500 flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={handlePrint} className="flex-1">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
