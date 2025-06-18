
-- Add soft deletion capability to journal entries
ALTER TABLE journal_entries ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create an index for better performance when filtering deleted entries
CREATE INDEX idx_journal_entries_deleted_at ON journal_entries(deleted_at) WHERE deleted_at IS NOT NULL;

-- Add data export tracking table
CREATE TABLE public.data_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  export_type TEXT NOT NULL, -- 'full', 'journal_only', 'habits_only'
  format TEXT NOT NULL, -- 'json', 'csv'
  file_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on data_exports table
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own export records
CREATE POLICY "Users can view their own exports" 
  ON public.data_exports 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Create policy for edge functions to insert export records
CREATE POLICY "Service can create exports" 
  ON public.data_exports 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for edge functions to update export records
CREATE POLICY "Service can update exports" 
  ON public.data_exports 
  FOR UPDATE 
  USING (true);

-- Add function to clean up expired exports
CREATE OR REPLACE FUNCTION public.cleanup_expired_exports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.data_exports 
  WHERE expires_at < now();
END;
$$;
