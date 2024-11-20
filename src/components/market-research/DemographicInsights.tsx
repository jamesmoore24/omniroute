import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DemographicInsights() {
  const data = [
    { name: 'Very Interested', value: 45 },
    { name: 'Somewhat Interested', value: 30 },
    { name: 'Not Interested', value: 25 }
  ];

  const COLORS = ['#4F46E5', '#818CF8', '#E5E7EB'];

  const ageGroups = [
    { group: '18-24', percentage: 15 },
    { group: '25-34', percentage: 40 },
    { group: '35-44', percentage: 25 },
    { group: '45-54', percentage: 15 },
    { group: '55+', percentage: 5 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart className="h-5 w-5 text-indigo-600" />
        Market Insights
      </h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Interest Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Age Distribution</h4>
          <div className="space-y-3">
            {ageGroups.map((item, index) => (
              <motion.div
                key={item.group}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between mb-1">
                  <span>{item.group}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-indigo-600 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}