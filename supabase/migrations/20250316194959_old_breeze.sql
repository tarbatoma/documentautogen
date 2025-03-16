/*
  # Storage Policies for Logos

  1. Changes
    - Create logos storage bucket if it doesn't exist
    - Drop existing policies to avoid conflicts
    - Create new policies for logo management
    - Enable public access to logos bucket

  2. Security
    - Allow authenticated users to manage their own logos
    - Allow public viewing of logos
    - Enforce user-specific folder structure
*/

-- First check if policies exist and drop them
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view logos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create storage bucket for logos if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('logos', 'logos', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create new storage policies
DO $$ 
BEGIN
  -- Upload policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can upload their own logos' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Users can upload their own logos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'logos' AND 
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- View policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view logos' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Anyone can view logos"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'logos');
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update their own logos' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Users can update their own logos"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
      bucket_id = 'logos' AND 
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can delete their own logos' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Users can delete their own logos"
    ON storage.objects FOR DELETE TO authenticated
    USING (
      bucket_id = 'logos' AND 
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;