import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Send, ArrowRight, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    documentsThisMonth: 0,
    documentsLimit: 3,
    recentDocuments: [],
    timesSaved: 85 // Static value for time saved percentage
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get user's plan from metadata instead of querying users table
      const plan = user?.user_metadata?.plan || 'free';

      // Set document limit based on plan
      let documentsLimit = 3; // Free plan default
      if (plan === 'essential') documentsLimit = 25;
      else if (plan === 'pro' || plan === 'business') documentsLimit = Infinity;

      // Get documents count for current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyCount, error: countError } = await supabase
        .from('documents')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      if (countError) throw countError;

      // Get recent documents
      const { data: recentDocs, error: recentError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      setDashboardData({
        documentsThisMonth: monthlyCount || 0,
        documentsLimit,
        recentDocuments: recentDocs || [],
        timesSaved: 85
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      // Create blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Document descărcat cu succes');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Eroare la descărcarea documentului');
    }
  };

  const handleSendEmail = async (document) => {
    try {
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

  const isUnlimited = dashboardData.documentsLimit === Infinity;
  const remainingDocuments = isUnlimited ? 
    'Nelimitat' : 
    Math.max(0, dashboardData.documentsLimit - dashboardData.documentsThisMonth);
  const usagePercentage = isUnlimited ? 
    100 : 
    (dashboardData.documentsThisMonth / dashboardData.documentsLimit) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilizare lunară</h2>
          {!isUnlimited ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{dashboardData.documentsThisMonth} din {dashboardData.documentsLimit} documente generate</span>
                  <span>{remainingDocuments} {remainingDocuments === 1 ? 'rămas' : 'rămase'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, usagePercentage)}%` }}
                  />
                </div>
              </div>
              <Link 
                to="/dashboard/settings"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center group"
              >
                <span>Treci la nelimitat</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          ) : (
            <div className="flex items-center text-green-600">
              <Crown className="w-5 h-5 mr-2" />
              <span className="font-medium">Utilizare nelimitată activă ✅</span>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* New Document */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document nou</h2>
            <button 
              onClick={() => navigate('/dashboard/documents/new')}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Generează Document Nou
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistici rapide</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : dashboardData.documentsThisMonth}
                </p>
                <p className="text-sm text-gray-600">Documente luna aceasta</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.timesSaved}%</p>
                <p className="text-sm text-gray-600">Timp economisit</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documente recente</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Se încarcă documentele...</p>
              </div>
            ) : dashboardData.recentDocuments.length === 0 ? (
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
                        Nume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tip
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString('ro-RO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleDownload(doc)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Descarcă"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(doc)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Trimite pe email"
                            >
                              <Send className="w-5 h-5" />
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

export default DashboardPage;