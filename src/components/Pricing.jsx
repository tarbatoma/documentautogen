import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      features: [
        "3 documente/lună",
        "Template-uri de bază",
        "Export PDF",
        "Suport prin email",
      ],
    },
    {
      name: "Essential",
      price: "29",
      features: [
        "25 documente/lună",
        "Template-uri premium",
        "Export PDF și Word",
        "Suport prioritar email",
        "Personalizare brand basic",
      ],
    },
    {
      name: "Pro",
      price: "79",
      features: [
        "Documente nelimitate",
        "Toate template-urile",
        "Toate formatele de export",
        "Suport prioritar 24/7",
        "Branding personalizat complet",
        "Integrare API basic",
      ],
      popular: true,
    },
    {
      name: "Business",
      price: "199",
      features: [
        "Tot ce include Pro",
        "API Access nelimitat",
        "Integrări custom",
        "Manager dedicat",
        "SLA garantat",
        "Training personalizat",
      ],
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Fără surprize, alegi doar ce ai nevoie
          </h2>
          <p className="text-gray-600 text-lg">
            Planuri flexibile care cresc odată cu afacerea ta
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card relative ${
                plan.popular ? 'transform lg:-translate-y-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Cel mai popular
                  </div>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
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
                <button className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  Alege acest plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;