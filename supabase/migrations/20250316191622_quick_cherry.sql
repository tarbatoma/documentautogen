/*
  # Fix Template Deletion

  1. Changes
    - Add user_id to templates table if not exists
    - Update RLS policies to allow deletion only for owned templates
    - Add admin role check to policies
*/

-- Add user_id column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'templates'
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE templates ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Templates are viewable by all authenticated users" ON templates;
DROP POLICY IF EXISTS "Users can create templates" ON templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON templates;

-- Create new policies
CREATE POLICY "Templates are viewable by all authenticated users"
  ON templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create templates"
  ON templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON templates
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    (auth.jwt() ->> 'role')::text = 'admin'
  )
  WITH CHECK (
    auth.uid() = user_id OR 
    (auth.jwt() ->> 'role')::text = 'admin'
  );

CREATE POLICY "Users can delete their own templates"
  ON templates
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);