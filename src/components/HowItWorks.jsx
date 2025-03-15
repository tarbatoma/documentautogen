import React from 'react';
import { FileText, Edit, Send } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileText className="w-16 h-16 text-blue-600" />,
      title: "Alegi template-ul dorit",
      description: "Selectează din colecția noastră de template-uri profesionale create de experți."
    },
    {
      icon: <Edit className="w-16 h-16 text-blue-600" />,
      title: "Completezi datele necesare",
      description: "Adaugă informațiile necesare în câmpurile predefinite, rapid și simplu."
    },
    {
      icon: <Send className="w-16 h-16 text-blue-600" />,
      title: "Primești documentul generat",
      description: "Documentul este generat automat, formatat profesional și gata de trimis."
    }
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-50 transform -skew-x-12"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Cum funcționează?
          </h2>
          <p className="text-gray-600 text-lg">
            Proces simplu în 3 pași pentru documente profesionale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-blue-100 transform translate-x-1/2">
                  <div className="absolute top-1/2 right-0 w-3 h-3 bg-blue-400 rounded-full transform -translate-y-1/2"></div>
                </div>
              )}
              
              <div className="card p-8 text-center bg-white relative z-10">
                <div className="flex justify-center mb-8">
                  <div className="p-4 bg-blue-50 rounded-2xl transform hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="btn-primary">
            Începe acum gratuit!
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;