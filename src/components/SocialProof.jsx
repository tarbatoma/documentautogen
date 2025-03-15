import React from 'react';
import { Star } from 'lucide-react';

const SocialProof = () => {
  const testimonials = [
    {
      quote: "Mi-a redus cu 80% timpul petrecut pe facturare!",
      author: "Alexandru Popescu",
      role: "Freelancer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      quote: "Contractele sunt gata în câteva secunde, iar clienții sunt impresionați de profesionalismul documentelor.",
      author: "Mihai Ionescu",
      role: "IMM Owner",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Clienții noștri economisesc timp în fiecare zi
          </h2>
          <p className="text-gray-600 text-lg">
            Alătură-te miilor de profesioniști care își automatizează documentele cu Document AutoGen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card p-8 bg-white">
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="flex justify-center items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-xl font-semibold text-gray-900">
            Evaluat excelent de 94% dintre utilizatori
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;