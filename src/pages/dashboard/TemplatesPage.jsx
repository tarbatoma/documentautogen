import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, ArrowRight, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import QuillEditor from '../../components/QuillEditor';
import toast from 'react-hot-toast';

const TemplatesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('toate');
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'contract',
    content: ''
  });
  const [userPreferences, setUserPreferences] = useState({});

  useEffect(() => {
    fetchTemplates();
    fetchUserPreferences();
  }, [user]);

  const fetchTemplates = async () => {
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      // Get both user templates and global templates (where user_id is null)
      if (user?.user_metadata?.role !== 'admin') {
        query = query.or(`user_id.eq.${user.id},user_id.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Eroare la încărcarea template-urilor');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_template_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const preferences = {};
      data?.forEach(pref => {
        preferences[pref.template_id] = pref.preferences;
      });
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const handleToggleFavorite = async (templateId) => {
    try {
      const currentPrefs = userPreferences[templateId] || {};
      const newPrefs = {
        ...currentPrefs,
        favorite: !currentPrefs.favorite
      };

      const { error } = await supabase
        .from('user_template_preferences')
        .upsert({
          user_id: user.id,
          template_id: templateId,
          preferences: newPrefs
        });

      if (error) throw error;

      setUserPreferences(prev => ({
        ...prev,
        [templateId]: newPrefs
      }));

      toast.success(newPrefs.favorite ? 'Template adăugat la favorite' : 'Template eliminat de la favorite');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Eroare la actualizarea preferințelor');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    // Don't allow deletion of global templates
    const template = templates.find(t => t.id === templateId);
    if (!template.user_id) {
      toast.error('Nu poți șterge template-urile globale');
      return;
    }

    if (!window.confirm('Ești sigur că vrei să ștergi acest template?')) {
      return;
    }

    try {
      // First delete user preferences for this template
      const { error: prefsError } = await supabase
        .from('user_template_preferences')
        .delete()
        .eq('template_id', templateId);

      if (prefsError) throw prefsError;

      // Then delete the template itself
      const { error: templateError } = await supabase
        .from('templates')
        .delete()
        .match({ id: templateId, user_id: user.id });

      if (templateError) throw templateError;

      // Update local state
      setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== templateId));
      setUserPreferences(prevPrefs => {
        const newPrefs = { ...prevPrefs };
        delete newPrefs[templateId];
        return newPrefs;
      });

      toast.success('Template șters cu succes');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Eroare la ștergerea template-ului');
    }
  };

  const extractVariables = (templateText) => {
    const matches = templateText.match(/\{(.*?)\}/g);
    return matches ? [...new Set(matches.map(v => v.slice(1, -1).trim()))] : [];
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      const variables = extractVariables(newTemplate.content);
      
      const { data, error } = await supabase
        .from('templates')
        .insert([{
          name: newTemplate.name,
          description: newTemplate.description,
          category: newTemplate.category,
          user_id: user.id,
          template_data: {
            content: newTemplate.content,
            variables: variables
          },
          preview_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
        }])
        .select();

      if (error) throw error;

      setTemplates(prevTemplates => [data[0], ...prevTemplates]);
      setShowNewTemplate(false);
      setNewTemplate({
        name: '',
        description: '',
        category: 'contract',
        content: ''
      });
      toast.success('Template creat cu succes!');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Eroare la crearea template-ului');
    }
  };

  const handleUseTemplate = (template) => {
    navigate('/dashboard/documents/new', { 
      state: { 
        template,
        mode: 'create'
      }
    });
  };

  const categories = [
    { id: 'toate', label: 'Toate' },
    { id: 'contract', label: 'Contracte' },
    { id: 'factura', label: 'Facturi' },
    { id: 'oferta', label: 'Oferte' }
  ];

  const filteredTemplates = selectedCategory === 'toate'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Template-uri Disponibile</h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Create Template Button */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowNewTemplate(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crează Template Nou
          </button>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă template-urile...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Preview Image with Actions */}
                <div className="aspect-[4/3] relative">
                  <img
                    src={template.preview_url}
                    alt={template.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(template.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          userPreferences[template.id]?.favorite
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-yellow-500 hover:text-white'
                        }`}
                        title="Adaugă la favorite"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      {template.user_id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                          className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                          title="Șterge template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {template.name}
                    </h3>
                    {!template.user_id && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Global
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {template.description}
                  </p>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
                  >
                    <span>Folosește Template</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nu există template-uri în această categorie
            </h3>
            <p className="text-gray-600">
              Încearcă să selectezi o altă categorie sau creează un template nou.
            </p>
          </div>
        )}

        {/* New Template Modal */}
        {showNewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Crează Template Nou
              </h2>

              <form onSubmit={handleCreateTemplate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume Template
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Contract Prestări Servicii"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descriere
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descriere scurtă a template-ului"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="contract">Contract</option>
                    <option value="factura">Factură</option>
                    <option value="oferta">Ofertă</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conținut Template
                  </label>
                  <div className="border border-gray-300 rounded-lg">
                    <QuillEditor
                      value={newTemplate.content}
                      onChange={(content) => setNewTemplate({...newTemplate, content})}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Folosește {'{variabila}'} pentru a marca câmpurile ce vor fi completate (ex: {'{nume_firma}'})
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTemplate(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Salvează Template
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TemplatesPage;