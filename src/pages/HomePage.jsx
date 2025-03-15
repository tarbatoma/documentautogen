import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

const HomePage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const caseStudyData = {
    timelineData: [
      { month: 'Ian', before: 120, after: 25 },
      { month: 'Feb', before: 150, after: 28 },
      { month: 'Mar', before: 180, after: 30 },
      { month: 'Apr', before: 220, after: 32 },
      { month: 'Mai', before: 250, after: 35 },
      { month: 'Iun', before: 280, after: 35 }
    ],
    savingsData: [
      { name: 'Timp Economisit', value: 75 },
      { name: 'Timp Necesar', value: 25 }
    ],
    impactMetrics: [
      { label: 'Reducere Timp', value: 75, suffix: '%' },
      { label: 'Creștere Productivitate', value: 280, suffix: '%' },
      { label: 'ROI', value: 320, suffix: '%' },
      { label: 'Satisfacție Clienți', value: 98, suffix: '%' }
    ]
  };

  const COLORS = ['#0EA5E9', '#E2E8F0'];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(45% 45% at 50% 50%,#4F46E5_0%,transparent_100%)] opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8"
              variants={fadeIn}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Automatizează Crearea
              </span>
              <br />
              <span className="text-gray-900">Documentelor Tale</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-gray-600 leading-relaxed"
              variants={fadeIn}
            >
              Economisește ore întregi în fiecare săptămână generând automat contracte, 
              facturi și oferte profesionale.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeIn}
            >
              <Link 
                to="/signup" 
                className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 group"
              >
                <span>Începe Gratuit</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Vezi cum funcționează</span>
              </button>
            </motion.div>

            <motion.div 
              className="mt-20 relative"
              variants={fadeIn}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
                alt="Document AutoGen Demo"
                className="rounded-2xl shadow-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
              Studiu de Caz: Transformarea Digitală
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descoperă cum o companie și-a îmbunătățit eficiența cu 75% folosind Document AutoGen
            </p>
          </motion.div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {caseStudyData.impactMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUp
                    end={metric.value}
                    duration={2}
                    suffix={metric.suffix}
                  />
                </h3>
                <p className="text-gray-600">{metric.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Timeline Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Timpul de Procesare a Documentelor
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseStudyData.timelineData}>
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
                      name="Înainte"
                    />
                    <Area
                      type="monotone"
                      dataKey="after"
                      stroke="#0EA5E9"
                      fill="#0EA5E9"
                      fillOpacity={0.2}
                      name="După"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Savings Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Distribuția Timpului
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={caseStudyData.savingsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      fill="#0EA5E9"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {caseStudyData.savingsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">Timp Economisit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span className="text-sm text-gray-600">Timp Necesar</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to="/case-studies"
              className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 group"
            >
              <span>Vezi mai multe studii de caz</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;