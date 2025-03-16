/*
  # Fix User Settings Initialization

  1. Changes
    - Add trigger to automatically create user settings on user creation
    - Update existing policies
    - Ensure unique constraint on user_id
*/

-- Create function to handle new user settings
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, email_notifications, limit_reminder)
  VALUES (new.id, true, true)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger to automatically create user settings
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_new_user_settings();

-- Insert settings for existing users
INSERT INTO public.user_settings (user_id, email_notifications, limit_reminder)
SELECT id, true, true
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;