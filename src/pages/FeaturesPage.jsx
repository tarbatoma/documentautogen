import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Settings, Shield, Palette, Users } from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Template-uri Profesionale",
      description: "Colecție vastă de template-uri create de experți pentru orice tip de document necesar afacerii tale."
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Economisești Timp",
      description: "Automatizează procesul de creare a documentelor și reduce timpul de procesare cu până la 80%."
    },
    {
      icon: <Settings className="w-12 h-12" />,
      title: "Personalizare Completă",
      description: "Adaptează fiecare template la nevoile tale specifice și la identitatea brandului tău."
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Securitate Avansată",
      description: "Datele tale sunt protejate prin criptare de ultimă generație și backup-uri automate."
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Design Modern",
      description: "Documente cu aspect profesional și modern, optimizate pentru impact vizual maxim."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Colaborare în Echipă",
      description: "Lucrează împreună cu echipa ta și păstrează controlul asupra versiunilor documentelor."
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(45% 45% at 50% 50%,#4F46E5_0%,transparent_100%)] opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Funcționalități Complete pentru Documente Perfecte
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Descoperă toate instrumentele de care ai nevoie pentru a crea documente profesionale în timp record.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl"></div>
                <div className="text-blue-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">
              Cum te ajutăm să fii mai eficient?
            </h2>
            <p className="text-xl text-gray-600">
              Fiecare funcționalitate este gândită să-ți facă munca mai ușoară și mai productivă.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Template-uri Predefinite</h3>
                <p className="text-gray-600">Alege din zeci de template-uri profesionale gata de utilizare.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Personalizare Rapidă</h3>
                <p className="text-gray-600">Modifică și adaptează documentele în câteva click-uri.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Export Multiplu</h3>
                <p className="text-gray-600">Exportă documentele în formatele preferate: PDF, Word, sau altele.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=800&q=80"
                alt="Document AutoGen Interface"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;