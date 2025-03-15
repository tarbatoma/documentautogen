/*
  # Update User Metadata and Add Business Plan

  1. Updates
    - Add business plan metadata to specific user
    - Add plan limits and features

  2. Security
    - Only affects specified user
    - Maintains existing RLS policies
*/

DO $$
BEGIN
  -- Update user metadata for djtomgray@gmail.com
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object(
    'plan', 'business',
    'features', jsonb_build_object(
      'automations', true,
      'custom_branding', true,
      'priority_support', true,
      'unlimited_documents', true
    ),
    'limits', jsonb_build_object(
      'storage_gb', 100,
      'team_members', 25
    )
  )
  WHERE email = 'djtomgray@gmail.com';
END $$;