-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_limits jsonb NOT NULL DEFAULT '{
    "free": 3,
    "essential": 25,
    "pro": -1,
    "business": -1
  }',
  branding jsonb NOT NULL DEFAULT '{
    "primary_color": "#0284c7",
    "secondary_color": "#4f46e5"
  }',
  maintenance_mode boolean NOT NULL DEFAULT false,
  allow_registrations boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Only admins can manage app settings"
  ON app_settings
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO app_settings (
  document_limits,
  branding,
  maintenance_mode,
  allow_registrations
) VALUES (
  '{
    "free": 3,
    "essential": 25,
    "pro": -1,
    "business": -1
  }',
  '{
    "primary_color": "#0284c7",
    "secondary_color": "#4f46e5"
  }',
  false,
  true
) ON CONFLICT DO NOTHING;