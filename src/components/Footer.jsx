import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

const Footer = () => {
  const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" }
  ];

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, text: "contact@documentautogen.ro" },
    { icon: <Phone className="w-5 h-5" />, text: "+40 721 234 567" },
    { icon: <MapPin className="w-5 h-5" />, text: "București, România" }
  ];

  return (
    <footer className="relative bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,64,60,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
      
      {/* Newsletter Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-12"
        >
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.blue.400),transparent_70%)] opacity-20" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Rămâi la curent cu noutățile
                </h2>
                <p className="text-blue-100">
                  Abonează-te la newsletter și primește sfaturi despre productivitate și automatizare.
                </p>
              </div>
              <div className="flex-1 w-full md:w-auto">
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Adresa ta de email"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    Abonare
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Column */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Document AutoGen</span>
            </div>
            <p className="text-gray-400 mb-6">
              Automatizează crearea documentelor tale profesionale în câteva secunde.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-6">Link-uri Rapide</h3>
            <ul className="space-y-4">
              {['Despre noi', 'Funcționalități', 'Prețuri', 'Blog'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Link to={`/${item.toLowerCase()}`} className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  {info.icon}
                  <span>{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-6">Legal</h3>
            <ul className="space-y-4">
              {['Termeni și condiții', 'Politică de confidențialitate', 'Cookies', 'GDPR'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Link to={`/${item.toLowerCase()}`} className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Document AutoGen. Toate drepturile rezervate.</p>
            <div className="flex gap-8">
              <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;