import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
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
    const initialData = {};
    Object.entries(template.template_data).forEach(([section, fields]) => {
      initialData[section] = {};
      Object.keys(fields).forEach(field => {
        initialData[section][field] = '';
      });
    });
    setFormData(initialData);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generatePDF = async (documentData) => {
    const doc = new jsPDF();
    
    let yPos = 20;
    const margin = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - (margin * 2);

    const addWrappedText = (text, x, y, maxWidth, fontSize = 12) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * (fontSize * 0.352778);
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('CONTRACT PRESTĂRI SERVICII', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(10);
    const documentNumber = `Nr. ${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const currentDate = new Date().toLocaleDateString('ro-RO');
    doc.text(`${documentNumber}`, pageWidth - margin, yPos, { align: 'right' });
    doc.text(`Data: ${currentDate}`, pageWidth - margin, yPos + lineHeight, { align: 'right' });
    yPos += lineHeight * 4;

    const leftColumnX = margin;
    const rightColumnX = pageWidth / 2 + 10;
    let leftColumnY = yPos;
    let rightColumnY = yPos;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('FURNIZOR:', leftColumnX, leftColumnY);
    leftColumnY += lineHeight * 1.5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (documentData.date_firma) {
      const companyDetails = [
        documentData.date_firma.nume,
        `Adresa: ${documentData.date_firma.adresa}`,
        `CUI: ${documentData.date_firma.cui}`,
        `Reg. Com.: ${documentData.date_firma.reg_com}`,
        `IBAN: ${documentData.date_firma.iban}`,
        `Banca: ${documentData.date_firma.banca}`,
        `Tel: ${documentData.date_firma.telefon}`,
        `Email: ${documentData.date_firma.email}`
      ];

      companyDetails.forEach(detail => {
        if (detail && typeof detail === 'string') {
          const lines = doc.splitTextToSize(detail, (pageWidth / 2) - margin - 10);
          doc.text(lines, leftColumnX, leftColumnY);
          leftColumnY += lines.length * lineHeight;
        }
      });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CLIENT:', rightColumnX, rightColumnY);
    rightColumnY += lineHeight * 1.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (documentData.date_client) {
      const clientDetails = [
        documentData.date_client.nume,
        `Adresa: ${documentData.date_client.adresa}`,
        `CUI: ${documentData.date_client.cui}`,
        documentData.date_client.reg_com ? `Reg. Com.: ${documentData.date_client.reg_com}` : ''
      ].filter(Boolean);

      clientDetails.forEach(detail => {
        if (detail && typeof detail === 'string') {
          const lines = doc.splitTextToSize(detail, (pageWidth / 2) - margin - 10);
          doc.text(lines, rightColumnX, rightColumnY);
          rightColumnY += lines.length * lineHeight;
        }
      });
    }

    yPos = Math.max(leftColumnY, rightColumnY) + lineHeight * 2;

    if (documentData.detalii_contract) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('DETALII CONTRACT:', margin, yPos);
      yPos += lineHeight * 1.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      const contractDetails = [
        { label: 'OBIECT CONTRACT:', value: documentData.detalii_contract.obiect_contract },
        { label: 'DURATA CONTRACT:', value: documentData.detalii_contract.durata_contract },
        { label: 'VALOARE CONTRACT:', value: `${documentData.detalii_contract.valoare_contract} EUR` },
        { label: 'MODALITATE PLATA:', value: documentData.detalii_contract.modalitate_plata },
        { label: 'TERMEN PLATA:', value: documentData.detalii_contract.termen_plata }
      ];

      contractDetails.forEach(detail => {
        if (detail.value) {
          doc.setFont('helvetica', 'bold');
          doc.text(detail.label, margin, yPos);
          doc.setFont('helvetica', 'normal');
          const lines = doc.splitTextToSize(detail.value, contentWidth - 20);
          doc.text(lines, margin + 5, yPos + lineHeight);
          yPos += (lines.length + 1) * lineHeight + 5;
        }
      });
    }

    yPos = Math.min(yPos + lineHeight * 2, 220);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMENI ȘI CONDIȚII:', margin, yPos);
    yPos += lineHeight * 1.5;
    
    doc.setFont('helvetica', 'normal');
    const terms = [
      '1. Plata se va efectua în termenul stabilit conform prezentului document.',
      '2. Documentul este valabil fără semnătură și ștampilă conform legii 227/2015 privind Codul fiscal.'
    ];
    
    terms.forEach(term => {
      const lines = doc.splitTextToSize(term, contentWidth - 10);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + 2;
    });

    yPos = 250;
    doc.setFont('helvetica', 'bold');
    doc.text('FURNIZOR', margin, yPos);
    doc.text('CLIENT', pageWidth - margin - 30, yPos);
    
    yPos += lineHeight * 2;
    doc.line(margin, yPos, margin + 40, yPos);
    doc.line(pageWidth - margin - 40, yPos, pageWidth - margin, yPos);

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const footerText = `Document generat automat de ${documentData.date_firma?.nume || 'Document AutoGen'} • ${currentDate}`;
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    return doc.output('blob');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      const documentName = `${template.name} - ${new Date().toLocaleDateString('ro-RO')}`;
      
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: documentName,
          type: template.category,
          status: 'pending',
          document_data: formData
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const pdfBlob = await generatePDF(formData);
      
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
          file_path: `${document.id}.pdf`,
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
      <div className="max-w-5xl mx-auto space-y-8">
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {Object.entries(template.template_data).map(([section, fields]) => (
              <div key={section} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {section.replace(/_/g, ' ')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(fields).map(([field, placeholder]) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {field.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        value={formData[section]?.[field] || ''}
                        onChange={(e) => handleInputChange(section, field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={placeholder}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

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
      </div>
    </DashboardLayout>
  );
};

export default NewDocumentPage;