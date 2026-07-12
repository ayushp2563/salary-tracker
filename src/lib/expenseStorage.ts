import type { Expense, ExpenseCategory, PaymentSource } from '@/types/expense';
import type { SalaryEntry } from '@/hooks/useSalaryEntries';

export const EXPENSE_MARKER = '__EXPENSE__:';

export type ExpensePayload = {
  name: string;
  category: ExpenseCategory;
  payment_source: PaymentSource;
  notes?: string | null;
  amount: number;
};

export const isExpenseSalaryEntry = (entry: Pick<SalaryEntry, 'description' | 'hours_worked'>) => {
  const desc = entry.description || '';
  return desc.startsWith(EXPENSE_MARKER) || Number(entry.hours_worked) === -1;
};

export const encodeExpenseDescription = (payload: ExpensePayload) =>
  `${EXPENSE_MARKER}${JSON.stringify({
    name: payload.name,
    category: payload.category,
    payment_source: payload.payment_source,
    notes: payload.notes ?? null,
    amount: payload.amount,
  })}`;

export const parseExpenseFromSalaryEntry = (entry: SalaryEntry): Expense | null => {
  if (!isExpenseSalaryEntry(entry)) return null;

  const raw = (entry.description || '').slice(EXPENSE_MARKER.length);
  let parsed: Partial<ExpensePayload> = {};
  try {
    parsed = JSON.parse(raw || '{}') as Partial<ExpensePayload>;
  } catch {
    parsed = { name: raw || 'Expense' };
  }

  const amount = Number(parsed.amount ?? entry.tips ?? entry.base_salary ?? 0);

  return {
    id: entry.id,
    user_id: entry.user_id,
    name: parsed.name || 'Expense',
    amount,
    category: (parsed.category as ExpenseCategory) || 'other',
    payment_source: (parsed.payment_source as PaymentSource) || 'bank',
    currency: entry.currency || 'USD',
    expense_date: entry.start_date,
    notes: parsed.notes ?? null,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
  };
};

export const expenseToSalaryInsert = (
  expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  userId: string
) => ({
  user_id: userId,
  start_date: expense.expense_date,
  end_date: expense.expense_date,
  hours_worked: -1,
  extra_hours: 0,
  base_salary: 0,
  tips: Number(expense.amount) || 0,
  currency: expense.currency || 'USD',
  description: encodeExpenseDescription({
    name: expense.name,
    category: expense.category,
    payment_source: expense.payment_source,
    notes: expense.notes,
    amount: Number(expense.amount) || 0,
  }),
});

const LOCAL_KEY = 'salary-tracker-expenses';

export const readLocalExpenses = (userId: string): Expense[] => {
  try {
    const raw = localStorage.getItem(`${LOCAL_KEY}:${userId}`);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
};

export const clearLocalExpenses = (userId: string) => {
  localStorage.removeItem(`${LOCAL_KEY}:${userId}`);
};
