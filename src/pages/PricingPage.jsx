import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect pentru a începe",
      features: [
        "3 documente/lună",
        "Template-uri de bază",
        "Export PDF",
        "Suport prin email"
      ]
    },
    {
      name: "Essential",
      price: "29",
      description: "Pentru profesioniști independenți",
      features: [
        "25 documente/lună",
        "Template-uri premium",
        "Export PDF și Word",
        "Suport prioritar email",
        "Personalizare brand basic"
      ]
    },
    {
      name: "Pro",
      price: "79",
      description: "Pentru echipe în creștere",
      features: [
        "Documente nelimitate",
        "Toate template-urile",
        "Toate formatele de export",
        "Suport prioritar 24/7",
        "Branding personalizat complet"
      ],
      popular: true
    },
    {
      name: "Business",
      price: "199",
      description: "Pentru companii mari",
      features: [
        "Tot ce include Pro",
        "Manager dedicat",
        "Training personalizat",
        "SLA garantat",
        "Integrări personalizate"
      ]
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
              Planuri Simple și Transparente
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Alege planul care se potrivește cel mai bine nevoilor tale. 
              Fără costuri ascunse, fără surprize.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-1 rounded-full text-sm font-medium transform rotate-45">
                      Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-1 text-xl text-gray-500">€/lună</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}>
                    Alege acest plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Întrebări Frecvente despre Prețuri</h2>
            <p className="text-gray-600">
              Află răspunsurile la cele mai comune întrebări despre planurile noastre
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "Pot să schimb planul în orice moment?",
                answer: "Da, poți face upgrade sau downgrade oricând. Modificarea se aplică instant și diferența de preț este calculată proporțional."
              },
              {
                question: "Există perioadă minimă de contract?",
                answer: "Nu, nu există perioadă minimă de contract. Poți anula abonamentul în orice moment."
              },
              {
                question: "Ce metode de plată acceptați?",
                answer: "Acceptăm plăți prin card bancar (Visa, Mastercard) și transfer bancar pentru planurile Business."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;