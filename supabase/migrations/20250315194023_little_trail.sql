-- Update the user's metadata to set them as an admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = 'e966cb00-a5f9-417c-a461-17df3f123631';

-- Ensure the user has the authenticated role
UPDATE auth.users
SET role = 'authenticated'
WHERE id = 'e966cb00-a5f9-417c-a461-17df3f123631';