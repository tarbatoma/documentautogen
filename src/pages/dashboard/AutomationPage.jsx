import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Workflow, Lock, ArrowRight, Mail, Cloud, MessageSquare, 
  Plus, Trash2, Settings, Check, X
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AutomationPage = () => {
  const { user } = useAuth();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewAutomation, setShowNewAutomation] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    type: 'email',
    config: {}
  });

  const isPro = user?.user_metadata?.plan === 'pro' || user?.user_metadata?.plan === 'business';

  useEffect(() => {
    if (isPro) {
      fetchAutomations();
    }
  }, [isPro, user]);

  const fetchAutomations = async () => {
    try {
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      toast.error('Eroare la încărcarea automatizărilor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAutomation = async () => {
    try {
      const { data, error } = await supabase
        .from('automations')
        .insert([{
          user_id: user.id,
          name: newAutomation.name,
          type: newAutomation.type,
          config: newAutomation.config
        }])
        .select()
        .single();

      if (error) throw error;

      setAutomations([data, ...automations]);
      setShowNewAutomation(false);
      setNewAutomation({ name: '', type: 'email', config: {} });
      toast.success('Automatizare creată cu succes!');
    } catch (error) {
      toast.error('Eroare la crearea automatizării');
      console.error('Error:', error);
    }
  };

  const handleDeleteAutomation = async (id) => {
    try {
      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAutomations(automations.filter(a => a.id !== id));
      toast.success('Automatizare ștearsă cu succes!');
    } catch (error) {
      toast.error('Eroare la ștergerea automatizării');
      console.error('Error:', error);
    }
  };

  const handleToggleAutomation = async (id, currentActive) => {
    try {
      const { error } = await supabase
        .from('automations')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      setAutomations(automations.map(a => 
        a.id === id ? { ...a, active: !currentActive } : a
      ));
      toast.success(`Automatizare ${!currentActive ? 'activată' : 'dezactivată'} cu succes!`);
    } catch (error) {
      toast.error('Eroare la actualizarea automatizării');
      console.error('Error:', error);
    }
  };

  if (!isPro) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-lg"
          >
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Automatizări disponibile în planul PRO
            </h2>
            <p className="text-gray-600 mb-8">
              Fă upgrade la planul PRO pentru a accesa automatizări puternice și a economisi și mai mult timp.
            </p>
            <button className="btn-primary flex items-center gap-2 mx-auto">
              <span>Fă Upgrade Acum</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const automationTypes = [
    {
      id: 'email',
      name: 'Email Automat',
      description: 'Trimite automat documentele generate pe email',
      icon: Mail,
      configFields: ['recipient_email', 'subject_template', 'body_template']
    },
    {
      id: 'drive',
      name: 'Google Drive',
      description: 'Salvează documentele în Google Drive',
      icon: Cloud,
      configFields: ['folder_id', 'file_name_template']
    },
    {
      id: 'slack',
      name: 'Notificări Slack',
      description: 'Trimite notificări pe Slack',
      icon: MessageSquare,
      configFields: ['webhook_url', 'channel', 'message_template']
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Automatizări</h1>
          <button 
            onClick={() => setShowNewAutomation(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Creează Automatizare Nouă
          </button>
        </div>

        {/* New Automation Modal */}
        {showNewAutomation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Creează Automatizare Nouă
                </h2>
                <button 
                  onClick={() => setShowNewAutomation(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume Automatizare
                  </label>
                  <input
                    type="text"
                    value={newAutomation.name}
                    onChange={(e) => setNewAutomation({
                      ...newAutomation,
                      name: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Trimite facturi pe email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip Automatizare
                  </label>
                  <select
                    value={newAutomation.type}
                    onChange={(e) => setNewAutomation({
                      ...newAutomation,
                      type: e.target.value,
                      config: {}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {automationTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Config Fields */}
                {automationTypes.find(t => t.id === newAutomation.type)?.configFields.map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </label>
                    <input
                      type="text"
                      value={newAutomation.config[field] || ''}
                      onChange={(e) => setNewAutomation({
                        ...newAutomation,
                        config: {
                          ...newAutomation.config,
                          [field]: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowNewAutomation(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleCreateAutomation}
                    className="btn-primary"
                  >
                    Creează Automatizare
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Automations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă automatizările...</p>
          </div>
        ) : automations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nu ai creat încă nicio automatizare.</p>
            <button 
              onClick={() => setShowNewAutomation(true)}
              className="mt-4 btn-secondary"
            >
              Creează prima ta automatizare
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((automation) => {
              const type = automationTypes.find(t => t.id === automation.type);
              const Icon = type?.icon || Workflow;
              
              return (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {automation.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {type?.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAutomation(automation.id, automation.active)}
                      className={`p-2 rounded-lg ${
                        automation.active 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {automation.active ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button className="text-gray-600 hover:text-gray-900">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAutomation(automation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AutomationPage;