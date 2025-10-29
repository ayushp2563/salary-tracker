-- Add extra_hours column to salary_entries table
ALTER TABLE public.salary_entries 
ADD COLUMN extra_hours numeric DEFAULT 0;