/*
  # Add document_data column to documents table

  1. Changes
    - Add `document_data` column to store form data as JSON
    - Column is JSONB type to store structured data efficiently
    - Column is nullable to support existing records
*/

-- Add document_data column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'documents'
    AND column_name = 'document_data'
  ) THEN
    ALTER TABLE documents 
    ADD COLUMN document_data jsonb;
  END IF;
END $$;