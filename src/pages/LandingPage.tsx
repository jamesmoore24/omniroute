import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Brain, Target, Users, BarChart, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Innovating Education and Market Research with AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Streamline learning and gain actionable insights effortlessly
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link 
              to="/edtech"
              className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Explore EdTech
            </Link>
            <Link 
              to="/market-research"
              className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
            >
              Try Market Research AI
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="h-8 w-8 text-indigo-600" />,
                title: "Smart Assignment Generation",
                description: "AI-powered creation of customized educational content"
              },
              {
                icon: <Brain className="h-8 w-8 text-indigo-600" />,
                title: "Intelligent Grading",
                description: "Automated assessment with detailed feedback"
              },
              {
                icon: <Target className="h-8 w-8 text-indigo-600" />,
                title: "Performance Tracking",
                description: "Comprehensive analytics and progress monitoring"
              },
              {
                icon: <Users className="h-8 w-8 text-indigo-600" />,
                title: "Virtual Focus Groups",
                description: "AI agents providing diverse market perspectives"
              },
              {
                icon: <BarChart className="h-8 w-8 text-indigo-600" />,
                title: "Real-time Analytics",
                description: "Instant market feedback and trend analysis"
              },
              {
                icon: <Sparkles className="h-8 w-8 text-indigo-600" />,
                title: "Demographic Insights",
                description: "Detailed audience segmentation and preferences"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}