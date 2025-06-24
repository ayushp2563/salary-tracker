
-- Enable Row Level Security on salary_entries table
ALTER TABLE public.salary_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for salary_entries
CREATE POLICY "Users can view their own salary entries" 
  ON public.salary_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own salary entries" 
  ON public.salary_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own salary entries" 
  ON public.salary_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own salary entries" 
  ON public.salary_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable real-time updates for salary_entries table
ALTER TABLE public.salary_entries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.salary_entries;
