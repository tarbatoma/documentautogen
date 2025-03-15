import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    {
      question: "Cum anulez abonamentul?",
      answer: "Poți anula abonamentul oricând din contul tău. Nu există perioadă minimă de contract și nu sunt taxe ascunse de anulare."
    },
    {
      question: "Cum schimb planul?",
      answer: "Din contul tău poți face upgrade sau downgrade oricând. Modificarea se aplică instant, iar diferența de preț este calculată proporțional."
    },
    {
      question: "Există costuri ascunse?",
      answer: "Nu, alegi exact planul care ți se potrivește. Nu există taxe sau costuri suplimentare. Plătești doar pentru ce folosești."
    },
    {
      question: "Ce metode de plată acceptați?",
      answer: "Acceptăm plăți prin card bancar (Visa, Mastercard) și transfer bancar pentru planurile Business. Toate plățile sunt procesate securizat."
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-3xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Întrebări Frecvente
          </h2>
          <p className="text-gray-600 text-lg">
            Ai alte întrebări? Contactează-ne și îți răspundem în maxim 24 de ore
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="card overflow-hidden cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <div className={`mt-4 text-gray-600 transition-all duration-200 ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;