
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TouchableCard } from '@/components/TouchableCard';
import { Target, BookOpen, TrendingUp, Plus, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileIndex = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome to Framory
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Your personal growth companion for mindful living
          </p>
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-14 text-lg rounded-2xl"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-6 pt-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Good morning! 👋</h1>
          <p className="text-gray-400">Ready to continue your growth journey?</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="space-y-3">
          <TouchableCard className="bg-gradient-to-r from-green-500/20 to-teal-600/20 border-green-500/30">
            <div className="flex items-center">
              <Plus className="w-6 h-6 mr-4 text-green-300" />
              <div>
                <div className="font-medium text-white">Add New Entry</div>
                <div className="text-sm text-green-200/70">Quick journal reflection</div>
              </div>
            </div>
          </TouchableCard>
          
          <TouchableCard className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500/30">
            <div className="flex items-center">
              <Target className="w-6 h-6 mr-4 text-blue-300" />
              <div>
                <div className="font-medium text-white">Track Progress</div>
                <div className="text-sm text-blue-200/70">Update your goals</div>
              </div>
            </div>
          </TouchableCard>
          
          <TouchableCard className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-purple-500/30">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 mr-4 text-purple-300" />
              <div>
                <div className="font-medium text-white">Daily Prompt</div>
                <div className="text-sm text-purple-200/70">Guided reflection</div>
              </div>
            </div>
          </TouchableCard>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Today's Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <TouchableCard className="text-center">
            <div className="text-2xl font-bold text-blue-300 mb-1">12</div>
            <div className="text-gray-400 text-sm">Day Streak</div>
          </TouchableCard>
          
          <TouchableCard className="text-center">
            <div className="text-2xl font-bold text-green-300 mb-1">5</div>
            <div className="text-gray-400 text-sm">This Week</div>
          </TouchableCard>
          
          <TouchableCard className="text-center">
            <div className="text-2xl font-bold text-pink-300 mb-1">8.2</div>
            <div className="text-gray-400 text-sm">Mood Score</div>
          </TouchableCard>
          
          <TouchableCard className="text-center">
            <div className="text-2xl font-bold text-orange-300 mb-1">75%</div>
            <div className="text-gray-400 text-sm">Goals</div>
          </TouchableCard>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Reflections</h2>
        <div className="space-y-3">
          <TouchableCard>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-white font-medium mb-1">Morning Gratitude</div>
                <div className="text-gray-400 text-sm">Grateful for the peaceful morning and...</div>
              </div>
              <div className="text-gray-500 text-xs ml-3">2h</div>
            </div>
          </TouchableCard>
          
          <TouchableCard>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-white font-medium mb-1">Goal Achievement</div>
                <div className="text-gray-400 text-sm">Completed my meditation goal for...</div>
              </div>
              <div className="text-gray-500 text-xs ml-3">1d</div>
            </div>
          </TouchableCard>
          
          <TouchableCard>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-white font-medium mb-1">Weekly Review</div>
                <div className="text-gray-400 text-sm">Reflecting on this week's progress...</div>
              </div>
              <div className="text-gray-500 text-xs ml-3">3d</div>
            </div>
          </TouchableCard>
        </div>
      </div>
    </div>
  );
};

export default MobileIndex;
