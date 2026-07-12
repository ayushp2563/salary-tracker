import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trash2, Wallet, Banknote } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { EXPENSE_CATEGORIES, type ExpenseCategory, type PaymentSource } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export const ExpenseTracker = () => {
  const { expenses, searchExpenses, deleteExpense, totals, loading } = useExpenses();
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<PaymentSource | 'all'>('all');
  const [category, setCategory] = useState<ExpenseCategory | 'all'>('all');

  const filtered = useMemo(
    () => searchExpenses(query, source, category),
    [searchExpenses, query, source, category]
  );

  const categoryLabel = (value: string) =>
    EXPENSE_CATEGORIES.find((c) => c.value === value)?.label || value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-gradient-to-br from-background to-muted/40">
          <CardHeader className="pb-2">
            <CardDescription>Total spent</CardDescription>
            <CardTitle className="font-display text-2xl">{formatCurrency(totals.total)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-gradient-to-br from-amber-50/80 to-background dark:from-amber-950/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" /> From tips
            </CardDescription>
            <CardTitle className="font-display text-2xl text-amber-700 dark:text-amber-400">
              {formatCurrency(totals.fromTips)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-gradient-to-br from-emerald-50/80 to-background dark:from-emerald-950/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5" /> From bank
            </CardDescription>
            <CardTitle className="font-display text-2xl text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totals.fromBank)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Search className="h-5 w-5" />
            Your Expenses
          </CardTitle>
          <CardDescription>Search by name, filter by source or category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search expenses by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={source} onValueChange={(v) => setSource(v as PaymentSource | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="tips">Tips</SelectItem>
                <SelectItem value="bank">Bank income</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading expenses...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed py-12 text-center">
              <p className="text-muted-foreground">
                {expenses.length === 0
                  ? 'No expenses yet. Add your first one to start tracking.'
                  : 'No expenses match your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((expense, index) => (
                <div
                  key={expense.id}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition-all hover:border-primary/30 hover:bg-muted/30 animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{expense.name}</p>
                      <Badge variant="secondary" className="text-[10px]">
                        {categoryLabel(expense.category)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          expense.payment_source === 'tips'
                            ? 'border-amber-300 text-amber-700 dark:text-amber-400'
                            : 'border-emerald-300 text-emerald-700 dark:text-emerald-400'
                        }
                      >
                        {expense.payment_source === 'tips' ? 'Tips' : 'Bank'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(expense.expense_date), 'MMM d, yyyy')}
                      {expense.notes ? ` · ${expense.notes}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-semibold">
                      {formatCurrency(Number(expense.amount), expense.currency)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground opacity-70 transition-opacity hover:text-destructive group-hover:opacity-100"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
