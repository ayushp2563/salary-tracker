import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Expense, ExpenseCategory, PaymentSource } from '@/types/expense';

type ExpenseInput = Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

const LOCAL_KEY = 'salary-tracker-expenses';

const readLocal = (userId: string): Expense[] => {
  try {
    const raw = localStorage.getItem(`${LOCAL_KEY}:${userId}`);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = (userId: string, expenses: Expense[]) => {
  localStorage.setItem(`${LOCAL_KEY}:${userId}`, JSON.stringify(expenses));
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocal, setUsingLocal] = useState(false);
  const { user } = useAuth();

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setUsingLocal(false);
      setExpenses((data as Expense[]) || []);
    } catch (error) {
      console.warn('Expenses table unavailable, using local storage', error);
      setUsingLocal(true);
      setExpenses(readLocal(user.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (input: ExpenseInput) => {
    if (!user) return { error: 'User not authenticated' };

    if (usingLocal) {
      const entry: Expense = {
        ...input,
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const next = [entry, ...expenses];
      setExpenses(next);
      writeLocal(user.id, next);
      toast({ title: 'Expense added', description: `${input.name} saved` });
      return { data: entry, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...input, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setExpenses((prev) => [data as Expense, ...prev]);
      toast({ title: 'Expense added', description: `${input.name} saved` });
      return { data: data as Expense, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add expense';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateExpense = async (id: string, updates: Partial<ExpenseInput>) => {
    if (!user) return { error: 'User not authenticated' };

    if (usingLocal) {
      const next = expenses.map((e) =>
        e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
      );
      setExpenses(next);
      writeLocal(user.id, next);
      return { error: null };
    }

    try {
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update expense';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    if (usingLocal) {
      const next = expenses.filter((e) => e.id !== id);
      setExpenses(next);
      writeLocal(user.id, next);
      toast({ title: 'Expense deleted' });
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast({ title: 'Expense deleted' });
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete expense';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const searchExpenses = (query: string, source?: PaymentSource | 'all', category?: ExpenseCategory | 'all') => {
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
    usingLocal,
    addExpense,
    updateExpense,
    deleteExpense,
    searchExpenses,
    totals,
    refetch: fetchExpenses,
  };
};
