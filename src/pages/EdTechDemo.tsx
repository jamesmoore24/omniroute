import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AssignmentInput from '../components/edtech/AssignmentInput';
import RubricGenerator from '../components/edtech/RubricGenerator';
import GradingSimulator from '../components/edtech/GradingSimulator';

export default function EdTechDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              EdTech Platform Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of education with our AI-powered tools for assignment creation,
              grading, and performance tracking.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AssignmentInput />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RubricGenerator />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <GradingSimulator />
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}