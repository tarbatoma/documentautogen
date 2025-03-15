import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Star } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const VideoTutorialsPage = () => {
  const tutorials = [
    {
      title: "Cum să creezi primul tău document",
      description: "Ghid pas cu pas pentru generarea primului document folosind Document AutoGen",
      duration: "1:45",
      difficulty: "Începător",
      thumbnail: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=800&q=80",
      category: "Bazic"
    },
    {
      title: "Personalizarea template-urilor",
      description: "Învață să personalizezi template-urile pentru nevoile tale specifice",
      duration: "2:30",
      difficulty: "Intermediar",
      thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
      category: "Template-uri"
    },
    {
      title: "Automatizări și integrări",
      description: "Configurează automatizări pentru eficiență maximă",
      duration: "3:15",
      difficulty: "Avansat",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      category: "Automatizări"
    },
    {
      title: "Branding și personalizare",
      description: "Adaugă logo-ul și culorile companiei tale în documente",
      duration: "2:10",
      difficulty: "Intermediar",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      category: "Branding"
    },
    {
      title: "Gestionarea abonamentului",
      description: "Tot ce trebuie să știi despre planuri și upgrade",
      duration: "1:30",
      difficulty: "Începător",
      thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
      category: "Cont"
    },
    {
      title: "Funcții avansate",
      description: "Explorează funcționalitățile premium ale platformei",
      duration: "4:20",
      difficulty: "Avansat",
      thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
      category: "Avansat"
    }
  ];

  const categories = ["Toate", ...new Set(tutorials.map(t => t.category))];
  const [selectedCategory, setSelectedCategory] = React.useState("Toate");

  const filteredTutorials = selectedCategory === "Toate"
    ? tutorials
    : tutorials.filter(t => t.category === selectedCategory);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Video Tutoriale
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Învață să folosești Document AutoGen la maximum cu tutorialele noastre video.
            Fiecare tutorial este creat pentru a-ți arăta pas cu pas cum să folosești platforma.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-gray-900 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {tutorial.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    tutorial.difficulty === "Începător"
                      ? "bg-green-100 text-green-700"
                      : tutorial.difficulty === "Intermediar"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {tutorial.difficulty}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                    4.8
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {tutorial.description}
                </p>
                <button className="w-full bg-gray-100 text-gray-900 rounded-lg px-4 py-2 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Vizionează Acum
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoTutorialsPage;