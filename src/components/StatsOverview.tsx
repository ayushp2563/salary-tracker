
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { useDailyHours } from '@/hooks/useDailyHours';
import { ArrowUp, ArrowDown, Calendar, FileText } from 'lucide-react';

const StatsOverview = () => {
  const { entries, getWeeklySummaries } = useSalaryEntries();
  const { getTotalHours } = useDailyHours();
  
  const weeklySummaries = getWeeklySummaries();
  const currentWeek = weeklySummaries[0];
  const previousWeek = weeklySummaries[1];

  const totalIncome = entries.reduce((sum, entry) => sum + entry.base_salary + entry.tips, 0);
  const salaryHours = entries.reduce((sum, entry) => sum + entry.hours_worked, 0);
  const dailyHoursTotal = getTotalHours();
  const totalHours = salaryHours + dailyHoursTotal;
  const totalTips = entries.reduce((sum, entry) => sum + entry.tips, 0);
  const averageHourlyRate = totalHours > 0 ? totalIncome / totalHours : 0;

  const weeklyChange = currentWeek && previousWeek 
    ? ((currentWeek.totalIncome - previousWeek.totalIncome) / previousWeek.totalIncome) * 100
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      description: "All time earnings",
      icon: ArrowUp,
      trend: weeklyChange,
    },
    {
      title: "Total Hours",
      value: totalHours.toFixed(1),
      description: "Hours worked",
      icon: Calendar,
    },
    {
      title: "Average Hourly",
      value: formatCurrency(averageHourlyRate),
      description: "Per hour rate",
      icon: ArrowUp,
    },
    {
      title: "Total Entries",
      value: entries.length.toString(),
      description: "Salary records",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Financial Overview</h2>
          <p className="text-muted-foreground">Your income performance at a glance</p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="financial-card border-2 hover:border-primary/20 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="currency-display text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
                  {stat.trend !== undefined && (
                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend >= 0 
                        ? 'trend-positive bg-green-100 dark:bg-green-900/30' 
                        : 'trend-negative bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {stat.trend >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(stat.trend).toFixed(1)}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
