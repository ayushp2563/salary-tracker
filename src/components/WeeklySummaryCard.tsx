
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface WeeklySummaryCardProps {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalIncome: number;
  totalTips: number;
  previousWeekIncome?: number;
}

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
  weekStart,
  weekEnd,
  totalHours,
  totalIncome,
  totalTips,
  previousWeekIncome,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateChange = () => {
    if (!previousWeekIncome || previousWeekIncome === 0) return null;
    const change = ((totalIncome - previousWeekIncome) / previousWeekIncome) * 100;
    return change;
  };

  const change = calculateChange();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </span>
          {change !== null && (
            <Badge variant={change >= 0 ? "default" : "destructive"} className="ml-2">
              {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalHours}</div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <div className="text-sm text-muted-foreground">Total Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalTips)}</div>
            <div className="text-sm text-muted-foreground">Tips</div>
          </div>
        </div>
        <div className="pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            Average per hour: {formatCurrency(totalHours > 0 ? totalIncome / totalHours : 0)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummaryCard;
