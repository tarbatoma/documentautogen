/*
  # Fix Database Schema

  1. Changes
    - Drop and recreate documents table with correct structure
    - Update templates table structure
    - Add proper indexes and constraints
    - Fix storage policies

  2. Security
    - Enable RLS on all tables
    - Add proper policies for data access
    - Ensure storage security

  3. Data
    - Add proper template data structure
    - Fix document fields
*/

-- Drop existing tables to clean up
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS templates CASCADE;

-- Create documents table with correct structure
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  file_path text,
  document_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create documents policies
CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create templates table
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

-- Enable RLS on templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create templates policies
CREATE POLICY "Templates are viewable by all authenticated users"
  ON templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Insert template data
INSERT INTO templates (name, description, category, preview_url, template_data) VALUES
(
  'Contract Prestări Servicii',
  'Template standard pentru contracte de prestări servicii',
  'contract',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  '{
    "date_firma": {
      "nume": "Numele firmei dvs.",
      "adresa": "Adresa completă a firmei",
      "cui": "Cod fiscal",
      "reg_com": "Nr. Reg. Comerțului",
      "banca": "Numele băncii",
      "iban": "Cont IBAN",
      "telefon": "Nr. telefon",
      "email": "Email contact"
    },
    "date_client": {
      "nume": "Numele clientului",
      "adresa": "Adresa clientului",
      "cui": "CUI/CNP client",
      "reg_com": "Nr. Reg. Com. client"
    },
    "detalii_contract": {
      "obiect_contract": "Descrierea serviciilor prestate",
      "valoare_contract": "Valoarea totală în EUR",
      "durata_contract": "Durata contractului",
      "modalitate_plata": "Modalitatea de plată",
      "termen_plata": "Termenul de plată"
    },
    "date_semnare": {
      "data": "Data semnării",
      "loc": "Locul semnării"
    }
  }'::jsonb
),
(
  'Factură Standard',
  'Template pentru facturi cu toate elementele necesare',
  'factura',
  'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
  '{
    "date_furnizor": {
      "nume": "Numele firmei dvs.",
      "adresa": "Adresa completă",
      "cui": "Cod fiscal",
      "reg_com": "Nr. Reg. Comerțului",
      "banca": "Numele băncii",
      "iban": "Cont IBAN",
      "capital_social": "Capital social",
      "telefon": "Nr. telefon",
      "email": "Email contact"
    },
    "date_client": {
      "nume": "Numele clientului",
      "adresa": "Adresa completă client",
      "cui": "CUI/CNP client",
      "reg_com": "Nr. Reg. Com. client"
    },
    "detalii_factura": {
      "numar": "Număr factură",
      "data": "Data emiterii",
      "scadenta": "Data scadentă",
      "moneda": "EUR"
    },
    "produse_servicii": {
      "denumire": "Denumire produs/serviciu",
      "cantitate": "Cantitate",
      "pret_unitar": "Preț unitar",
      "valoare": "Valoare totală"
    },
    "mentiuni": {
      "termen_plata": "Termen de plată",
      "penalitati": "Penalități de întârziere",
      "observatii": "Observații"
    }
  }'::jsonb
),
(
  'Ofertă Comercială',
  'Template profesional pentru oferte comerciale',
  'oferta',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
  '{
    "date_firma": {
      "nume": "Numele firmei dvs.",
      "adresa": "Adresa completă",
      "cui": "Cod fiscal",
      "reg_com": "Nr. Reg. Comerțului",
      "telefon": "Nr. telefon",
      "email": "Email contact",
      "website": "Website"
    },
    "date_client": {
      "nume": "Numele clientului",
      "adresa": "Adresa client",
      "persoana_contact": "Persoană contact",
      "telefon": "Telefon contact",
      "email": "Email contact"
    },
    "detalii_oferta": {
      "titlu": "Titlul ofertei",
      "descriere": "Descriere detaliată",
      "produse_servicii": {
        "denumire": "Denumire produs/serviciu",
        "descriere": "Descriere produs/serviciu",
        "cantitate": "Cantitate",
        "pret_unitar": "Preț unitar",
        "valoare": "Valoare totală"
      },
      "valoare_totala": "Valoare totală ofertă",
      "moneda": "EUR",
      "termen_valabilitate": "Termen de valabilitate",
      "termen_livrare": "Termen de livrare",
      "conditii_plata": "Condiții de plată"
    },
    "mentiuni_speciale": {
      "garantie": "Condiții de garanție",
      "transport": "Condiții de transport",
      "alte_mentiuni": "Alte mențiuni importante"
    }
  }'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);