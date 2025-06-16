
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export const PremiumSuccess: React.FC = () => {
  const { checkSubscription } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    // Check subscription status when landing on success page
    checkSubscription();
  }, [checkSubscription]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 border-purple-500/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Welcome to Premium!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-gray-300">
              Congratulations! You now have access to all premium features.
            </p>
            
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>AI-powered insights & analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Weekly AI reports & summaries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Unlimited habit tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Advanced emotional analytics</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Exploring Premium Features
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumSuccess;
