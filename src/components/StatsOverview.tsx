
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { useDailyHours } from '@/hooks/useDailyHours';
import { useExpenses } from '@/hooks/useExpenses';
import { useStudentPrefs } from '@/hooks/useStudentPrefs';
import { formatCurrency } from '@/lib/utils';
import { ArrowUp, ArrowDown, Calendar, Receipt, Wallet } from 'lucide-react';

const StatsOverview = () => {
  const { entries, getWeeklySummaries } = useSalaryEntries();
  const { getTotalHours } = useDailyHours();
  const { totals } = useExpenses();
  const { prefs } = useStudentPrefs();
  const currency = prefs.preferred_currency;

  const weeklySummaries = getWeeklySummaries();
  const currentWeek = weeklySummaries[0];
  const previousWeek = weeklySummaries[1];

  const totalIncome = entries.reduce(
    (sum, entry) => sum + Number(entry.base_salary || 0) + Number(entry.tips || 0),
    0
  );
  const salaryHours = entries.reduce((sum, entry) => sum + Number(entry.hours_worked || 0), 0);
  const dailyHoursTotal = getTotalHours();
  const totalHours = salaryHours + dailyHoursTotal;
  const totalTips = entries.reduce((sum, entry) => sum + Number(entry.tips || 0), 0);
  const averageHourlyRate = totalHours > 0 ? totalIncome / totalHours : 0;
  const net = totalIncome - totals.total;

  const weeklyChange =
    currentWeek && previousWeek && previousWeek.totalIncome > 0
      ? ((currentWeek.totalIncome - previousWeek.totalIncome) / previousWeek.totalIncome) * 100
      : 0;

  const stats = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome, currency),
      description: 'Salary + tips',
      icon: ArrowUp,
      trend: weeklyChange,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totals.total, currency),
      description: 'All tracked spending',
      icon: Receipt,
    },
    {
      title: 'Net Balance',
      value: formatCurrency(net, currency),
      description: net >= 0 ? 'Income after expenses' : 'Spending exceeds income',
      icon: Wallet,
    },
    {
      title: 'Hours / Rate',
      value: `${totalHours.toFixed(1)}h`,
      description: `${formatCurrency(averageHourlyRate, currency)}/hr · tips ${formatCurrency(totalTips, currency)}`,
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="group border-border/60 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/25 animate-fade-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                {stat.value}
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.trend !== undefined && previousWeek && previousWeek.totalIncome > 0 && (
                  <div
                    className={`flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      stat.trend >= 0
                        ? 'trend-positive bg-emerald-100 dark:bg-emerald-900/30'
                        : 'trend-negative bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    {stat.trend >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
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
  );
};

export default StatsOverview;
