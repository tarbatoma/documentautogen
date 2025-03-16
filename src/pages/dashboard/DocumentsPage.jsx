import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Send, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const DocumentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Eroare la încărcarea documentelor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const document = documents.find(d => d.id === id);
      
      // Delete file from storage if it exists
      if (document.file_path) {
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([document.file_path]);

        if (storageError) throw storageError;
      }

      // Delete document record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Document șters cu succes');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare la ștergerea documentului');
    }
  };

  const handleDownload = async (doc) => {
    try {
      if (!doc.file_path || doc.status !== 'completed') {
        toast.error('Documentul nu este disponibil pentru descărcare');
        return;
      }

      // Get a signed URL for the file
      const { data: { signedUrl }, error: signedUrlError } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(doc.file_path, 60); // URL valid for 60 seconds

      if (signedUrlError) throw signedUrlError;

      // Download using the signed URL
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success('Document descărcat cu succes');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Eroare la descărcarea documentului');
    }
  };

  const handleSendEmail = async (document) => {
    try {
      if (!document.file_path || document.status !== 'completed') {
        toast.error('Documentul nu este disponibil pentru trimitere');
        return;
      }

      const { error } = await supabase.functions.invoke('send-document', {
        body: { documentId: document.id }
      });

      if (error) throw error;
      toast.success('Document trimis pe email');
    } catch (error) {
      console.error('Error sending document:', error);
      toast.error('Eroare la trimiterea documentului');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Documentele Mele</h1>
          <button 
            onClick={() => navigate('/dashboard/documents/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generează Document Nou
          </button>
        </div>

        {/* Documents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Se încarcă documentele...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Nu ai creat încă niciun document.</p>
                <button 
                  onClick={() => navigate('/dashboard/documents/new')}
                  className="mt-4 btn-secondary"
                >
                  Creează primul tău document
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nume Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tip
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Creare
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : doc.status === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status === 'completed' ? 'Finalizat' : 
                             doc.status === 'error' ? 'Eroare' : 'În procesare'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString('ro-RO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleDownload(doc)}
                              className={`text-gray-600 hover:text-gray-900 transition-all ${
                                doc.status !== 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                              }`}
                              title={doc.status === 'completed' ? 'Descarcă' : 'Document indisponibil'}
                              disabled={doc.status !== 'completed'}
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(doc)}
                              className={`text-gray-600 hover:text-gray-900 transition-all ${
                                doc.status !== 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                              }`}
                              title={doc.status === 'completed' ? 'Trimite pe email' : 'Document indisponibil'}
                              disabled={doc.status !== 'completed'}
                            >
                              <Send className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => window.open(`/documents/${doc.id}`, '_blank')}
                              className={`text-gray-600 hover:text-gray-900 transition-all ${
                                doc.status !== 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                              }`}
                              title={doc.status === 'completed' ? 'Vizualizează' : 'Document indisponibil'}
                              disabled={doc.status !== 'completed'}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Sigur vrei să ștergi acest document?')) {
                                  handleDelete(doc.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:scale-110 transition-all"
                              title="Șterge"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;