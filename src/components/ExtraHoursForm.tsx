import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Clock } from 'lucide-react';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { toast } from '@/hooks/use-toast';

const ExtraHoursForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    extra_hours: '',
    description: '',
    currency: 'USD',
  });

  const { addEntry } = useSalaryEntries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.extra_hours) {
      return;
    }

    const { error } = await addEntry({
      start_date: formData.date,
      end_date: formData.date,
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
      setFormData({
        date: '',
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
          Record overtime or additional work hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
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
