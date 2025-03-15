/*
  # Create Templates Table and Add Initial Data

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template name
      - `description` (text) - Template description
      - `category` (text) - Template category
      - `preview_url` (text) - URL to preview image
      - `template_data` (jsonb) - Template structure and fields
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on templates table
    - Add policy for authenticated users to read templates
*/

-- Create templates table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'templates'
  ) THEN
    CREATE TABLE templates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
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

-- Insert initial templates
INSERT INTO templates (name, description, category, preview_url, template_data) VALUES
(
  'Contract Prestări Servicii',
  'Template standard pentru contracte de prestări servicii',
  'contract',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  '{
    "fields": [
      {
        "id": "client_name",
        "label": "Nume Client",
        "type": "text",
        "placeholder": "Numele complet al clientului",
        "required": true
      },
      {
        "id": "client_address",
        "label": "Adresă Client",
        "type": "textarea",
        "placeholder": "Adresa completă a clientului",
        "required": true
      },
      {
        "id": "service_description",
        "label": "Descriere Servicii",
        "type": "textarea",
        "placeholder": "Descrierea detaliată a serviciilor prestate",
        "required": true
      },
      {
        "id": "contract_value",
        "label": "Valoare Contract (EUR)",
        "type": "number",
        "placeholder": "0.00",
        "required": true
      },
      {
        "id": "start_date",
        "label": "Data Început",
        "type": "date",
        "required": true
      },
      {
        "id": "end_date",
        "label": "Data Sfârșit",
        "type": "date",
        "required": true
      }
    ]
  }'::jsonb
),
(
  'Factură Standard',
  'Template pentru facturi cu toate elementele necesare',
  'factura',
  'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
  '{
    "fields": [
      {
        "id": "client_info",
        "label": "Informații Client",
        "type": "textarea",
        "placeholder": "Numele și adresa completă a clientului",
        "required": true
      },
      {
        "id": "invoice_number",
        "label": "Număr Factură",
        "type": "text",
        "placeholder": "ex: FACT-2024-001",
        "required": true
      },
      {
        "id": "items",
        "label": "Produse/Servicii",
        "type": "textarea",
        "placeholder": "Lista de produse/servicii (unul pe linie)",
        "required": true
      },
      {
        "id": "total_amount",
        "label": "Suma Totală (EUR)",
        "type": "number",
        "placeholder": "0.00",
        "required": true
      },
      {
        "id": "payment_terms",
        "label": "Termen de Plată (zile)",
        "type": "number",
        "placeholder": "30",
        "required": true
      }
    ]
  }'::jsonb
),
(
  'Ofertă Comercială',
  'Template profesional pentru oferte comerciale',
  'oferta',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
  '{
    "fields": [
      {
        "id": "client_name",
        "label": "Nume Client",
        "type": "text",
        "placeholder": "Numele companiei client",
        "required": true
      },
      {
        "id": "offer_description",
        "label": "Descriere Ofertă",
        "type": "textarea",
        "placeholder": "Descriere detaliată a ofertei",
        "required": true
      },
      {
        "id": "products_services",
        "label": "Produse/Servicii Oferite",
        "type": "textarea",
        "placeholder": "Lista detaliată de produse/servicii",
        "required": true
      },
      {
        "id": "total_value",
        "label": "Valoare Totală (EUR)",
        "type": "number",
        "placeholder": "0.00",
        "required": true
      },
      {
        "id": "validity_period",
        "label": "Perioadă Valabilitate (zile)",
        "type": "number",
        "placeholder": "30",
        "required": true
      },
      {
        "id": "special_conditions",
        "label": "Condiții Speciale",
        "type": "textarea",
        "placeholder": "Termeni și condiții speciale (opțional)",
        "required": false
      }
    ]
  }'::jsonb
);