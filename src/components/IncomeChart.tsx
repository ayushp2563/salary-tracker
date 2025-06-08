
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { ChartBar } from 'lucide-react';

const IncomeChart = () => {
  const { getWeeklySummaries } = useSalaryEntries();
  const weeklySummaries = getWeeklySummaries();

  const chartData = weeklySummaries
    .slice(0, 8) // Show last 8 weeks
    .reverse()
    .map((week) => ({
      week: new Date(week.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: week.totalIncome,
      tips: week.totalTips,
      baseSalary: week.totalIncome - week.totalTips,
      hours: week.totalHours,
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="h-5 w-5" />
            Income Trends
          </CardTitle>
          <CardDescription>Track your weekly income over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Add some salary entries to see your income trends
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="h-5 w-5" />
            Weekly Income Trend
          </CardTitle>
          <CardDescription>Your total income over the last 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Income']}
                labelStyle={{ color: '#333' }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income Breakdown</CardTitle>
          <CardDescription>Base salary vs tips comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'baseSalary' ? 'Base Salary' : 'Tips'
                ]}
                labelStyle={{ color: '#333' }}
              />
              <Bar dataKey="baseSalary" stackId="income" fill="#10b981" />
              <Bar dataKey="tips" stackId="income" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeChart;
