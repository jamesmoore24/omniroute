import React, { useState } from 'react';
import { ClipboardList, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RubricGenerator() {
  const [rubric, setRubric] = useState<null | any>(null);

  const generateRubric = () => {
    // Simulated rubric generation
    setRubric({
      categories: [
        {
          name: 'Historical Understanding',
          criteria: [
            'Demonstrates comprehensive knowledge of WWII events',
            'Accurately presents causes and effects',
            'Shows understanding of chronological progression'
          ],
          points: 30
        },
        {
          name: 'Analysis & Critical Thinking',
          criteria: [
            'Provides insightful analysis of events',
            'Makes meaningful connections between facts',
            'Evaluates multiple perspectives'
          ],
          points: 25
        },
        {
          name: 'Evidence & Sources',
          criteria: [
            'Uses relevant primary sources',
            'Properly cites all references',
            'Integrates evidence effectively'
          ],
          points: 25
        },
        {
          name: 'Writing Quality',
          criteria: [
            'Clear and coherent organization',
            'Professional academic tone',
            'Proper grammar and mechanics'
          ],
          points: 20
        }
      ]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-indigo-600" />
        Rubric Generator
      </h3>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={generateRubric}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        Generate Rubric
      </motion.button>
      
      {rubric && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-6"
        >
          {rubric.categories.map((category: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg">{category.name}</h4>
                <span className="text-sm text-gray-600">{category.points} points</span>
              </div>
              <ul className="space-y-2">
                {category.criteria.map((criterion: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <Check className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}