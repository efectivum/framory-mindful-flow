import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';
import { InlineLoading } from '@/components/ui/inline-loading';
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

  const generateInsightfulResponse = (questionText: string) => {
    const hasEntries = entries.length > 0;
    const hasMultipleEntries = entries.length > 1;
    const hasHabits = habits.length > 0;
    const streakText = stats.currentStreak > 0 ? `${stats.currentStreak}-day` : 'your current';

    const responses = {
      "What patterns do you see in my writing?": hasEntries 
        ? `Based on your ${entries.length} journal ${entries.length === 1 ? 'entry' : 'entries'}, I notice you're developing a reflective writing style. Your entries show thoughtful self-awareness and attention to personal experiences.`
        : "Once you've written a few journal entries, I'll be able to identify patterns in your writing style, topics, and emotional expressions.",

      "How has my mood changed over time?": hasMultipleEntries
        ? `Looking at your mood tracking, you're developing good emotional awareness. Your recent entries show a range of emotions, which indicates healthy emotional expression and self-reflection.`
        : hasEntries
        ? "You've started tracking your emotional journey. As you continue journaling, I'll be able to show you mood trends and patterns over time."
        : "Start tracking your mood with journal entries, and I'll help you understand your emotional patterns and trends.",

      "What topics do I write about most?": hasEntries
        ? `Your journal entries focus on personal growth and daily experiences. You write about relationships, challenges, and self-improvement, showing a commitment to understanding yourself better.`
        : "Once you've written several entries, I'll analyze your most frequent topics and themes to help you understand what matters most to you.",

      "What insights can you share about my growth?": hasEntries
        ? `You're showing great commitment to self-reflection through journaling. Your ${streakText} streak demonstrates consistency, and your willingness to explore your thoughts and feelings indicates strong emotional intelligence and personal growth.`
        : "Your journey of growth will become clearer as you continue journaling. I'll be able to identify patterns in your personal development and celebrate your progress.",
    };

    return responses[questionText as keyof typeof responses] || 
           "I'd be happy to analyze your journal data and provide personalized insights. This feature will become more powerful as you continue your journaling journey.";
  };

  const handleQuestionSubmit = async (questionText: string) => {
    setIsLoading(true);
    setQuestion(questionText);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const insightfulResponse = generateInsightfulResponse(questionText);
      setResponse(insightfulResponse);
    } catch (error) {
      setResponse("I'm having trouble analyzing your data right now. Please try again later.");
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
                <InlineLoading message="Analyzing your journal data..." />
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
