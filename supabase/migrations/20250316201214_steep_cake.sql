-- Add logo settings columns to branding table
ALTER TABLE branding 
ADD COLUMN IF NOT EXISTS default_logo_position text DEFAULT 'centru',
ADD COLUMN IF NOT EXISTS default_logo_size text DEFAULT 'mediu';

-- Add logo settings to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS logo_settings jsonb DEFAULT '{"position": "centru", "size": "mediu"}'::jsonb;