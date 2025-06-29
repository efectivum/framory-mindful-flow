
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Target, TrendingUp, BookOpen } from 'lucide-react';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

export const MainActionsSection: React.FC = () => {
  return (
    <ButtonErrorBoundary fallbackMessage="Navigation buttons are not available">
      <div className="space-y-8">
        <Button className="btn-organic w-full h-16 text-lg font-semibold glow-primary" asChild>
          <Link to="/journal">
            <Plus className="w-6 h-6 mr-3" />
            Start Journaling
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Button className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover" asChild>
            <Link to="/goals">
              <Target className="w-5 h-5 mr-2" />
              Manage Habits
            </Link>
          </Button>
          <Button className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover" asChild>
            <Link to="/insights">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Insights
            </Link>
          </Button>
          <Button className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover" asChild>
            <Link to="/coach">
              <BookOpen className="w-5 h-5 mr-2" />
              Chat with Coach
            </Link>
          </Button>
        </div>
      </div>
    </ButtonErrorBoundary>
  );
};
