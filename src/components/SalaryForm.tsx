
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSalaryStore } from '@/store/salaryStore';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SalaryForm = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    hoursWorked: '',
    baseSalary: '',
    tips: '',
    currency: 'USD',
  });

  const addEntry = useSalaryStore((state) => state.addEntry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.hoursWorked || !formData.baseSalary) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addEntry({
      startDate: formData.startDate,
      endDate: formData.endDate,
      hoursWorked: parseFloat(formData.hoursWorked),
      baseSalary: parseFloat(formData.baseSalary),
      tips: parseFloat(formData.tips) || 0,
      currency: formData.currency,
    });

    setFormData({
      startDate: '',
      endDate: '',
      hoursWorked: '',
      baseSalary: '',
      tips: '',
      currency: 'USD',
    });

    toast({
      title: "Entry Added",
      description: "Your salary entry has been saved successfully!",
    });
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
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input
                id="hoursWorked"
                type="number"
                step="0.5"
                min="0"
                placeholder="40.0"
                value={formData.hoursWorked}
                onChange={(e) => handleChange('hoursWorked', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary</Label>
              <Input
                id="baseSalary"
                type="number"
                step="0.01"
                min="0"
                placeholder="1000.00"
                value={formData.baseSalary}
                onChange={(e) => handleChange('baseSalary', e.target.value)}
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
          
          <Button type="submit" className="w-full">
            Add Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SalaryForm;
