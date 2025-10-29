import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useSalaryEntries } from "@/hooks/useSalaryEntries";
import { format } from "date-fns";

export const ExtraHoursCard = () => {
  const { entries } = useSalaryEntries();

  const totalExtraHours = entries.reduce((sum, entry) => sum + (entry.extra_hours || 0), 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Extra Hours Summary
        </CardTitle>
        <div className="text-3xl font-bold text-primary">
          {totalExtraHours.toFixed(1)} hrs
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => {
            if (!entry.extra_hours || entry.extra_hours === 0) return null;
            
            return (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {format(new Date(entry.start_date), "MMM dd, yyyy")}
                  </span>
                  {entry.description && (
                    <span className="text-xs text-muted-foreground">
                      {entry.description}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-primary">
                  {entry.extra_hours.toFixed(1)} hrs
                </span>
              </div>
            );
          })}
          {totalExtraHours === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No extra hours recorded yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
