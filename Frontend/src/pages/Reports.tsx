
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText, FileSpreadsheet, PieChart, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, generatePdfReport, generateExcelReport } from '@/utils/formatters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const Reports = () => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [progress, setProgress] = useState(0);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [currentReport, setCurrentReport] = useState<string | null>(null);

  const generateReport = async (type: string) => {
    setGenerating(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      // Generate report based on selected format
      let result;
      if (reportFormat === 'pdf') {
        result = await generatePdfReport(type, { date: new Date() });
      } else {
        result = await generateExcelReport(type, { date: new Date() });
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setGenerating(false);
        setProgress(0);
        
        toast({
          title: "Report Generated",
          description: `Your ${type} report has been generated successfully in ${reportFormat.toUpperCase()} format.`,
        });
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      setGenerating(false);
      setProgress(0);
      
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handlePreviewReport = (type: string) => {
    setCurrentReport(type);
    setShowPreviewDialog(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-muted-foreground">
          Generate and download financial reports
        </p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">Report Format</p>
          <Select value={reportFormat} onValueChange={setReportFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {generating && (
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Generating Report...</p>
            <Progress value={progress} className="h-2.5" />
          </div>
        )}
      </div>

      <Tabs defaultValue="financial">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial Summary</TabsTrigger>
          <TabsTrigger value="student">Student Payments</TabsTrigger>
          <TabsTrigger value="expense">Expense Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Financial Summary</CardTitle>
                <CardDescription>Overview of monthly finances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(1250000)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-right">Period</p>
                      <p className="text-sm text-muted-foreground">Mar 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewReport('monthly financial')}
                      disabled={generating}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      className="flex-1 bg-edu-purple-400 hover:bg-edu-purple-500" 
                      onClick={() => generateReport('monthly financial')}
                      disabled={generating}
                    >
                      {generating ? (
                        <>Generating...</>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quarterly Financial Summary</CardTitle>
                <CardDescription>Overview of quarterly finances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(3750000)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-right">Period</p>
                      <p className="text-sm text-muted-foreground">Q1 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewReport('quarterly financial')}
                      disabled={generating}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      className="flex-1 bg-edu-purple-400 hover:bg-edu-purple-500" 
                      onClick={() => generateReport('quarterly financial')}
                      disabled={generating}
                    >
                      {generating ? (
                        <>Generating...</>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="student" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Payment Reports</CardTitle>
              <CardDescription>Reports on student fee payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="h-24 flex flex-col items-center justify-center">
                        <PieChart className="h-8 w-8 mb-2 text-edu-purple-400" />
                        <span className="font-medium">Paid Fees Report</span>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreviewReport('paid fees')}>
                            <FileText className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm" onClick={() => generateReport('paid fees')}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="h-24 flex flex-col items-center justify-center">
                        <BarChart className="h-8 w-8 mb-2 text-edu-purple-400" />
                        <span className="font-medium">Pending Fees Report</span>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreviewReport('pending fees')}>
                            <FileText className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm" onClick={() => generateReport('pending fees')}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="h-24 flex flex-col items-center justify-center">
                        <Calendar className="h-8 w-8 mb-2 text-edu-purple-400" />
                        <span className="font-medium">Overdue Fees Report</span>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreviewReport('overdue fees')}>
                            <FileText className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm" onClick={() => generateReport('overdue fees')}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expense" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Reports</CardTitle>
              <CardDescription>Reports on institutional expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="h-24 flex flex-col items-center justify-center">
                        <Calendar className="h-8 w-8 mb-2 text-edu-purple-400" />
                        <span className="font-medium">Monthly Expenses</span>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreviewReport('monthly expense')}>
                            <FileText className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm" onClick={() => generateReport('monthly expense')}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="h-24 flex flex-col items-center justify-center">
                        <Calendar className="h-8 w-8 mb-2 text-edu-purple-400" />
                        <span className="font-medium">Quarterly Expenses</span>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreviewReport('quarterly expense')}>
                            <FileText className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm" onClick={() => generateReport('quarterly expense')}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="h-24 flex flex-col items-center justify-center">
                        <PieChart className="h-8 w-8 mb-2 text-edu-purple-400" />
                        <span className="font-medium">Expenses by Category</span>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreviewReport('category expense')}>
                            <FileText className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm" onClick={() => generateReport('category expense')}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Create tailored reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <Select defaultValue="financial">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="student">Student Payments</SelectItem>
                        <SelectItem value="salary">Salary Reports</SelectItem>
                        <SelectItem value="expense">Expense Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Time Period</label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-edu-purple-400 hover:bg-edu-purple-500" 
                  onClick={() => generateReport('custom')}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Custom Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Report Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="capitalize">{currentReport} Report Preview</DialogTitle>
            <DialogDescription>
              This is a preview of your report. You can download it for a complete view.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 min-h-[300px] flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium capitalize">{currentReport} Report</h3>
              <p className="text-sm text-muted-foreground">
                This is a preview of the report. In a real application, 
                this would display charts, tables and visualizations of the data.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              generateReport(currentReport || 'report');
              setShowPreviewDialog(false);
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
