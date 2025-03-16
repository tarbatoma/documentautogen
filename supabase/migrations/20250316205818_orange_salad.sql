-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
  DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "Enable update access for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Ensure logos bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create simplified policies for logo management
CREATE POLICY "Allow public read access to logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Allow authenticated users to update their logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "Allow authenticated users to delete their logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'logos');