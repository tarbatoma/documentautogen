import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Check } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const QuickGuidePage = () => {
  const steps = [
    {
      title: "Autentificare",
      description: "Intră în contul tău Document AutoGen folosind email-ul și parola",
      image: "https://images.unsplash.com/photo-1553408322-e0b50537eb5e?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Creează Document Nou",
      description: "Apasă pe butonul 'Document Nou' din dashboard",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Alege Template",
      description: "Selectează template-ul care se potrivește nevoilor tale",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Completează Datele",
      description: "Introdu informațiile necesare în formularul simplu",
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Generează și Descarcă",
      description: "Apasă 'Generează' și documentul tău este gata de utilizare",
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ghid Rapid Document AutoGen
          </h1>
          <p className="text-gray-600 text-lg">
            Document AutoGen te ajută să creezi documente automatizate simplu și rapid. 
            Iată pașii principali:
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Gata să începi să creezi documente profesionale?
          </h2>
          <p className="text-blue-100 mb-6">
            Ai nevoie de mai multe documente lunare? Fă upgrade ușor la un plan superior.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
            <span>Upgrade Acum</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Additional Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sfaturi Utile</h3>
          <div className="space-y-3">
            {[
              "Salvează template-urile frecvent folosite ca favorite",
              "Folosește funcția de preview înainte de generarea finală",
              "Verifică setările de branding pentru documente personalizate",
              "Activează notificările pentru a fi la curent cu statusul documentelor"
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default QuickGuidePage;