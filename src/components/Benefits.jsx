import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, FileText, TrendingUp, CheckCircle, ArrowUpRight } from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import CountUp from 'react-countup';

const Benefits = () => {
  const statsRef = React.useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  const impactStats = [
    { 
      label: 'Timp Economisit',
      value: 85,
      suffix: '%',
      icon: <Clock className="w-6 h-6" />,
      description: 'Reducere în timpul de procesare'
    },
    {
      label: 'Satisfacție Clienți',
      value: 99.8,
      suffix: '%',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Rata de satisfacție'
    },
    {
      label: 'ROI Mediu',
      value: 312,
      suffix: '%',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Return of Investment'
    },
    {
      label: 'Documente Generate',
      value: 1500000,
      suffix: '+',
      icon: <FileText className="w-6 h-6" />,
      description: 'În ultimul an'
    }
  ];

  const timelineData = [
    { month: 'Ian', Traditional: 120, AutoGen: 25 },
    { month: 'Feb', Traditional: 150, AutoGen: 28 },
    { month: 'Mar', Traditional: 180, AutoGen: 30 },
    { month: 'Apr', Traditional: 220, AutoGen: 32 },
    { month: 'Mai', Traditional: 250, AutoGen: 35 },
    { month: 'Iun', Traditional: 280, AutoGen: 35 }
  ];

  const productivityData = [
    { name: 'Luni', value: 85 },
    { name: 'Marți', value: 92 },
    { name: 'Miercuri', value: 88 },
    { name: 'Joi', value: 95 },
    { name: 'Vineri', value: 89 }
  ];

  const pieData = [
    { name: 'Timp Economisit', value: 85 },
    { name: 'Timp Necesar', value: 15 }
  ];

  const COLORS = ['#0ea5e9', '#e2e8f0'];

  const features = [
    {
      illustration: (
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full animate-pulse" />
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="rocket-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <path
              fill="url(#rocket-gradient)"
              d="M100,20 L120,90 L180,90 L130,130 L150,190 L100,150 L50,190 L70,130 L20,90 L80,90 Z"
            />
            <circle cx="100" cy="90" r="10" fill="#fff" />
          </svg>
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping" />
        </div>
      ),
      title: "Viteză Incredibilă",
      description: "Generează documente complexe în mai puțin de 30 de secunde",
      metric: "30x",
      metricLabel: "mai rapid"
    },
    {
      illustration: (
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse" />
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <path
              fill="url(#shield-gradient)"
              d="M100,20 C140,20 170,40 170,80 C170,120 140,160 100,180 C60,160 30,120 30,80 C30,40 60,20 100,20 Z"
            />
            <path
              fill="#fff"
              d="M90,100 L80,90 L70,100 L90,120 L130,80 L120,70 Z"
            />
          </svg>
          <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-purple-500 rounded-full opacity-20 animate-ping" />
        </div>
      ),
      title: "Siguranță Garantată",
      description: "Criptare end-to-end și conformitate GDPR pentru toate documentele",
      metric: "100%",
      metricLabel: "securizat"
    },
    {
      illustration: (
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full animate-pulse" />
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <path
              fill="url(#chart-gradient)"
              d="M40,160 L40,120 L80,80 L120,130 L160,40 L160,160 Z"
            />
            <circle cx="40" cy="120" r="8" fill="#fff" />
            <circle cx="80" cy="80" r="8" fill="#fff" />
            <circle cx="120" cy="130" r="8" fill="#fff" />
            <circle cx="160" cy="40" r="8" fill="#fff" />
          </svg>
          <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-emerald-500 rounded-full opacity-20 animate-ping" />
        </div>
      ),
      title: "Eficiență Maximă",
      description: "Reduce costurile operaționale și elimină erorile umane",
      metric: "85%",
      metricLabel: "economii"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-6">
            Transformă Modul în Care Lucrezi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descoperă cum Document AutoGen revoluționează procesul de creare a documentelor
          </p>
        </motion.div>

        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl transform transition-transform group-hover:scale-105" />
              <div className="relative bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary-100 rounded-xl text-primary-600">
                    {stat.icon}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    decimal="."
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                    suffix={stat.suffix}
                  />
                </h3>
                <p className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</p>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="relative bg-white rounded-2xl p-8 shadow-xl transform transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="animate-float"
                >
                  {feature.illustration}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-primary-600">{feature.metric}</span>
                  <span className="text-gray-600 mb-1">{feature.metricLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Eficiență în Timp
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Traditional"
                    stroke="#7C3AED"
                    fill="#7C3AED"
                    fillOpacity={0.2}
                    name="Metoda Tradițională"
                  />
                  <Area
                    type="monotone"
                    dataKey="AutoGen"
                    stroke="#0EA5E9"
                    fill="#0EA5E9"
                    fillOpacity={0.2}
                    name="Cu Document AutoGen"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Creșterea Productivității
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0EA5E9"
                    strokeWidth={3}
                    dot={{ fill: '#0EA5E9', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
            Timpul Tău Economisit
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#0EA5E9"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-sm text-gray-600">Timp Economisit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-sm text-gray-600">Timp Necesar</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;