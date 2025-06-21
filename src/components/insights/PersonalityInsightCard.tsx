
import React from 'react';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface PersonalityInsightCardProps {
  insights: {
    emotionalStability: number;
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    writingComplexity: number;
    selfReflectionLevel: number;
  } | null;
}

export const PersonalityInsightCard: React.FC<PersonalityInsightCardProps> = ({ insights }) => {
  if (!insights) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Personality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-400">
            <p>Write more entries to unlock personality insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const topTraits = Object.entries(insights)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const frontContent = (
    <Card className="relative flex w-full h-full flex-col rounded-3xl bg-gray-800/50 border-gray-700/50 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-gray-600/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Personality Profile
          <div className="ml-auto text-xs text-gray-400">Hover to explore</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">
              {Math.round(topTraits[0]?.[1] || 0)}/100
            </div>
            <div className="text-gray-400 text-sm capitalize">
              {topTraits[0]?.[0].replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>
          
          <div className="space-y-3">
            {topTraits.map(([trait, score]) => (
              <div key={trait} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize text-sm">
                  {trait.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${Math.round(score)}%` }}
                    />
                  </div>
                  <span className="text-white font-medium text-sm w-8 text-right">{Math.round(score)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const backContent = (
    <Card className="relative flex w-full h-full flex-col rounded-3xl bg-gray-800/60 border-gray-600/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Personality Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-4">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Your Strongest Trait</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="capitalize font-medium">
                {topTraits[0]?.[0].replace(/([A-Z])/g, ' $1').trim()}
              </span> is your most prominent characteristic, suggesting you have a natural tendency toward thoughtful reflection and emotional awareness.
            </p>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Growth Insights</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your writing patterns reveal a balanced approach to personal development, with strong self-reflection capabilities and openness to new experiences.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">All Traits</h4>
            {Object.entries(insights).map(([trait, score]) => (
              <div key={trait} className="flex justify-between items-center py-1">
                <span className="text-gray-400 text-xs capitalize">
                  {trait.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-white font-medium text-xs">{Math.round(score)}/100</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <FlippableCard
      frontContent={frontContent}
      backContent={backContent}
      height="h-[320px]"
      flipOnHover={true}
      flipOnClick={false}
    />
  );
};
