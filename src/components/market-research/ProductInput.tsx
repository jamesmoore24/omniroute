import React, { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductInput() {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-indigo-600" />
        Product Description
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your product or idea
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A fitness tracker with hydration reminders and personalized workout recommendations"
            className="input-primary min-h-[120px]"
          />
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!description || isAnalyzing}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Analyzing...
            </div>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Analyze Market Potential
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}