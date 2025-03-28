
import React, { useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Printer, FileDown, Mail, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SalarySlipViewerProps {
  slipData: {
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
  };
  onClose: () => void;
}

const SalarySlipViewer: React.FC<SalarySlipViewerProps> = ({ slipData, onClose }) => {
  const { toast } = useToast();
  const slipRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    // Open print dialog
    window.print();
    
    toast({
      title: "Print Requested",
      description: "Your browser's print dialog should be open now.",
    });
  };
  
  const handleDownloadPDF = async () => {
    if (!slipRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your download.",
    });
    
    try {
      const canvas = await html2canvas(slipRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`salary-slip-${slipData.staffDetails.name}-${slipData.salaryMonth}-${slipData.salaryYear}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your salary slip has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEmailSlip = () => {
    toast({
      title: "Email Sent",
      description: `Salary slip has been emailed to ${slipData.staffDetails.email}`,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Salary Slip</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6" ref={slipRef}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-edu-purple-500">EduFinFlare</h1>
            <p className="text-muted-foreground">Education Financial Management</p>
            <h2 className="text-xl font-semibold mt-4">Salary Slip</h2>
            <p className="text-muted-foreground">
              For the month of {slipData.salaryMonth}, {slipData.salaryYear}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-muted-foreground">Employee Information</h3>
              <div className="border rounded-md p-4 space-y-1">
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="col-span-2 font-medium">{slipData.staffDetails.name}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Employee ID:</span>
                  <span className="col-span-2">{slipData.staffDetails.id}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Designation:</span>
                  <span className="col-span-2">{slipData.staffDetails.role}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="col-span-2">{slipData.staffDetails.department}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Join Date:</span>
                  <span className="col-span-2">{formatDate(slipData.staffDetails.joinDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-muted-foreground">Payment Information</h3>
              <div className="border rounded-md p-4 space-y-1">
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Slip ID:</span>
                  <span className="col-span-2">{slipData.slipId}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Pay Period:</span>
                  <span className="col-span-2">{slipData.salaryMonth}, {slipData.salaryYear}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span className="col-span-2">{formatDate(slipData.paymentDate)}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="col-span-2">HDFC Bank</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="col-span-2">XXXX XXXX 1234</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-muted-foreground">Earnings</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">Basic Salary</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.earnings.basicSalary)}</td>
                    </tr>
                    <tr>
                      <td className="p-3">House Rent Allowance (HRA)</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.earnings.hra)}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Dearness Allowance (DA)</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.earnings.da)}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Transport Allowance</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.earnings.ta)}</td>
                    </tr>
                    <tr className="font-semibold bg-gray-50 dark:bg-gray-800">
                      <td className="p-3">Gross Salary</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.grossSalary)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-muted-foreground">Deductions</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">Provident Fund (PF)</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.deductions.pf)}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Professional Tax</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.deductions.professionalTax)}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Income Tax (TDS)</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.deductions.tds)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 h-[37px]"></td>
                      <td className="p-3"></td>
                    </tr>
                    <tr className="font-semibold bg-gray-50 dark:bg-gray-800">
                      <td className="p-3">Total Deductions</td>
                      <td className="text-right p-3">{formatCurrency(slipData.salaryComponents.totalDeductions)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="bg-edu-purple-50 dark:bg-edu-purple-900/20 border border-edu-purple-200 dark:border-edu-purple-800 rounded-md p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Net Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(slipData.salaryComponents.netSalary)}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">In Words</p>
                <p className="font-medium">Rupees {convertToWords(slipData.salaryComponents.netSalary)} Only</p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>This is a computer-generated salary slip and does not require signature.</p>
            <p>Generated on: {formatDate(slipData.slipGeneratedOn)}</p>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t flex justify-end space-x-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleEmailSlip}>
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          <Button 
            className="bg-edu-purple-400 hover:bg-edu-purple-500 flex items-center gap-2"
            onClick={handleDownloadPDF}
          >
            <FileDown className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert number to words
function convertToWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
                'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const numString = amount.toFixed(2);
  const [rupees, paise] = numString.split('.');
  const rupeesNum = parseInt(rupees);
  
  if (rupeesNum === 0) return 'Zero';
  
  function convertLessThanOneThousand(num: number): string {
    if (num === 0) return '';
    
    if (num < 20) {
      return ones[num] + ' ';
    }
    
    if (num < 100) {
      return tens[Math.floor(num / 10)] + ' ' + convertLessThanOneThousand(num % 10);
    }
    
    return ones[Math.floor(num / 100)] + ' Hundred ' + convertLessThanOneThousand(num % 100);
  }
  
  let result = '';
  
  // Handle crores
  if (rupeesNum >= 10000000) {
    result += convertLessThanOneThousand(Math.floor(rupeesNum / 10000000)) + 'Crore ';
  }
  
  // Handle lakhs
  if (rupeesNum >= 100000) {
    result += convertLessThanOneThousand(Math.floor((rupeesNum % 10000000) / 100000)) + 'Lakh ';
  }
  
  // Handle thousands
  if (rupeesNum >= 1000) {
    result += convertLessThanOneThousand(Math.floor((rupeesNum % 100000) / 1000)) + 'Thousand ';
  }
  
  // Handle remaining
  result += convertLessThanOneThousand(rupeesNum % 1000);
  
  return result.trim();
}

export default SalarySlipViewer;
