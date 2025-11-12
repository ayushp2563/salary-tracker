import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalaryEntries } from "@/hooks/useSalaryEntries";
import { Clock, DollarSign } from "lucide-react";

export const IncomeHoursWidget = () => {
  const { entries } = useSalaryEntries();

  const totalIncome = entries.reduce((sum, entry) => sum + entry.base_salary + entry.tips, 0);
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours_worked, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-muted-foreground">Total Income</span>
          </div>
          <span className="text-2xl font-bold">${totalIncome.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-muted-foreground">Total Hours</span>
          </div>
          <span className="text-2xl font-bold">{totalHours.toFixed(1)}h</span>
        </div>
      </CardContent>
    </Card>
  );
};
