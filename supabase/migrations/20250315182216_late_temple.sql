/*
  # Update Templates Structure

  1. Changes
    - Add unique constraint on template name to prevent duplicates
    - Update template data structure to use proper field labels
    - Ensure clean template data insertion
*/

-- Create templates table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'templates'
  ) THEN
    CREATE TABLE templates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL UNIQUE,
      description text,
      category text NOT NULL,
      preview_url text,
      template_data jsonb NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

    -- Create policy
    CREATE POLICY "Templates are viewable by all authenticated users"
      ON templates
      FOR SELECT
      TO authenticated
      USING (true);

    -- Create updated_at trigger
    CREATE TRIGGER update_templates_updated_at
      BEFORE UPDATE ON templates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Clear existing templates to prevent duplicates
TRUNCATE templates;

-- Insert initial templates with proper structure
INSERT INTO templates (name, description, category, preview_url, template_data) VALUES
(
  'Contract Prestări Servicii',
  'Template standard pentru contracte de prestări servicii',
  'contract',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  '{
    "informatii_firma": {
      "nume_firma": "",
      "adresa_firma": "",
      "cod_fiscal": "",
      "telefon": "",
      "email_firma": ""
    },
    "informatii_client": {
      "nume_client": "",
      "adresa_client": ""
    },
    "descriere_servicii": "",
    "valoare_contract_eur": "",
    "data_emitere": "",
    "conditii_generale": "Plata se va efectua în termenii stabiliți conform prezentului contract.",
    "semnaturi": {
      "prestator": "",
      "beneficiar": ""
    }
  }'::jsonb
),
(
  'Factură Standard',
  'Template pentru facturi cu toate elementele necesare',
  'factura',
  'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
  '{
    "informatii_firma": {
      "nume_firma": "",
      "adresa_firma": "",
      "CUI": "",
      "cont_bancar": "",
      "banca": ""
    },
    "informatii_client": {
      "nume_client": "",
      "adresa_client": "",
      "cod_fiscal": ""
    },
    "numar_factura": "",
    "data_emitere": "",
    "produse_servicii": [],
    "suma_totala_eur": "",
    "termen_plata_zile": "",
    "detalii_plata": "Plata se va efectua în contul bancar specificat mai sus."
  }'::jsonb
),
(
  'Ofertă Comercială',
  'Template profesional pentru oferte comerciale',
  'oferta',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
  '{
    "informatii_firma": {
      "nume_firma": "",
      "adresa_firma": "",
      "contact": ""
    },
    "informatii_client": {
      "nume_companie": "",
      "adresa": "",
      "persoana_contact": ""
    },
    "descriere_oferta": "",
    "produse_servicii_oferite": [],
    "valoare_totala_eur": "",
    "perioada_valabilitate_zile": "",
    "conditii_speciale": "Oferta este valabilă până la data expirării perioadei menționate mai sus."
  }'::jsonb
);