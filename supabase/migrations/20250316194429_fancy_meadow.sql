-- Create storage bucket for logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;

-- Create storage policies for logos bucket
CREATE POLICY "Users can upload their own logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);