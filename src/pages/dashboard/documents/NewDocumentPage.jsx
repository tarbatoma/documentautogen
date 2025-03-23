import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import DOMPurify from 'dompurify';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

const NewDocumentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [branding, setBranding] = useState(null);
  const [logoSettings, setLogoSettings] = useState({
    position: 'centru', // opțiuni: stanga, centru, dreapta, fundal_sus, fundal_centru, fundal_jos
    size: 'mediu'       // opțiuni: mic, mediu, mare
  });
  const [items, setItems] = useState([{ descriere: '', cantitate: 1, pret_unitar: 0 }]);

  const template = location.state?.template;
  const isInvoiceTemplate = template?.category === 'factura';

  useEffect(() => {
    if (!template) {
      navigate('/dashboard/templates');
      return;
    }
    fetchBranding();
    initializeFormData();
  }, [template, navigate]);

  const fetchBranding = async () => {
    try {
      const { data, error } = await supabase
        .from('branding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      setBranding(data);
      console.log("Branding data:", data);
    } catch (error) {
      console.error('Error fetching branding:', error);
    }
  };

  const initializeFormData = () => {
    if (!template?.template_data?.variables) return;
    const initialData = {};
    template.template_data.variables.forEach(variable => {
      initialData[variable] = template.template_data.default_values?.[variable] || '';
    });
    setFormData(initialData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { descriere: '', cantitate: 1, pret_unitar: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.cantitate * item.pret_unitar), 0);
    const tva = subtotal * 0.19; // 19% TVA
    const total = subtotal + tva;
    return {
      subtotal: subtotal.toFixed(2),
      valoare_tva: tva.toFixed(2),
      total_general: total.toFixed(2)
    };
  };

  const generateInvoiceTable = () => {
    const totals = calculateTotals();
    return `
      <table class="w-full mb-8 border-collapse">
        <thead>
          <tr class="bg-gray-50">
            <th class="p-3 text-left border">Descriere</th>
            <th class="p-3 text-right border">Cantitate</th>
            <th class="p-3 text-right border">Preț unitar</th>
            <th class="p-3 text-right border">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td class="p-3 border">${item.descriere}</td>
              <td class="p-3 text-right border">${item.cantitate}</td>
              <td class="p-3 text-right border">${item.pret_unitar} RON</td>
              <td class="p-3 text-right border">${(item.cantitate * item.pret_unitar).toFixed(2)} RON</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  // Stilurile pentru logo
const logoStyles = {
  mic: "width: 100px;",
  mediu: "width: 200px;",
  mare: "width: 300px;"
};

// Stilurile pentru poziționare
const positionStyles = {
  stanga: "top: 20px; left: 20px;",
  centru: "top: 20px; left: 50%; transform: translateX(-50%);",
  dreapta: "top: 20px; right: 20px;",
  fundal_sus: "top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%;",
  fundal_centru: "top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%;",
  fundal_jos: "bottom: 50px; left: 50%; transform: translateX(-50%); width: 80%;"
};



  // Generare HTML pentru document (fără watermark dacă este factură)
  const generateDocumentHTML = (content, values) => {
    let sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span', 'div', 'sub', 'sup', 'img'],
      ALLOWED_ATTR: ['style', 'class', 'src', 'alt'],
      ALLOWED_CSS_PROPERTIES: [
        'font-family', 'font-size', 'color', 'background-color', 'text-align',
        'font-weight', 'font-style', 'text-decoration',
        'position', 'z-index', 'opacity', 'width', 'transform',
        'top', 'bottom', 'left', 'right'
      ]
    });
    
  
    Object.entries(values).forEach(([key, value]) => {
      sanitizedContent = sanitizedContent.split(`{${key}}`).join(value || `{${key}}`);
    });
  
    if (isInvoiceTemplate) {
      const totals = calculateTotals();
      sanitizedContent = sanitizedContent
        .replace('{tabel_produse}', generateInvoiceTable())
        .replace('{subtotal}', totals.subtotal)
        .replace('{valoare_tva}', totals.valoare_tva)
        .replace('{total_general}', totals.total_general);
    } else {
      let logoHtml = '';
      if (branding?.logo_url) {
        logoHtml = `
          <img 
            src="${branding.logo_url}" 
            alt="Company Logo" 
            style="position: absolute; z-index: 0; opacity: 0.1; ${logoStyles[logoSettings.size]} ${positionStyles[logoSettings.position]}"
          />
        `;
      }
      sanitizedContent = sanitizedContent.replace('{logo_firma}', logoHtml);
    }
  
    return sanitizedContent;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const documentName = `${template.name} - ${new Date().toLocaleDateString('ro-RO')}`;
      const { data: doc, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: documentName,
          type: template.category,
          status: 'pending',
          document_data: {
            ...formData,
            items: isInvoiceTemplate ? items : undefined,
            logo_settings: logoSettings
          }
        })
        .select()
        .single();
      if (insertError) throw insertError;
      const htmlContent = generateDocumentHTML(template.template_data.content, formData);
      const options = {
        margin: 10,
        filename: `${documentName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      const pdfBlob = await html2pdf().set(options).from(htmlContent).outputPdf('blob');
      const filePath = `${user.id}/${doc.id}.pdf`;
      const { error: uploadError } = await supabase
        .storage
        .from('documents')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
      if (uploadError) throw uploadError;
      const { error: updateError } = await supabase
        .from('documents')
        .update({ file_path: filePath, status: 'completed' })
        .eq('id', doc.id);
      if (updateError) throw updateError;
      toast.success('Document generat cu succes!');
      navigate('/dashboard/documents');
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Eroare la generarea documentului');
    } finally {
      setLoading(false);
    }
  };

  if (!template) return null;

  // Definim watermarkStyle doar pentru documentele care nu sunt facturi
  let watermarkStyle = {};
  if (!isInvoiceTemplate && branding?.logo_url) {
    const sizeMap = { mic: '20%', mediu: '40%', mare: '60%' };
    const chosenSize = sizeMap[logoSettings.size] || '40%';
    const posMap = {
      stanga: 'top left',
      centru: 'top center',
      dreapta: 'top right',
      fundal_sus: 'center center',
      fundal_centru: 'center center',
      fundal_jos: 'bottom center'
    };
    const chosenPos = posMap[logoSettings.position] || 'top center';
    watermarkStyle = {
      backgroundImage: `url(${branding.logo_url})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: chosenSize,
      backgroundPosition: chosenPos,
      // Ajustează backgroundColor și blend pentru watermark:
      backgroundColor: 'rgba(255,255,255,0.4)',
      backgroundBlendMode: 'lighten'
    };
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/templates')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Înapoi la Template-uri
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Generează Document Nou</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FORMULAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl shadow-sm border border-gray-200 p-6 bg-white"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h2>
              <p className="text-gray-600">
                Completează informațiile necesare pentru generarea documentului
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isInvoiceTemplate && branding?.logo_url && (
                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <h3 className="font-medium text-gray-900">Setări Logo</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poziție Logo
                    </label>
                    <select
                      value={logoSettings.position}
                      onChange={(e) =>
                        setLogoSettings({ ...logoSettings, position: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="stanga">Stânga</option>
                      <option value="centru">Centru</option>
                      <option value="dreapta">Dreapta</option>
                      <option value="fundal_sus">Fundal Sus</option>
                      <option value="fundal_centru">Fundal Centru</option>
                      <option value="fundal_jos">Fundal Jos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensiune Logo
                    </label>
                    <select
                      value={logoSettings.size}
                      onChange={(e) =>
                        setLogoSettings({ ...logoSettings, size: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="mic">Mic</option>
                      <option value="mediu">Mediu</option>
                      <option value="mare">Mare</option>
                    </select>
                  </div>
                </div>
              )}
              {isInvoiceTemplate && (
                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <h3 className="font-medium text-gray-900">Produse / Servicii</h3>
                  {items.map((item, index) => (
                    <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg relative">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descriere
                          </label>
                          <input
                            type="text"
                            value={item.descriere}
                            onChange={(e) => handleItemChange(index, 'descriere', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cantitate
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.cantitate}
                            onChange={(e) => handleItemChange(index, 'cantitate', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preț Unitar (RON)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.pret_unitar}
                            onChange={(e) => handleItemChange(index, 'pret_unitar', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Adaugă Produs/Serviciu
                  </button>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Sumar</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{calculateTotals().subtotal} RON</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TVA (19%):</span>
                        <span className="font-medium">{calculateTotals().valoare_tva} RON</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span>{calculateTotals().total_general} RON</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                {template.template_data.variables && template.template_data.variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {variable.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={formData[variable] || ''}
                      onChange={(e) => handleInputChange(variable, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Se generează...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generează Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
          {/* PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={watermarkStyle}
            className="rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Previzualizare Document
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: generateDocumentHTML(template.template_data.content, formData)
              }}
            />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewDocumentPage;
