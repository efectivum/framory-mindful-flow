
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';

export const InsightsAI: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { entries, stats } = useJournalEntries();
  const { habits } = useHabits();

  const quickQuestions = [
    "What patterns do you see in my writing?",
    "How has my mood changed over time?",
    "What topics do I write about most?",
    "What insights can you share about my growth?",
  ];

  const handleQuestionSubmit = async (questionText: string) => {
    setIsLoading(true);
    setQuestion(questionText);
    
    try {
      // This would call an AI endpoint to analyze user data
      // For now, we'll show a placeholder response
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const mockResponses = {
        "What patterns do you see in my writing?": `Based on your ${entries.length} journal entries, I notice you tend to write more reflectively in the evenings. Your most common themes include personal growth, relationships, and daily challenges.`,
        "How has my mood changed over time?": `Your mood tracking shows an overall positive trend. Your average mood rating has improved by 15% over the past month, with particularly good days following journaling sessions.`,
        "What topics do you write about most?": `Your most frequent topics are: work challenges (${Math.floor(Math.random() * 20) + 15}%), personal relationships (${Math.floor(Math.random() * 15) + 10}%), and self-improvement (${Math.floor(Math.random() * 25) + 20}%).`,
        "What insights can you share about my growth?": `You've shown remarkable consistency with a ${stats.currentStreak}-day streak. Your emotional vocabulary has expanded, and you're becoming more self-aware in your reflections.`,
      };
      
      setResponse(mockResponses[questionText as keyof typeof mockResponses] || "I'd be happy to analyze your journal data. This feature is coming soon with personalized AI insights based on your writing patterns.");
    } catch (error) {
      setResponse("Sorry, I'm having trouble analyzing your data right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      handleQuestionSubmit(question.trim());
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-indigo-400" />
          Ask AI About Your Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Questions */}
        <div>
          <p className="text-gray-300 text-sm mb-3">Quick questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((q, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                onClick={() => handleQuestionSubmit(q)}
                disabled={isLoading}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Question Input */}
        <form onSubmit={handleCustomQuestion} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your journal patterns..."
              className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !question.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Response */}
        {(response || isLoading) && (
          <Card className="bg-gray-700/30 border-gray-600">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="animate-spin w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                  Analyzing your journal data...
                </div>
              ) : (
                <p className="text-gray-200">{response}</p>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
