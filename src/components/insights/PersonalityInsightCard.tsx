
import React from 'react';
import { InsightCard } from '@/components/ui/InsightCard';
import { User, HelpCircle } from 'lucide-react';
import { PersonalityInsights } from '@/hooks/useAnalytics';

interface PersonalityInsightCardProps {
  insights: PersonalityInsights | null;
}

export const PersonalityInsightCard: React.FC<PersonalityInsightCardProps> = ({ insights }) => {
  if (!insights) {
    return (
      <InsightCard
        title="Personality"
        timeframe="This week"
        helpIcon={<HelpCircle className="w-3 h-3" />}
        frontContent={
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Write more entries to unlock personality insights</p>
            </div>
          </div>
        }
        backContent={
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              Continue journaling to discover patterns in your personality traits based on the Big Five model.
            </p>
          </div>
        }
      />
    );
  }

  // Get top traits for front display
  const topTraits = Object.entries(insights)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const personalityType = getPersonalityType(insights);

  const frontContent = (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-light text-white mb-6">{personalityType}</h2>
      <div className="space-y-3">
        {topTraits.map(([trait, score]) => (
          <div key={trait} className="flex justify-between items-center">
            <span className="text-gray-300 capitalize">
              {trait.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-white font-medium text-sm">{score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const backContent = (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-white mb-4">Detailed Analysis</h3>
      <div className="space-y-4">
        {Object.entries(insights).map(([trait, score]) => (
          <div key={trait} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300 capitalize font-medium">
                {trait.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-white">{score}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm">
              {getTraitDescription(trait, score)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <InsightCard
      title="Personality"
      timeframe="This week"
      helpIcon={<HelpCircle className="w-3 h-3" />}
      frontContent={frontContent}
      backContent={backContent}
    />
  );
};

function getPersonalityType(insights: PersonalityInsights): string {
  const { openness, conscientiousness, extraversion, agreeableness, emotionalStability } = insights;
  
  if (openness > 70 && conscientiousness > 70) return "The Visionary Achiever";
  if (extraversion > 70 && agreeableness > 70) return "The Inspiring Connector";
  if (emotionalStability > 70 && conscientiousness > 70) return "The Steady Performer";
  if (openness > 70 && extraversion > 70) return "The Creative Explorer";
  if (agreeableness > 70 && emotionalStability > 70) return "The Harmonious Guide";
  if (conscientiousness > 70) return "The Methodical Planner";
  if (openness > 70) return "The Curious Innovator";
  if (extraversion > 70) return "The Social Energizer";
  if (agreeableness > 70) return "The Compassionate Helper";
  if (emotionalStability > 70) return "The Resilient Optimist";
  
  return "The Balanced Individual";
}

function getTraitDescription(trait: string, score: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    openness: {
      high: "You embrace new experiences and enjoy creative thinking.",
      medium: "You balance traditional approaches with new ideas.",
      low: "You prefer familiar approaches and practical solutions."
    },
    conscientiousness: {
      high: "You're organized, disciplined, and goal-oriented.",
      medium: "You balance structure with flexibility in your approach.",
      low: "You prefer spontaneity and adaptability over rigid planning."
    },
    extraversion: {
      high: "You gain energy from social interactions and external stimulation.",
      medium: "You enjoy both social time and solitude in balance.",
      low: "You prefer quiet reflection and smaller social circles."
    },
    agreeableness: {
      high: "You're cooperative, trusting, and value harmony in relationships.",
      medium: "You balance being helpful with asserting your own needs.",
      low: "You're direct, competitive, and skeptical of others' motives."
    },
    emotionalStability: {
      high: "You remain calm and resilient under pressure.",
      medium: "You handle stress reasonably well with occasional challenges.",
      low: "You're sensitive to stress and experience emotions intensely."
    }
  };

  const level = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
  return descriptions[trait]?.[level] || "Analysis in progress...";
}
