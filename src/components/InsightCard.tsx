
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";

type AIInsightProps = {
  quickAnalysis: { quick_takeaways: string[] };
};

type WeeklyInsightProps = {
  latestInsight: {
    emotional_summary: string;
    growth_observations?: string[];
  };
};

export const AIInsightCard: React.FC<AIInsightProps> = ({ quickAnalysis }) => {
  if (!quickAnalysis || !quickAnalysis.quick_takeaways || quickAnalysis.quick_takeaways.length === 0)
    return null;

  return (
    <Card className="bg-gray-800/60 border-gray-700/80 mt-3">
      <CardContent className="p-4">
        <div className="text-xs text-purple-300 font-semibold mb-1 flex items-center gap-2">
          <FileChartLine className="w-4 h-4" /> Latest Insight
          <Badge variant="secondary" className="ml-auto">AI</Badge>
        </div>
        <div className="text-gray-200 text-sm leading-snug">
          <span>{quickAnalysis.quick_takeaways[0]}</span>
          {quickAnalysis.quick_takeaways.length > 1 && (
            <Button
              variant="link"
              size="sm"
              className="ml-2 text-xs px-1 h-6"
              onClick={() => window.location.href = "/insights"}
            >
              See all
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const WeeklyInsightCard: React.FC<WeeklyInsightProps> = ({ latestInsight }) => {
  if (!latestInsight) return null;

  return (
    <Card className="bg-gradient-to-br from-purple-700/20 to-pink-700/20 border-purple-700/30 mt-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-pink-300 font-semibold flex items-center gap-2">
            <FileChartLine className="w-4 h-4" />
            Weekly Insight
          </div>
          <Badge variant="outline" className="text-xs">This Week</Badge>
        </div>
        <div className="text-gray-200 text-xs mb-1">{latestInsight.emotional_summary}</div>
        <div className="text-gray-400 text-xs flex flex-wrap gap-1">
          {latestInsight.growth_observations?.slice(0, 2).map((growth, idx) => (
            <Badge key={idx} className="text-emerald-200 bg-emerald-800/10 border-emerald-500/20 text-xs">{growth}</Badge>
          ))}
        </div>
        <Button
          variant="link"
          size="sm"
          className="mt-2 text-xs p-0 h-6"
          onClick={() => window.location.href = "/insights"}
        >
          View Weekly Report
        </Button>
      </CardContent>
    </Card>
  );
};
