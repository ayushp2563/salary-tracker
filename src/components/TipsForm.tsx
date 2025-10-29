
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';

const TipsForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    tips: '',
    description: '',
    currency: 'USD',
  });

  const { addEntry } = useSalaryEntries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.tips) {
      return;
    }

    const { error } = await addEntry({
      start_date: formData.date,
      end_date: formData.date,
      hours_worked: 0,
      extra_hours: 0,
      base_salary: 0,
      tips: parseFloat(formData.tips),
      currency: formData.currency,
    });

    if (!error) {
      setFormData({
        date: '',
        tips: '',
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
          <Plus className="h-5 w-5" />
          Add Tips
        </CardTitle>
        <CardDescription>
          Record additional tips or bonus income
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
            <Label htmlFor="tips">Tips Amount</Label>
            <Input
              id="tips"
              type="number"
              step="0.01"
              min="0"
              placeholder="50.00"
              value={formData.tips}
              onChange={(e) => handleChange('tips', e.target.value)}
              required
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
            Add Tips
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TipsForm;
