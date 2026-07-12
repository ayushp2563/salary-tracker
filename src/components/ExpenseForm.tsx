import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Wallet, Banknote } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { useStudentPrefs } from '@/hooks/useStudentPrefs';
import { EXPENSE_CATEGORIES, type ExpenseCategory, type PaymentSource } from '@/types/expense';
import { toDateInputValue } from '@/lib/utils';

export const ExpenseForm = () => {
  const { addExpense } = useExpenses();
  const { prefs } = useStudentPrefs();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'groceries' as ExpenseCategory,
    payment_source: 'bank' as PaymentSource,
    expense_date: toDateInputValue(),
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount) return;

    setSubmitting(true);
    const { error } = await addExpense({
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      payment_source: formData.payment_source,
      currency: prefs.preferred_currency,
      expense_date: formData.expense_date,
      notes: formData.notes || null,
    });
    setSubmitting(false);

    if (!error) {
      setFormData({
        name: '',
        amount: '',
        category: 'groceries',
        payment_source: 'bank',
        expense_date: toDateInputValue(),
        notes: '',
      });
    }
  };

  return (
    <Card className="w-full border-border/60 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <Plus className="h-5 w-5 text-primary" />
          Add Expense
        </CardTitle>
        <CardDescription>
          Log spending and choose whether it came from tips or bank income
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense_name">Name</Label>
            <Input
              id="expense_name"
              placeholder="e.g. Metro groceries, Rent, Uber to campus"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense_amount">Amount</Label>
              <Input
                id="expense_amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="25.00"
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense_date">Date</Label>
              <Input
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData((p) => ({ ...p, expense_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((p) => ({ ...p, category: value as ExpenseCategory }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Paid from</Label>
            <RadioGroup
              value={formData.payment_source}
              onValueChange={(value) =>
                setFormData((p) => ({ ...p, payment_source: value as PaymentSource }))
              }
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="source_bank"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                  formData.payment_source === 'bank'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/40'
                }`}
              >
                <RadioGroupItem value="bank" id="source_bank" />
                <Banknote className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Bank income</div>
                  <div className="text-xs text-muted-foreground">Paycheque / transfers</div>
                </div>
              </Label>
              <Label
                htmlFor="source_tips"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                  formData.payment_source === 'tips'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/40'
                }`}
              >
                <RadioGroupItem value="tips" id="source_tips" />
                <Wallet className="h-4 w-4 text-amber-600" />
                <div>
                  <div className="text-sm font-medium">Tips</div>
                  <div className="text-xs text-muted-foreground">Cash / tip pool</div>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_notes">Notes (optional)</Label>
            <Textarea
              id="expense_notes"
              rows={2}
              placeholder="Split with roommate, refundable deposit..."
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
