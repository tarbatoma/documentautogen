-- First delete existing template if it exists
DELETE FROM templates WHERE name = 'Factură Standard';

-- Insert the global invoice template
INSERT INTO templates (
  name,
  description,
  category,
  preview_url,
  template_data
) VALUES (
  'Factură Standard',
  'Template standard pentru facturi cu calcul automat TVA și total',
  'factura',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  '{
    "content": "<div class=\"p-8 max-w-4xl mx-auto bg-white\">\n  <div class=\"flex justify-between items-start mb-8\">\n    <div>\n      <h1 class=\"text-2xl font-bold text-gray-900 mb-2\">FACTURĂ FISCALĂ</h1>\n      <p class=\"text-gray-600\">Seria și numărul: {serie_numar}</p>\n      <p class=\"text-gray-600\">Data facturii: {data_factura}</p>\n    </div>\n  </div>\n\n  <div class=\"grid grid-cols-2 gap-8 mb-8\">\n    <div class=\"border-r pr-8\">\n      <h2 class=\"text-lg font-semibold mb-2\">Furnizor:</h2>\n      <p class=\"text-gray-700\">{nume_firma}</p>\n      <p class=\"text-gray-600\">{adresa_firma}</p>\n      <p class=\"text-gray-600\">CUI: {cui_firma}</p>\n      <p class=\"text-gray-600\">Reg. Com.: {reg_com_firma}</p>\n      <p class=\"text-gray-600\">IBAN: {iban_firma}</p>\n      <p class=\"text-gray-600\">Banca: {banca_firma}</p>\n    </div>\n    <div>\n      <h2 class=\"text-lg font-semibold mb-2\">Client:</h2>\n      <p class=\"text-gray-700\">{nume_client}</p>\n      <p class=\"text-gray-600\">{adresa_client}</p>\n      <p class=\"text-gray-600\">CUI: {cui_client}</p>\n      <p class=\"text-gray-600\">Reg. Com.: {reg_com_client}</p>\n    </div>\n  </div>\n\n  {tabel_produse}\n\n  <div class=\"flex justify-end mt-8\">\n    <div class=\"w-64\">\n      <div class=\"flex justify-between py-2 border-b\">\n        <span class=\"font-medium\">Subtotal:</span>\n        <span>{subtotal} RON</span>\n      </div>\n      <div class=\"flex justify-between py-2 border-b\">\n        <span class=\"font-medium\">TVA (19%):</span>\n        <span>{valoare_tva} RON</span>\n      </div>\n      <div class=\"flex justify-between py-2 text-lg font-bold\">\n        <span>Total:</span>\n        <span>{total_general} RON</span>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"mt-12 pt-8 border-t grid grid-cols-2 gap-8\">\n    <div>\n      <h3 class=\"font-semibold mb-2\">Mențiuni:</h3>\n      <p class=\"text-gray-600 text-sm\">{mentiuni}</p>\n    </div>\n    <div class=\"text-right\">\n      <p class=\"font-semibold mb-2\">Termen de plată:</p>\n      <p class=\"text-gray-600\">{termen_plata} zile</p>\n    </div>\n  </div>\n\n  <div class=\"mt-8 pt-8 border-t\">\n    <div class=\"grid grid-cols-2 gap-8\">\n      <div>\n        <p class=\"font-semibold mb-2\">Furnizor</p>\n        <p class=\"text-gray-600\">{nume_firma}</p>\n      </div>\n      <div class=\"text-right\">\n        <p class=\"font-semibold mb-2\">Client</p>\n        <p class=\"text-gray-600\">{nume_client}</p>\n      </div>\n    </div>\n  </div>\n</div>",
    "variables": [
      "serie_numar",
      "data_factura",
      "nume_firma",
      "adresa_firma",
      "cui_firma",
      "reg_com_firma",
      "iban_firma",
      "banca_firma",
      "nume_client",
      "adresa_client",
      "cui_client",
      "reg_com_client",
      "mentiuni",
      "termen_plata"
    ],
    "default_values": {
      "termen_plata": "30",
      "mentiuni": "Factura este valabilă fără semnătură și ștampilă conform art. 319 alin. 29 din Legea 227/2015 privind Codul Fiscal"
    }
  }'::jsonb
);