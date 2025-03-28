
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle2, Eye, Filter, ShieldAlert, ArrowDownToLine, AlertOctagon } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getFraudAlerts } from '@/services/mockData';
import SeverityBadge from '@/components/dashboard/SeverityBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FraudAlert {
  id: string;
  transactionId: string;
  amount: number;
  date: string;
  reason: string;
  severity: string;
  status?: 'pending' | 'resolved' | 'ignored';
}

const FraudDetection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [allAlertCount, setAllAlertCount] = useState(0);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [mediumRiskCount, setMediumRiskCount] = useState(0);
  const [lowRiskCount, setLowRiskCount] = useState(0);
  
  // Fetch mock data
  useEffect(() => {
    const alerts = getFraudAlerts();
    // Initialize all alerts with a 'pending' status
    const alertsWithStatus = alerts.map(alert => ({
      ...alert,
      status: 'pending' as const
    }));
    setFraudAlerts(alertsWithStatus);
    
    // Calculate initial counts
    updateAlertCounts(alertsWithStatus);
  }, []);
  
  const updateAlertCounts = (alerts: FraudAlert[]) => {
    const pendingAlerts = alerts.filter(alert => alert.status === 'pending');
    setAllAlertCount(pendingAlerts.length);
    setHighRiskCount(pendingAlerts.filter(alert => alert.severity === 'high').length);
    setMediumRiskCount(pendingAlerts.filter(alert => alert.severity === 'medium').length);
    setLowRiskCount(pendingAlerts.filter(alert => alert.severity === 'low').length);
  };
  
  const handleResolve = (id: string) => {
    const updatedAlerts = fraudAlerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: 'resolved' as const } 
        : alert
    );
    
    setFraudAlerts(updatedAlerts);
    updateAlertCounts(updatedAlerts);
    
    toast({
      title: "Alert Resolved",
      description: `Fraud alert ${id} has been marked as resolved.`,
    });
  };
  
  const handleIgnore = (id: string) => {
    const updatedAlerts = fraudAlerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: 'ignored' as const } 
        : alert
    );
    
    setFraudAlerts(updatedAlerts);
    updateAlertCounts(updatedAlerts);
    
    toast({
      title: "Alert Ignored",
      description: `Fraud alert ${id} has been marked as ignored.`,
    });
  };
  
  const handleViewDetails = (id: string) => {
    // In a real application, this would navigate to a detailed view
    const alert = fraudAlerts.find(alert => alert.id === id);
    
    if (!alert) return;
    
    toast({
      title: "Alert Details",
      description: `Transaction ${alert.transactionId} - ${alert.reason}`,
    });
  };
  
  const handleExportAlerts = () => {
    toast({
      title: "Export Started",
      description: "Fraud alerts are being exported to CSV.",
    });
    
    // In a real application, this would trigger an actual export process
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob(
        [
          "ID,Transaction ID,Amount,Date,Reason,Severity,Status\n" +
          fraudAlerts
            .filter(alert => alert.status === 'pending')
            .map(
              alert =>
                `${alert.id},${alert.transactionId},${alert.amount},${alert.date},${alert.reason},${alert.severity},${alert.status}`
            )
            .join("\n")
        ],
        { type: "text/csv" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "fraud_alerts.csv";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Export Complete",
        description: "Fraud alerts have been exported successfully.",
      });
    }, 1500);
  };
  
  // Filter alerts based on active tab and status (exclude resolved and ignored)
  const filteredAlerts = fraudAlerts.filter(alert => {
    // First, filter out resolved and ignored cases
    if (alert.status === 'resolved' || alert.status === 'ignored') return false;
    
    // Then apply tab filters
    if (activeTab === 'all') return true;
    if (activeTab === 'high') return alert.severity === 'high';
    if (activeTab === 'medium') return alert.severity === 'medium';
    if (activeTab === 'low') return alert.severity === 'low';
    return true;
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fraud Detection</h1>
          <p className="text-muted-foreground">Monitor and manage suspicious financial activities</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportAlerts}
          >
            <ArrowDownToLine className="h-4 w-4" /> Export
          </Button>
          <Button className="bg-edu-purple-400 hover:bg-edu-purple-500 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Advanced Filters
          </Button>
        </div>
      </div>
      
      {/* Fraud Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-gray-900 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <h2 className="text-3xl font-bold">{allAlertCount}</h2>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertOctagon className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-gray-900 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <h2 className="text-3xl font-bold">{highRiskCount}</h2>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-gray-900 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                <h2 className="text-3xl font-bold">{mediumRiskCount}</h2>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                <h2 className="text-3xl font-bold">{lowRiskCount}</h2>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All Alerts ({allAlertCount})</TabsTrigger>
          <TabsTrigger value="high">High Risk ({highRiskCount})</TabsTrigger>
          <TabsTrigger value="medium">Medium Risk ({mediumRiskCount})</TabsTrigger>
          <TabsTrigger value="low">Low Risk ({lowRiskCount})</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Fraud Alert Dashboard
              </CardTitle>
              <CardDescription>
                Showing {filteredAlerts.length} alerts matching your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">No Alerts Found</h3>
                  <p className="text-muted-foreground">All alerts have been resolved or none match your current filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <Alert 
                      key={alert.id} 
                      className={`
                        border-l-4 
                        ${alert.severity === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' : 
                          alert.severity === 'medium' ? 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20' : 
                          'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <AlertTitle className="flex items-center gap-2">
                            <SeverityBadge severity={alert.severity} />
                            <span>{alert.reason}</span>
                          </AlertTitle>
                          <AlertDescription className="mt-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                              <div>
                                <p className="text-muted-foreground">Transaction ID</p>
                                <p className="font-medium">{alert.transactionId}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Amount</p>
                                <p className="font-medium">{formatCurrency(alert.amount)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Date</p>
                                <p className="font-medium">{formatDate(alert.date)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium capitalize">{alert.status}</p>
                              </div>
                            </div>
                          </AlertDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(alert.id)}
                            className="text-edu-purple-500 border-edu-purple-200 hover:bg-edu-purple-50 hover:text-edu-purple-600"
                          >
                            <Eye className="mr-1 h-4 w-4" /> View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleIgnore(alert.id)}
                            className="text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                          >
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetection;
