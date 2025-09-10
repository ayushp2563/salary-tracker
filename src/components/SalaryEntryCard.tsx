
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { SalaryEntry } from '@/hooks/useSalaryEntries';
import EditEntryDialog from './EditEntryDialog';

interface SalaryEntryCardProps {
  entry: SalaryEntry;
  onDelete: (id: string) => void;
}

const SalaryEntryCard = ({ entry, onDelete }: SalaryEntryCardProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // Parse the date string directly without timezone conversion
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatCreatedDate = (dateString: string) => {
    // For created_at timestamp, use normal date formatting
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1">
            <p className="font-medium text-sm sm:text-base">
              {formatDate(entry.start_date)} - {formatDate(entry.end_date)}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Added: {formatCreatedDate(entry.created_at)}
            </p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <EditEntryDialog entry={entry} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              className="text-destructive hover:text-destructive text-xs sm:text-sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-muted-foreground">Hours: </span>
            <span className="font-medium">{entry.hours_worked}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Base: </span>
            <span className="font-medium">{formatCurrency(entry.base_salary, entry.currency)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Tips: </span>
            <span className="font-medium">{formatCurrency(entry.tips, entry.currency)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold text-green-600">
              {formatCurrency(entry.base_salary + entry.tips, entry.currency)}
            </span>
          </div>
        </div>
        
        {entry.description && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-muted-foreground text-xs sm:text-sm">Notes: </span>
            <p className="text-xs sm:text-sm mt-1 text-foreground">{entry.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryEntryCard;
