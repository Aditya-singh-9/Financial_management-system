
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockPredictionData = [
  { year: '2024', tuition: 85000, facilities: 12000, exam: 8000, activities: 5000, technology: 3000, total: 113000 },
  { year: '2025', tuition: 92500, facilities: 13000, exam: 8500, activities: 5500, technology: 3500, total: 123000 },
  { year: '2026', tuition: 101000, facilities: 14200, exam: 9200, activities: 6000, technology: 4000, total: 134400 },
  { year: '2027', tuition: 110000, facilities: 15500, exam: 10000, activities: 6500, technology: 4500, total: 146500 },
];

const inflationFactors = [
  { factor: 'General Inflation', value: 5.8, impact: 'High' },
  { factor: 'Education Sector Growth', value: 7.2, impact: 'High' },
  { factor: 'Faculty Salary Trends', value: 6.5, impact: 'Medium' },
  { factor: 'Infrastructure Costs', value: 8.3, impact: 'Medium' },
  { factor: 'Technology Investment', value: 9.1, impact: 'Low' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const FeePrediction: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-edu-purple-400" />
        <h2 className="text-2xl font-bold">AI Fee Prediction</h2>
      </div>
      <p className="text-muted-foreground">
        Our AI model analyzes historical data, inflation rates, and education market trends to predict future fee structures.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Structure Predictions</CardTitle>
            <CardDescription>
              Projected fee components for the next 4 years
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockPredictionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Legend />
                <Bar dataKey="tuition" name="Tuition Fee" stackId="a" fill="#9b87f5" />
                <Bar dataKey="facilities" name="Facilities" stackId="a" fill="#7E69AB" />
                <Bar dataKey="exam" name="Examination" stackId="a" fill="#1EAEDB" />
                <Bar dataKey="activities" name="Activities" stackId="a" fill="#F97316" />
                <Bar dataKey="technology" name="Technology" stackId="a" fill="#D6BCFA" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Fee Growth Trend</CardTitle>
            <CardDescription>
              Projected total fees over time with confidence intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockPredictionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name="Predicted Total Fee" 
                  stroke="#9b87f5" 
                  fill="#9b87f5" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inflation Factors</CardTitle>
          <CardDescription>
            Key factors affecting fee predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Factor</th>
                  <th className="text-center py-3 px-2 font-medium">Annual Rate (%)</th>
                  <th className="text-center py-3 px-2 font-medium">Impact</th>
                  <th className="text-right py-3 px-2 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {inflationFactors.map((factor, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-2">{factor.factor}</td>
                    <td className="py-3 px-2 text-center">{factor.value}%</td>
                    <td className="py-3 px-2 text-center">
                      <Badge 
                        variant="outline" 
                        className={
                          factor.impact === 'High' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : factor.impact === 'Medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }
                      >
                        {factor.impact}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ml-auto">
                        <div 
                          className="bg-edu-purple-400 h-2 rounded-full" 
                          style={{ width: `${85 - index * 5}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-medium">AI Recommendation</h3>
            <p className="mt-1 text-sm">Based on current trends, we recommend a gradual fee increase of 7-9% annually rather than a large increase every 2-3 years. This approach minimizes student financial shock while maintaining institutional growth.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeePrediction;
