import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyHours } from '@/hooks/useDailyHours';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const DailyHoursList = () => {
  const { dailyHours, loading, deleteDailyHours } = useDailyHours();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Hours Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (dailyHours.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Hours Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No daily hours entries yet. Add your first entry above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Hours Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dailyHours.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">
                    {format(new Date(entry.date), 'MMM dd, yyyy')}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-bold text-primary">
                    {entry.hours_worked}h
                  </span>
                </div>
                {entry.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {entry.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteDailyHours(entry.id)}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
