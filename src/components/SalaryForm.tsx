
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';

const SalaryForm = () => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    hours_worked: '',
    extra_hours: '',
    base_salary: '',
    tips: '',
    currency: 'USD',
    description: '',
  });

  const { addEntry } = useSalaryEntries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date || !formData.hours_worked || !formData.base_salary) {
      return;
    }

    const { error } = await addEntry({
      start_date: formData.start_date,
      end_date: formData.end_date,
      hours_worked: parseFloat(formData.hours_worked),
      extra_hours: parseFloat(formData.extra_hours) || 0,
      base_salary: parseFloat(formData.base_salary),
      tips: parseFloat(formData.tips) || 0,
      currency: formData.currency,
      description: formData.description,
    });

    if (!error) {
      setFormData({
        start_date: '',
        end_date: '',
        hours_worked: '',
        extra_hours: '',
        base_salary: '',
        tips: '',
        currency: 'USD',
        description: '',
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Salary Entry
        </CardTitle>
        <CardDescription>
          Record your earnings for a specific period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours_worked">Hours Worked</Label>
              <Input
                id="hours_worked"
                type="number"
                step="0.5"
                min="0"
                placeholder="40.0"
                value={formData.hours_worked}
                onChange={(e) => handleChange('hours_worked', e.target.value)}
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
                placeholder="0.0"
                value={formData.extra_hours}
                onChange={(e) => handleChange('extra_hours', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_salary">Base Salary</Label>
              <Input
                id="base_salary"
                type="number"
                step="0.01"
                min="0"
                placeholder="1000.00"
                value={formData.base_salary}
                onChange={(e) => handleChange('base_salary', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tips">Tips & Additional Income</Label>
              <Input
                id="tips"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.tips}
                onChange={(e) => handleChange('tips', e.target.value)}
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description/Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any notes about this salary entry..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SalaryForm;
