
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetOptimization from '@/components/admin/BudgetOptimization';
import FeePrediction from '@/components/admin/FeePrediction';

const AdminAnalytics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Financial Analytics</h1>
        <p className="text-muted-foreground">
          Advanced analytics and AI-powered predictions
        </p>
      </div>
      
      <Tabs defaultValue="budget">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="budget">Budget Optimization</TabsTrigger>
          <TabsTrigger value="prediction">Fee Prediction</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="budget">
            <BudgetOptimization />
          </TabsContent>
          <TabsContent value="prediction">
            <FeePrediction />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
