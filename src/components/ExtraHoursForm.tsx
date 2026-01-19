import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, CalendarIcon } from 'lucide-react';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

const ExtraHoursForm = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [formData, setFormData] = useState({
    extra_hours: '',
    description: '',
    currency: 'USD',
  });

  const { addEntry } = useSalaryEntries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateRange?.from || !formData.extra_hours) {
      toast({
        title: "Error",
        description: "Please select a date and enter extra hours",
        variant: "destructive",
      });
      return;
    }

    const startDate = format(dateRange.from, 'yyyy-MM-dd');
    const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : startDate;

    const { error } = await addEntry({
      start_date: startDate,
      end_date: endDate,
      hours_worked: 0,
      extra_hours: parseFloat(formData.extra_hours),
      base_salary: 0,
      tips: 0,
      currency: formData.currency,
      description: formData.description,
    });

    if (!error) {
      toast({
        title: "Success",
        description: "Extra hours added successfully",
      });
      setDateRange(undefined);
      setFormData({
        extra_hours: '',
        description: '',
        currency: 'USD',
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Clock className="h-5 w-5" />
          Add Extra Hours
        </CardTitle>
        <CardDescription>
          Record overtime or additional work hours for a single day or date range
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Date or Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Select date(s)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="extra_hours">Extra Hours</Label>
            <Input
              id="extra_hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="5.0"
              value={formData.extra_hours}
              onChange={(e) => handleChange('extra_hours', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description/Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about the extra hours..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full">
            Add Extra Hours
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExtraHoursForm;
