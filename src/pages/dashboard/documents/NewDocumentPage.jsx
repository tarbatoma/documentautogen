import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
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
    position: 'centru',
    size: 'mediu'
  });
  
  const template = location.state?.template;

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
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setBranding(data);
    } catch (error) {
      console.error('Error fetching branding:', error);
    }
  };

  const initializeFormData = () => {
    if (!template?.template_data?.variables) return;
    
    const initialData = {};
    template.template_data.variables.forEach(variable => {
      initialData[variable] = '';
    });
    setFormData(initialData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const logoStyles = {
    mic: "w-16 h-16",
    mediu: "w-32 h-32",
    mare: "w-48 h-48"
  };

  const positionStyles = {
    stanga: "justify-start",
    centru: "justify-center",
    dreapta: "justify-end",
    fundal_sus: "absolute top-0 left-0 right-0 justify-center",
    fundal_centru: "absolute top-1/2 left-0 right-0 -translate-y-1/2 justify-center",
    fundal_jos: "absolute bottom-0 left-0 right-0 justify-center"
  };

  const generateDocumentHTML = (content, values) => {
    let sanitizedContent = DOMPurify.sanitize(content);
    
    // Replace variables with actual values
    Object.entries(values).forEach(([key, value]) => {
      sanitizedContent = sanitizedContent.replaceAll(`{${key}}`, value || `{${key}}`);
    });

    return `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; position: relative;">
        ${branding?.logo_url ? `
          <div class="flex ${positionStyles[logoSettings.position]} ${
            logoSettings.position.includes('fundal') ? 'z-0' : 'z-10'
          }">
            <img 
              src="${branding.logo_url}" 
              alt="Company Logo" 
              class="${logoStyles[logoSettings.size]} ${
                logoSettings.position.includes('fundal') ? 'opacity-50' : ''
              }"
            >
          </div>
        ` : ''}
        
        <div class="relative z-10">
          <h1 style="text-align: center; color: ${branding?.primary_color || '#0284c7'}; margin-bottom: 30px; font-size: 24px; text-transform: uppercase;">
            ${template.name}
          </h1>

          <div style="color: #333; font-size: 14px;">
            ${sanitizedContent}
          </div>

          <div style="margin-top: 50px; display: flex; justify-content: space-between;">
            <div style="flex: 1;">
              <p style="margin-bottom: 40px;">Prestator:</p>
              <p>_____________________</p>
            </div>
            <div style="flex: 1; text-align: right;">
              <p style="margin-bottom: 40px;">Beneficiar:</p>
              <p>_____________________</p>
            </div>
          </div>
        </div>

        <footer style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
          <p>Document generat la data: ${new Date().toLocaleDateString('ro-RO')}</p>
        </footer>
      </div>
    `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      const documentName = `${template.name} - ${new Date().toLocaleDateString('ro-RO')}`;
      
      // Create document record first
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: documentName,
          type: template.category,
          status: 'pending',
          document_data: {
            ...formData,
            logo_settings: logoSettings
          }
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Generate PDF using html2pdf
      const htmlContent = generateDocumentHTML(template.template_data.content, formData);
      
      const options = {
        margin: 10,
        filename: `${documentName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf()
        .set(options)
        .from(htmlContent)
        .outputPdf('blob');
      
      const filePath = `${user.id}/${document.id}.pdf`;
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
        .update({
          file_path: filePath,
          status: 'completed'
        })
        .eq('id', document.id);

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

  if (!template) {
    return null;
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
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {template.name}
              </h2>
              <p className="text-gray-600">
                Completează informațiile necesare pentru generarea documentului
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Settings */}
              {branding?.logo_url && (
                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <h3 className="font-medium text-gray-900">Setări Logo</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poziție Logo
                    </label>
                    <select
                      value={logoSettings.position}
                      onChange={(e) => setLogoSettings({...logoSettings, position: e.target.value})}
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
                      onChange={(e) => setLogoSettings({...logoSettings, size: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="mic">Mic</option>
                      <option value="mediu">Mediu</option>
                      <option value="mare">Mare</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Document Fields */}
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

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
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