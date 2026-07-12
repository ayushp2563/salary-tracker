-- Expenses table for tracking student spending from tips or bank income
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL DEFAULT 'other',
  payment_source TEXT NOT NULL DEFAULT 'bank' CHECK (payment_source IN ('tips', 'bank')),
  currency TEXT NOT NULL DEFAULT 'USD',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_name_idx ON public.expenses(name);
CREATE INDEX IF NOT EXISTS expenses_date_idx ON public.expenses(expense_date);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expenses"
  ON public.expenses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses"
  ON public.expenses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
  ON public.expenses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
  ON public.expenses
  FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE public.expenses REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;

-- Student profile preferences for work-hour caps (CA/US international students)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS student_status TEXT DEFAULT 'domestic',
  ADD COLUMN IF NOT EXISTS weekly_hour_cap NUMERIC DEFAULT 20;
