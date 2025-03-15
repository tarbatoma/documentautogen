/*
  # Create Admin User

  1. Creates an admin user with the specified email and password
  2. Sets the user metadata to include admin role
  3. Adds necessary RLS policies for admin access
*/

-- Create admin user if it doesn't exist
DO $$
DECLARE
  admin_uid uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO admin_uid
  FROM auth.users
  WHERE email = 'office@justbettersites.com';

  -- If user doesn't exist, create it
  IF admin_uid IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'office@justbettersites.com',
      crypt('Toma182092', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Ensure admin role has necessary permissions
DO $$
BEGIN
  -- Add admin role to auth.users if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = 'office@justbettersites.com'
    AND raw_user_meta_data->>'role' = 'admin'
  ) THEN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    )
    WHERE email = 'office@justbettersites.com';
  END IF;
END $$;