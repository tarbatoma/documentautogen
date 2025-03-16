/*
  # Add Template Preferences Table

  1. New Tables
    - user_template_preferences
      - Store user preferences for templates (favorites, etc.)
      - Links users to templates with preference data

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create user_template_preferences table
CREATE TABLE IF NOT EXISTS user_template_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  preferences jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, template_id)
);

-- Enable RLS
ALTER TABLE user_template_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own template preferences"
  ON user_template_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_template_preferences_updated_at
  BEFORE UPDATE ON user_template_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_template_preferences_user_id ON user_template_preferences(user_id);
CREATE INDEX idx_user_template_preferences_template_id ON user_template_preferences(template_id);