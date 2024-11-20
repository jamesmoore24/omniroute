import React, { useState } from 'react';
import { Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GradingSimulator() {
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState<null | any>(null);

  const simulateGrading = () => {
    setIsGrading(true);
    setGrade(null);
    
    // Simulate API delay
    setTimeout(() => {
      setIsGrading(false);
      setGrade({
        score: 88,
        feedback: {
          'Historical Understanding': {
            score: 27,
            feedback: 'Strong understanding of major events and their significance.'
          },
          'Analysis & Critical Thinking': {
            score: 22,
            feedback: 'Good analysis but could develop some points further.'
          },
          'Evidence & Sources': {
            score: 21,
            feedback: 'Well-supported arguments with relevant sources.'
          },
          'Writing Quality': {
            score: 18,
            feedback: 'Clear writing style with minor mechanical errors.'
          }
        }
      });
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Award className="h-5 w-5 text-indigo-600" />
        Auto-Grading System
      </h3>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={simulateGrading}
        disabled={isGrading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isGrading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Grading in progress...
          </>
        ) : (
          'Grade Assignment'
        )}
      </motion.button>
      
      {grade && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <div className="text-center">
            <span className="text-4xl font-bold text-indigo-600">{grade.score}%</span>
            <p className="text-gray-600">Overall Score</p>
          </div>
          
          <div className="space-y-4">
            {Object.entries(grade.feedback).map(([category, data]: [string, any], index: number) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{category}</h4>
                  <span className="text-sm text-gray-600">{data.score} points</span>
                </div>
                <p className="text-gray-700">{data.feedback}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}