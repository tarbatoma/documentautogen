-- First drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
  DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "Enable update access for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Update logos bucket to be private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'logos';

-- Create new RLS policies for logos bucket
CREATE POLICY "Users can access their own logos"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for admins to access all logos
CREATE POLICY "Admins can access all logos"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'logos' AND 
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  bucket_id = 'logos' AND 
  auth.jwt() ->> 'role' = 'admin'
);