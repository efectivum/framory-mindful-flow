import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight, RotateCcw, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContainer } from '@/components/layouts/AppContainer';
import { AppPageHeader } from '@/components/ui/AppPageHeader';
import { AppCard, AppCardContent } from '@/components/ui/AppCard';

const MobileIndex = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <AppContainer width="centered">
        <div className="app-empty-state">
          <div className="app-pulse">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </AppContainer>
    );
  }

  if (!user) {
    return (
      <AppContainer width="centered">
        <div className="app-fade-in">
          <AppPageHeader
            icon={<Plus className="w-8 h-8 text-white" />}
            title="Welcome to Lumatori"
            subtitle="Your personal growth companion for mindful living"
          />
          <AppCard variant="glass">
            <AppCardContent>
              <Link to="/auth">
                <button className="app-button-primary w-full h-12 text-lg rounded-xl">
                  Start Your Journey
                </button>
              </Link>
            </AppCardContent>
          </AppCard>
        </div>
      </AppContainer>
    );
  }

  const suggestions = [
    "What am I grateful for today?",
    "How am I feeling right now?",
    "What did I learn today?",
    "What challenged me today?",
    "What made me smile today?",
    "How can I improve tomorrow?",
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AppContainer width="centered">
      <div className="app-fade-in">
        {/* Header */}
        <AppPageHeader
          icon={<Plus className="w-8 h-8 text-white" />}
          title="Good morning! 👋"
          subtitle="Ready to continue your growth journey?"
        />

        <div className="space-y-6">
          {/* Main Action */}
          <AppCard variant="glass" onClick={() => navigate('/journal')}>
            <AppCardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white">Start writing</span>
                <ArrowRight className="w-6 h-6 text-blue-400" />
              </div>
            </AppCardContent>
          </AppCard>

          {/* Voice Input */}
          <AppCard variant="glass">
            <AppCardContent>
              <div className="flex items-center justify-center gap-3 text-gray-300">
                <Mic className="w-5 h-5" />
                <span>Voice note</span>
              </div>
            </AppCardContent>
          </AppCard>

          {/* Suggestions */}
          <div>
            <h2 className="text-lg font-semibold text-white app-mb-lg">Writing prompts</h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <AppCard key={index} onClick={() => navigate('/journal')}>
                  <AppCardContent className="app-p-md">
                    <div className="flex items-center justify-between group">
                      <span className="text-gray-300 text-sm">{suggestion}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </AppCardContent>
                </AppCard>
              ))}
            </div>
          </div>

          {/* Refresh Action */}
          <div className="app-text-center app-mt-xl">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Click to refresh</span>
            </button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default MobileIndex;
