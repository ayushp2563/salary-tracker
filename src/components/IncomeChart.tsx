
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
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

  // Prepare tips-specific data
  const tipsData = chartData.map(data => ({
    week: data.week,
    tips: data.tips,
    baseSalary: data.baseSalary,
  }));

  // Calculate total tips vs base salary for pie chart
  const totalTips = chartData.reduce((sum, data) => sum + data.tips, 0);
  const totalBaseSalary = chartData.reduce((sum, data) => sum + data.baseSalary, 0);
  const pieData = [
    { name: 'Base Salary', value: totalBaseSalary, color: '#10b981' },
    { name: 'Tips', value: totalTips, color: '#3b82f6' },
  ];

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

      <Card>
        <CardHeader>
          <CardTitle>Tips Analysis</CardTitle>
          <CardDescription>Dedicated tips tracking over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tipsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Tips']}
                labelStyle={{ color: '#333' }}
              />
              <Line 
                type="monotone" 
                dataKey="tips" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {(totalTips > 0 || totalBaseSalary > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Income Distribution</CardTitle>
            <CardDescription>Overall breakdown of base salary vs tips</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IncomeChart;
