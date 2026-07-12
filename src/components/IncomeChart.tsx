
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { useExpenses } from '@/hooks/useExpenses';
import { useStudentPrefs } from '@/hooks/useStudentPrefs';
import { formatCurrency as formatMoney } from '@/lib/utils';
import { EXPENSE_CATEGORIES } from '@/types/expense';
import { ChartBar } from 'lucide-react';

const IncomeChart = () => {
  const { getWeeklySummaries } = useSalaryEntries();
  const { totals } = useExpenses();
  const { prefs } = useStudentPrefs();
  const currency = prefs.preferred_currency;
  const weeklySummaries = getWeeklySummaries();

  const formatCurrency = (value: number) => formatMoney(value, currency);

  const chartData = weeklySummaries
    .slice(0, 8)
    .reverse()
    .map((week) => ({
      week: new Date(week.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: week.totalIncome,
      tips: week.totalTips,
      baseSalary: week.totalIncome - week.totalTips,
      hours: week.totalHours,
    }));

  const tipsData = chartData.map((data) => ({
    week: data.week,
    tips: data.tips,
    baseSalary: data.baseSalary,
  }));

  const totalTips = chartData.reduce((sum, data) => sum + data.tips, 0);
  const totalBaseSalary = chartData.reduce((sum, data) => sum + data.baseSalary, 0);
  const pieData = [
    { name: 'Base Salary', value: totalBaseSalary, color: '#059669' },
    { name: 'Tips', value: totalTips, color: '#d97706' },
  ];

  const expensePie = Object.entries(totals.byCategory)
    .filter(([, amount]) => amount > 0)
    .map(([category, value], index) => ({
      name: EXPENSE_CATEGORIES.find((c) => c.value === category)?.label || category,
      value,
      color: ['#0f766e', '#047857', '#b45309', '#0369a1', '#7c3aed', '#be123c', '#4d7c0f'][index % 7],
    }));

  if (chartData.length === 0 && expensePie.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <ChartBar className="h-5 w-5" />
            Insights
          </CardTitle>
          <CardDescription>Track income and spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Add salary entries or expenses to see trends
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {chartData.length > 0 && (
        <>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <ChartBar className="h-5 w-5" />
                Weekly Income Trend
              </CardTitle>
              <CardDescription>Your total income over the last 8 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDashash="3 3" strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Income']} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display">Income Breakdown</CardTitle>
              <CardDescription>Bank salary vs tips by week</CardDescription>
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
                      name === 'baseSalary' ? 'Bank salary' : 'Tips',
                    ]}
                  />
                  <Bar dataKey="baseSalary" stackId="income" fill="#059669" />
                  <Bar dataKey="tips" stackId="income" fill="#d97706" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display">Tips Analysis</CardTitle>
              <CardDescription>Tips earned over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={tipsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Tips']} />
                  <Line
                    type="monotone"
                    dataKey="tips"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ fill: '#d97706', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {(totalTips > 0 || totalBaseSalary > 0) && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="font-display">Income Distribution</CardTitle>
                <CardDescription>Overall bank salary vs tips</CardDescription>
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
        </>
      )}

      {expensePie.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Spending by Category</CardTitle>
            <CardDescription>
              Tips spent {formatCurrency(totals.fromTips)} · Bank spent {formatCurrency(totals.fromBank)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expensePie}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                >
                  {expensePie.map((entry, index) => (
                    <Cell key={`expense-${index}`} fill={entry.color} />
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
