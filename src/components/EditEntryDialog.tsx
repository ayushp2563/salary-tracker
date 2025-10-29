
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Calendar } from 'lucide-react';
import { useSalaryEntries, SalaryEntry } from '@/hooks/useSalaryEntries';

interface EditEntryDialogProps {
  entry: SalaryEntry;
}

const EditEntryDialog = ({ entry }: EditEntryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    start_date: entry.start_date,
    end_date: entry.end_date,
    hours_worked: entry.hours_worked.toString(),
    extra_hours: (entry.extra_hours || 0).toString(),
    base_salary: entry.base_salary.toString(),
    tips: entry.tips.toString(),
    currency: entry.currency,
    description: entry.description || '',
  });

  const { updateEntry } = useSalaryEntries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await updateEntry(entry.id, {
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
      setOpen(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Salary Entry</DialogTitle>
          <DialogDescription>
            Update your salary entry details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_start_date">Start Date</Label>
              <Input
                id="edit_start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_end_date">End Date</Label>
              <Input
                id="edit_end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_hours_worked">Hours Worked</Label>
              <Input
                id="edit_hours_worked"
                type="number"
                step="0.5"
                min="0"
                value={formData.hours_worked}
                onChange={(e) => handleChange('hours_worked', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_extra_hours">Extra Hours</Label>
              <Input
                id="edit_extra_hours"
                type="number"
                step="0.5"
                min="0"
                value={formData.extra_hours}
                onChange={(e) => handleChange('extra_hours', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_base_salary">Base Salary</Label>
              <Input
                id="edit_base_salary"
                type="number"
                step="0.01"
                min="0"
                value={formData.base_salary}
                onChange={(e) => handleChange('base_salary', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_tips">Tips & Additional Income</Label>
              <Input
                id="edit_tips"
                type="number"
                step="0.01"
                min="0"
                value={formData.tips}
                onChange={(e) => handleChange('tips', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_currency">Currency</Label>
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
            <Label htmlFor="edit_description">Description/Notes (Optional)</Label>
            <Textarea
              id="edit_description"
              placeholder="Add any notes about this salary entry..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Update Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
