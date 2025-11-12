import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalaryEntries } from "@/hooks/useSalaryEntries";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";

export const AnalyticsWidget = () => {
  const { entries } = useSalaryEntries();

  const totalIncome = entries.reduce((sum, entry) => sum + entry.base_salary + entry.tips, 0);

  // Prepare chart data - last 7 entries
  const chartData = entries
    .slice(-7)
    .map(entry => ({
      date: new Date(entry.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: entry.base_salary + entry.tips,
    }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-muted-foreground">Total Income</span>
          </div>
          <span className="text-2xl font-bold">${totalIncome.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
