import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Expense, ExpenseCategory, PaymentSource } from '@/types/expense';
import type { SalaryEntry } from '@/hooks/useSalaryEntries';
import {
  clearLocalExpenses,
  expenseToSalaryInsert,
  isExpenseSalaryEntry,
  parseExpenseFromSalaryEntry,
  readLocalExpenses,
  EXPENSE_MARKER,
  encodeExpenseDescription,
} from '@/lib/expenseStorage';

type ExpenseInput = Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
type BackendMode = 'table' | 'salary_entries' | 'unknown';

const isMissingTableError = (error: unknown) => {
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: string }).message || '')
      : String(error || '');
  const code =
    typeof error === 'object' && error && 'code' in error
      ? String((error as { code?: string }).code || '')
      : '';
  return code === '42P01' || /relation .*expenses.* does not exist/i.test(message);
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [backend, setBackend] = useState<BackendMode>('unknown');
  const { user } = useAuth();

  const migrateLocalToCloud = useCallback(
    async (mode: Exclude<BackendMode, 'unknown'>, existing: Expense[]) => {
      if (!user) return existing;
      const local = readLocalExpenses(user.id);
      if (!local.length) return existing;

      const existingKeys = new Set(
        existing.map((e) => `${e.name}|${e.expense_date}|${e.amount}|${e.payment_source}`)
      );
      const toUpload = local.filter(
        (e) => !existingKeys.has(`${e.name}|${e.expense_date}|${e.amount}|${e.payment_source}`)
      );

      if (!toUpload.length) {
        clearLocalExpenses(user.id);
        return existing;
      }

      const uploaded: Expense[] = [];
      for (const item of toUpload) {
        const payload: ExpenseInput = {
          name: item.name,
          amount: Number(item.amount),
          category: item.category,
          payment_source: item.payment_source,
          currency: item.currency || 'USD',
          expense_date: item.expense_date,
          notes: item.notes ?? null,
        };

        if (mode === 'table') {
          const { data, error } = await supabase
            .from('expenses')
            .insert([{ ...payload, user_id: user.id }])
            .select()
            .single();
          if (!error && data) uploaded.push(data as Expense);
        } else {
          const { data, error } = await supabase
            .from('salary_entries')
            .insert([expenseToSalaryInsert(payload, user.id)])
            .select()
            .single();
          if (!error && data) {
            const parsed = parseExpenseFromSalaryEntry(data as SalaryEntry);
            if (parsed) uploaded.push(parsed);
          }
        }
      }

      clearLocalExpenses(user.id);
      if (uploaded.length) {
        toast({
          title: 'Expenses synced',
          description: `Moved ${uploaded.length} local expense(s) to your Supabase account`,
        });
      }
      return [...uploaded, ...existing];
    },
    [user]
  );

  const fetchFromExpensesTable = useCallback(async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('expense_date', { ascending: false });
    if (error) throw error;
    return (data as Expense[]) || [];
  }, [user]);

  const fetchFromSalaryEntries = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('salary_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });
    if (error) throw error;
    return ((data as SalaryEntry[]) || [])
      .map(parseExpenseFromSalaryEntry)
      .filter((e): e is Expense => Boolean(e));
  }, [user]);

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setBackend('unknown');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      try {
        const tableRows = await fetchFromExpensesTable();
        setBackend('table');
        const merged = await migrateLocalToCloud('table', tableRows || []);
        setExpenses(merged);
        return;
      } catch (error) {
        if (!isMissingTableError(error)) throw error;
      }

      // Existing Supabase DB fallback: store expenses in salary_entries with a marker.
      // This syncs across devices without requiring a new table immediately.
      const rows = await fetchFromSalaryEntries();
      setBackend('salary_entries');
      const merged = await migrateLocalToCloud('salary_entries', rows);
      setExpenses(merged);
    } catch (error: unknown) {
      console.error('Failed to load expenses', error);
      const message = error instanceof Error ? error.message : 'Failed to load expenses';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [user, fetchFromExpensesTable, fetchFromSalaryEntries, migrateLocalToCloud]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Realtime sync for whichever backend is active
  useEffect(() => {
    if (!user || backend === 'unknown') return;

    const table = backend === 'table' ? 'expenses' : 'salary_entries';
    const channel = supabase
      .channel(`expenses-sync-${user.id}-${backend}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, backend, fetchExpenses]);

  const addExpense = async (input: ExpenseInput) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      if (backend === 'table') {
        const { data, error } = await supabase
          .from('expenses')
          .insert([{ ...input, user_id: user.id }])
          .select()
          .single();
        if (error) throw error;
        setExpenses((prev) => [data as Expense, ...prev]);
        toast({ title: 'Expense added', description: `${input.name} saved to Supabase` });
        return { data: data as Expense, error: null };
      }

      // Ensure we have a backend mode before writing
      let mode = backend;
      if (mode === 'unknown') {
        try {
          await fetchFromExpensesTable();
          mode = 'table';
          setBackend('table');
        } catch (error) {
          if (!isMissingTableError(error)) throw error;
          mode = 'salary_entries';
          setBackend('salary_entries');
        }
      }

      if (mode === 'table') {
        const { data, error } = await supabase
          .from('expenses')
          .insert([{ ...input, user_id: user.id }])
          .select()
          .single();
        if (error) throw error;
        setExpenses((prev) => [data as Expense, ...prev]);
        toast({ title: 'Expense added', description: `${input.name} saved to Supabase` });
        return { data: data as Expense, error: null };
      }

      const { data, error } = await supabase
        .from('salary_entries')
        .insert([expenseToSalaryInsert(input, user.id)])
        .select()
        .single();
      if (error) throw error;
      const parsed = parseExpenseFromSalaryEntry(data as SalaryEntry);
      if (parsed) setExpenses((prev) => [parsed, ...prev]);
      toast({ title: 'Expense added', description: `${input.name} saved to Supabase` });
      return { data: parsed, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add expense';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return { data: null, error };
    }
  };

  const updateExpense = async (id: string, updates: Partial<ExpenseInput>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      if (backend === 'table') {
        const { data, error } = await supabase
          .from('expenses')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) throw error;
        setExpenses((prev) => prev.map((e) => (e.id === id ? (data as Expense) : e)));
        return { data, error: null };
      }

      const current = expenses.find((e) => e.id === id);
      if (!current) return { error: 'Expense not found' };
      const next = { ...current, ...updates };
      const { data, error } = await supabase
        .from('salary_entries')
        .update({
          start_date: next.expense_date,
          end_date: next.expense_date,
          tips: Number(next.amount) || 0,
          currency: next.currency,
          hours_worked: 0,
          base_salary: 0,
          extra_hours: 0,
          description: encodeExpenseDescription({
            name: next.name,
            category: next.category,
            payment_source: next.payment_source,
            notes: next.notes,
            amount: Number(next.amount) || 0,
          }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      const parsed = parseExpenseFromSalaryEntry(data as SalaryEntry);
      if (parsed) setExpenses((prev) => prev.map((e) => (e.id === id ? parsed : e)));
      return { data: parsed, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update expense';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return { data: null, error };
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      if (backend === 'table') {
        const { error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('salary_entries')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        if (error) throw error;
      }
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast({ title: 'Expense deleted' });
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete expense';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return { error };
    }
  };

  const searchExpenses = (
    query: string,
    source?: PaymentSource | 'all',
    category?: ExpenseCategory | 'all'
  ) => {
    const q = query.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesQuery =
        !q ||
        expense.name.toLowerCase().includes(q) ||
        (expense.notes || '').toLowerCase().includes(q) ||
        expense.category.toLowerCase().includes(q);
      const matchesSource = !source || source === 'all' || expense.payment_source === source;
      const matchesCategory = !category || category === 'all' || expense.category === category;
      return matchesQuery && matchesSource && matchesCategory;
    });
  };

  const totals = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const fromTips = expenses
      .filter((e) => e.payment_source === 'tips')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const fromBank = expenses
      .filter((e) => e.payment_source === 'bank')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});
    return { total, fromTips, fromBank, byCategory };
  }, [expenses]);

  return {
    expenses,
    loading,
    backend,
    usingCloud: backend === 'table' || backend === 'salary_entries',
    usingLocal: false,
    expenseMarker: EXPENSE_MARKER,
    addExpense,
    updateExpense,
    deleteExpense,
    searchExpenses,
    totals,
    refetch: fetchExpenses,
  };
};
