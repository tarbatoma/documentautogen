import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, Mail, MessageSquare, FileText, 
  CreditCard, Settings, Play, Lock, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const HelpPage = () => {
  const { user } = useAuth();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const isPro = user?.user_metadata?.plan === 'pro';
  const isBusiness = user?.user_metadata?.plan === 'business';

  const quickLinks = [
    { 
      icon: FileText, 
      text: "Ghid Rapid", 
      link: "/dashboard/help/quick-guide",
      description: "Învață rapid cum să folosești platforma"
    },
    { 
      icon: Play, 
      text: "Video Tutoriale", 
      link: "/dashboard/help/video-tutorials",
      description: "Tutoriale video pas cu pas"
    },
    { 
      icon: Settings, 
      text: "Setări Cont", 
      link: "/dashboard/settings",
      description: "Gestionează setările contului tău"
    },
    { 
      icon: CreditCard, 
      text: "Facturare", 
      link: "/dashboard/help/billing",
      description: "Gestionează plățile și facturile"
    }
  ];

  const faq = [
    {
      question: "Cum creez un document nou?",
      answer: `Este foarte simplu să creezi un document nou:
1. Apasă butonul "Generează Document Nou"
2. Alege template-ul potrivit pentru tine
3. Completează datele necesare
4. Apasă pe "Generează" și documentul tău e gata!`
    },
    {
      question: "Pot schimba oricând planul abonamentului?",
      answer: "Da, poți modifica planul oricând din pagina Setări Cont. Modificarea se aplică instant, iar diferența de preț este calculată proporțional."
    },
    {
      question: "Cum îmi pot personaliza branding-ul documentelor?",
      answer: "Personalizarea brandingului este disponibilă exclusiv pentru planul Business. Din secțiunea Setări poți încărca logo-ul companiei și seta culorile brandului tău."
    },
    {
      question: "Documentele generate sunt sigure?",
      answer: "Da, toate datele tale sunt protejate și stocate criptat folosind Supabase. Folosim cele mai bune practici de securitate pentru a-ți proteja informațiile."
    },
    {
      question: "Există costuri ascunse?",
      answer: "Nu, nu există costuri ascunse. Plătești doar pentru planul ales, iar toate funcționalitățile incluse sunt clar specificate pentru fiecare plan în parte."
    }
  ];

  const supportCategories = [
    { value: 'technical', label: 'Tehnic' },
    { value: 'billing', label: 'Facturare' },
    { value: 'upgrade', label: 'Upgrade abonament' },
    { value: 'other', label: 'Altceva' }
  ];

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('support_requests')
        .insert([{
          user_id: user.id,
          email: user.email,
          subject: supportForm.subject,
          message: supportForm.message
        }]);

      if (error) throw error;

      toast.success('Mesajul tău a fost trimis cu succes!');
      setSupportForm({ subject: '', message: '' });
    } catch (error) {
      toast.error('A apărut o eroare la trimiterea mesajului');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Cum te putem ajuta?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600"
          >
            Găsește rapid răspunsuri la întrebările tale sau contactează-ne direct
          </motion.p>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.link}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="bg-blue-100 p-3 rounded-lg w-fit">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item.text}</span>
                  <span className="text-sm text-gray-600">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Întrebări Frecvente</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                  <button
                    onClick={() => setActiveQuestion(activeQuestion === index ? -1 : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="font-medium text-gray-900">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        activeQuestion === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeQuestion === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 text-gray-600 whitespace-pre-line"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Support Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contactează Suportul</h2>
            <form onSubmit={handleSupportSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subiect
                </label>
                <select
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selectează categoria</option>
                  {supportCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj
                </label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrie problema ta aici..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Se trimite...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span>Trimite mesajul</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Live Chat (Pro & Business) */}
        {!isPro && !isBusiness && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Suport Live Chat Premium
                </h3>
                <p className="text-blue-100 mb-4">
                  Upgrade la PRO sau Business pentru a beneficia de suport instant prin chat live.
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Upgrade la PRO
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;