
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight, RotateCcw, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MobileIndex = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white px-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Welcome to Framory
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Your personal growth companion for mindful living
          </p>
          <Link to="/auth">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-xl">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
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

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Good morning! 👋</h1>
        <p className="text-gray-600">Ready to continue your growth journey?</p>
      </div>

      {/* Main Action */}
      <div className="px-6 mb-8">
        <Button 
          onClick={() => navigate('/journal')}
          className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-between px-6 text-lg font-medium"
        >
          <span>Start writing</span>
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Voice Input */}
      <div className="px-6 mb-8">
        <Button 
          variant="outline"
          className="w-full h-14 border-2 border-gray-200 hover:border-gray-300 rounded-2xl flex items-center justify-center gap-3 text-gray-700"
        >
          <Mic className="w-5 h-5" />
          <span>Voice note</span>
        </Button>
      </div>

      {/* Suggestions */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Writing prompts</h2>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => navigate('/journal')}
              className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-between group"
            >
              <span className="text-gray-700">{suggestion}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-20">
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Click to refresh</span>
        </button>
      </div>
    </div>
  );
};

export default MobileIndex;
