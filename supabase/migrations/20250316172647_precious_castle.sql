/*
  # Add Templates RLS Policies

  1. Changes
    - Enable RLS on templates table if not already enabled
    - Add policies for authenticated users to:
      - View all templates
      - Create templates
      - Update their own templates
      - Delete their own templates
    - Add user_id column to track template ownership
*/

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

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

-- Drop existing policies if they exist
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
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);