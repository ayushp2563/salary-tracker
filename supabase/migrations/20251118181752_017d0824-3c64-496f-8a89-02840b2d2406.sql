-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add notification settings to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_time TIME DEFAULT '18:00:00';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT false;

-- Create daily_hours table for tracking daily work hours
CREATE TABLE IF NOT EXISTS public.daily_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  hours_worked NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_hours ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own daily hours" ON public.daily_hours;
DROP POLICY IF EXISTS "Users can create their own daily hours" ON public.daily_hours;
DROP POLICY IF EXISTS "Users can update their own daily hours" ON public.daily_hours;
DROP POLICY IF EXISTS "Users can delete their own daily hours" ON public.daily_hours;

-- Create policies for daily_hours
CREATE POLICY "Users can view their own daily hours" 
ON public.daily_hours 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily hours" 
ON public.daily_hours 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily hours" 
ON public.daily_hours 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily hours" 
ON public.daily_hours 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on daily_hours
DROP TRIGGER IF EXISTS update_daily_hours_updated_at ON public.daily_hours;
CREATE TRIGGER update_daily_hours_updated_at
BEFORE UPDATE ON public.daily_hours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();