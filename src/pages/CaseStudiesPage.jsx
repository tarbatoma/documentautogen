import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users, FileText, TrendingUp, ChevronRight } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

const CaseStudiesPage = () => {
  const industries = [
    {
      name: "IT & Software",
      description: "Companii de tehnologie și dezvoltare software",
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&h=300&q=80",
      challenge: "Procesele manuale de documentație consumă în medie 120 de ore lunar per echipă",
      solution: "Automatizarea completă a fluxului de documente tehnice și administrative",
      results: {
        timeReduction: 92,
        costSavings: 85000,
        productivity: 380,
        satisfaction: 99
      },
      timelineData: [
        { month: 'Ian', before: 145, after: 15 },
        { month: 'Feb', before: 165, after: 18 },
        { month: 'Mar', before: 190, after: 20 },
        { month: 'Apr', before: 210, after: 22 },
        { month: 'Mai', before: 235, after: 20 },
        { month: 'Iun', before: 260, after: 21 }
      ]
    },
    {
      name: "Servicii Juridice",
      description: "Cabinete de avocatură și consultanță juridică",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&h=300&q=80",
      challenge: "Timp excesiv dedicat redactării și formatării documentelor legale",
      solution: "Sistem integrat de generare automată a documentelor juridice standardizate",
      results: {
        timeReduction: 78,
        costSavings: 62000,
        productivity: 290,
        satisfaction: 97
      },
      timelineData: [
        { month: 'Ian', before: 110, after: 35 },
        { month: 'Feb', before: 125, after: 32 },
        { month: 'Mar', before: 140, after: 30 },
        { month: 'Apr', before: 155, after: 28 },
        { month: 'Mai', before: 170, after: 25 },
        { month: 'Iun', before: 185, after: 25 }
      ]
    },
    {
      name: "Servicii Financiare",
      description: "Instituții financiare și servicii bancare",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=300&h=300&q=80",
      challenge: "Complexitatea și volumul mare de documente financiare și rapoarte",
      solution: "Automatizarea generării rapoartelor și documentelor financiare",
      results: {
        timeReduction: 85,
        costSavings: 120000,
        productivity: 340,
        satisfaction: 98
      },
      timelineData: [
        { month: 'Ian', before: 180, after: 45 },
        { month: 'Feb', before: 195, after: 42 },
        { month: 'Mar', before: 220, after: 40 },
        { month: 'Apr', before: 245, after: 38 },
        { month: 'Mai', before: 270, after: 35 },
        { month: 'Iun', before: 295, after: 35 }
      ]
    },
    {
      name: "Resurse Umane",
      description: "Departamente HR și agenții de recrutare",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=300&h=300&q=80",
      challenge: "Gestionarea ineficientă a documentelor pentru angajați și candidați",
      solution: "Platformă centralizată pentru generarea automată a documentelor HR",
      results: {
        timeReduction: 75,
        costSavings: 45000,
        productivity: 260,
        satisfaction: 96
      },
      timelineData: [
        { month: 'Ian', before: 85, after: 28 },
        { month: 'Feb', before: 95, after: 25 },
        { month: 'Mar', before: 105, after: 23 },
        { month: 'Apr', before: 115, after: 22 },
        { month: 'Mai', before: 125, after: 20 },
        { month: 'Iun', before: 135, after: 20 }
      ]
    }
  ];

  const COLORS = ['#0EA5E9', '#E2E8F0'];

  return (
    <div className="pt-24 bg-gray-50">
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
              Impactul în Diverse Industrii
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Descoperă cum Document AutoGen transformă procesele de business 
              în diferite domenii de activitate
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  {/* Industry Info */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <img
                        src={industry.image}
                        alt={industry.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{industry.name}</h2>
                        <p className="text-gray-600">{industry.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Provocări în Domeniu</h3>
                        <p className="text-gray-600">{industry.challenge}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Soluția Document AutoGen</h3>
                        <p className="text-gray-600">{industry.solution}</p>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <Building2 className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                          <CountUp
                            end={industry.results.timeReduction}
                            duration={2}
                            suffix="%"
                          />
                        </h4>
                        <p className="text-sm text-gray-600">Reducere Timp</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <Users className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                          <CountUp
                            end={industry.results.satisfaction}
                            duration={2}
                            suffix="%"
                          />
                        </h4>
                        <p className="text-sm text-gray-600">Satisfacție</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <FileText className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                          <CountUp
                            end={industry.results.costSavings}
                            duration={2}
                            prefix="€"
                            separator=","
                          />
                        </h4>
                        <p className="text-sm text-gray-600">Economii Medii Anuale</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                          <CountUp
                            end={industry.results.productivity}
                            duration={2}
                            suffix="%"
                          />
                        </h4>
                        <p className="text-sm text-gray-600">Creștere Productivitate</p>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Timp Mediu de Procesare în Domeniu
                      </h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={industry.timelineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="month" stroke="#64748B" />
                            <YAxis stroke="#64748B" />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="before"
                              stroke="#7C3AED"
                              fill="#7C3AED"
                              fillOpacity={0.2}
                              name="Procesare Tradițională"
                            />
                            <Area
                              type="monotone"
                              dataKey="after"
                              stroke="#0EA5E9"
                              fill="#0EA5E9"
                              fillOpacity={0.2}
                              name="Cu Document AutoGen"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {industry.name !== "Resurse Umane" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Vezi detalii complete pentru {industry.name}</span>
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudiesPage;