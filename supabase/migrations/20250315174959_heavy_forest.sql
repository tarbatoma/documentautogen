/*
  # Update documents table file_path constraint

  1. Changes
    - Make file_path column nullable since it will be updated after PDF generation
    - Add status column to track document generation progress
*/

-- Make file_path nullable and add status column
DO $$ BEGIN
  -- Make file_path nullable if it exists and is not null
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'documents' 
    AND column_name = 'file_path' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE documents ALTER COLUMN file_path DROP NOT NULL;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'documents' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE documents ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;
END $$;