-- Create storage buckets for voice recordings and journal attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('voice-recordings', 'voice-recordings', false, 52428800, ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav']),
  ('journal-attachments', 'journal-attachments', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for voice-recordings bucket
CREATE POLICY "Users can upload their own voice recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'voice-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own voice recordings"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'voice-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own voice recordings"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'voice-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for journal-attachments bucket
CREATE POLICY "Users can upload their own journal attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'journal-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own journal attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'journal-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own journal attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'journal-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);