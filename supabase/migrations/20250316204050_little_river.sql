/*
  # Update Users to Business Plan

  1. Changes
    - Update specified users to business plan
    - Set business features and limits
*/

-- Update user metadata for specified users
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
WHERE email IN ('tarbatoma@gmail.com', 'nafornitadaniela@gmail.com');

-- Update profiles table plan field
UPDATE profiles
SET plan = 'business'
WHERE email IN ('tarbatoma@gmail.com', 'nafornitadaniela@gmail.com');