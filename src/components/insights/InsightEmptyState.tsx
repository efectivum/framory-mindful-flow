
import React from 'react';
import { TrendingUp } from 'lucide-react';

export const InsightEmptyState: React.FC = () => {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-pulse" 
           style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
        <TrendingUp className="w-10 h-10 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">Start Your Journey</h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Your insights will appear here as you write more journal entries and build habits. Start by creating your first entry.
        </p>
      </div>
    </div>
  );
};
