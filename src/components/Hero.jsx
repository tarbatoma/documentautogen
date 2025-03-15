import React from 'react';
import { Play } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(45% 45% at 50% 50%,#4F46E5_0%,transparent_100%)] opacity-5"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            Automatizează Crearea Documentelor în Câteva Secunde
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-gray-600 leading-relaxed">
            Economisește ore întregi în fiecare săptămână generând automat contracte, facturi și oferte profesionale.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2">
              <span>Începe Gratuit</span>
            </button>
            <button className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Vezi cum funcționează</span>
            </button>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
              alt="Document AutoGen Demo"
              className="rounded-2xl shadow-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;