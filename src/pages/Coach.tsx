
import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, LogIn, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Coach = () => {
  const { user, isPremium, isBeta, isAdmin, refreshSubscription, createCheckout, loading } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSubscription();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#171c26]">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Loading AI Coach</h3>
            <p className="text-gray-400 text-sm">
              Setting up your coaching session...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#171c26] p-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30 max-w-md w-full">
          <CardContent className="p-6 space-y-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-white text-xl font-semibold">AI Coach</h2>
            <p className="text-gray-300 text-sm">Please sign in to access your personal AI coach.</p>
            
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Allow access for admin users, premium users, and beta users
  if (isAdmin || isPremium || isBeta) {
    return <ChatInterface />;
  }

  // Show premium gate as overlay for free users
  return (
    <div className="h-screen w-screen relative bg-[#171c26]">
      {/* Blurred chat preview */}
      <div className="absolute inset-0 blur-sm opacity-30">
        <ChatInterface />
      </div>
      
      {/* Premium gate overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50">
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-purple-500/30 max-w-md w-full">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h2 className="text-white text-xl font-semibold">AI Coach</h2>
              </div>
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                disabled={isRefreshing}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Get personalized coaching and insights through our intelligent coach. Ask questions, log activities, and receive real-time guidance on your personal growth journey.
              </p>
              
              <Button 
                onClick={createCheckout}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Premium - $9.99/month
              </Button>
              
              <div className="text-xs text-gray-400">
                ✨ AI-powered insights • 📊 Advanced analytics • 🎯 Unlimited habits
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Coach;
