import React from 'react';
import { TrendingUp } from 'lucide-react';

export const InsightEmptyState: React.FC = () => {
  return (
    <div className="card-serene text-center space-y-6 py-12 px-6">
      <div className="icon-container-lg mx-auto">
        <TrendingUp className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="text-2xl font-light text-foreground mb-3">Start Your Journey</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your insights will appear here as you write more journal entries and build habits. Start by creating your first entry.
        </p>
      </div>
    </div>
  );
};
