
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { ArrowUp, ArrowDown, Calendar, FileText } from 'lucide-react';

const StatsOverview = () => {
  const { entries, getWeeklySummaries } = useSalaryEntries();
  
  const weeklySummaries = getWeeklySummaries();
  const currentWeek = weeklySummaries[0];
  const previousWeek = weeklySummaries[1];

  const totalIncome = entries.reduce((sum, entry) => sum + entry.base_salary + entry.tips, 0);
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours_worked, 0);
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
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold break-all">{stat.value}</div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              {stat.trend !== undefined && (
                <div className={`flex items-center text-xs ${
                  stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
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
  );
};

export default StatsOverview;
