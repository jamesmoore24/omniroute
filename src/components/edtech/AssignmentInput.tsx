import React, { useState } from 'react';
import { BookOpen, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AssignmentInput() {
  const [prompt, setPrompt] = useState('');
  const [assignment, setAssignment] = useState('');

  const generateAssignment = () => {
    // Simulated assignment generation
    const sampleAssignment = `Write a comprehensive essay analyzing the causes, major events, and consequences of World War II. Your essay should:

1. Discuss the political and economic factors that led to the war
2. Analyze key battles and turning points
3. Examine the impact on different regions
4. Evaluate the war's lasting effects on international relations

Requirements:
- Minimum 1000 words
- Include specific examples and historical evidence
- Cite at least 3 primary sources`;

    setAssignment(sampleAssignment);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-indigo-600" />
        Assignment Generator
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Assignment Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Write a history essay on World War II"
            className="input-primary min-h-[100px]"
          />
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={generateAssignment}
          disabled={!prompt}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="h-4 w-4" />
          Generate Assignment
        </motion.button>
        
        {assignment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg"
          >
            <h4 className="font-semibold mb-2">Generated Assignment:</h4>
            <p className="whitespace-pre-wrap text-gray-700">{assignment}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}