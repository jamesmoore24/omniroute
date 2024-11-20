import React, { useState, useEffect } from 'react';
import { Users, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentFeedback {
  id: number;
  avatar: string;
  name: string;
  age: number;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export default function AgentSimulation() {
  const [feedbacks, setFeedbacks] = useState<AgentFeedback[]>([]);

  useEffect(() => {
    // Simulated agent feedbacks
    const sampleFeedbacks: AgentFeedback[] = [
      {
        id: 1,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        name: 'Sarah Chen',
        age: 28,
        feedback: "Love the hydration reminder feature! It's exactly what I need during my workouts.",
        sentiment: 'positive'
      },
      {
        id: 2,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        name: 'Michael Rodriguez',
        age: 34,
        feedback: "The personalization sounds promising, but I'm concerned about the price point.",
        sentiment: 'neutral'
      },
      {
        id: 3,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        name: 'Emma Thompson',
        age: 25,
        feedback: "This would integrate perfectly with my daily fitness routine!",
        sentiment: 'positive'
      }
    ];
    
    // Animate feedbacks appearing one by one
    sampleFeedbacks.forEach((feedback, index) => {
      setTimeout(() => {
        setFeedbacks(prev => [...prev, feedback]);
      }, index * 1000);
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-indigo-600" />
        Virtual Focus Group
      </h3>
      
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <img
              src={feedback.avatar}
              alt={feedback.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{feedback.name}</span>
                <span className="text-sm text-gray-500">Age {feedback.age}</span>
              </div>
              <p className="text-gray-700">{feedback.feedback}</p>
            </div>
          </motion.div>
        ))}
        
        {feedbacks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Virtual agents will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
}