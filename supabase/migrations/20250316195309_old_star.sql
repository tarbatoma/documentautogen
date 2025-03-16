/*
  # Fix Storage RLS Policies

  1. Changes
    - Drop existing policies
    - Create logos bucket with public access
    - Add simplified RLS policies that allow authenticated users to manage files
    - Enable public read access
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view logos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Ensure logos bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create simplified policies that allow authenticated users to manage files
CREATE POLICY "Enable read access for all users"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

CREATE POLICY "Enable insert access for authenticated users"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Enable update access for authenticated users"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "Enable delete access for authenticated users"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'logos');