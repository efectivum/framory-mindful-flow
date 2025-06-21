
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Sparkles, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RECOMMENDED_PROMPTS = [
  {
    category: "Self-Reflection",
    prompts: [
      "What patterns do you notice in my recent entries?",
      "What emotions come up most frequently for me?",
      "How has my mood changed over the past month?"
    ]
  },
  {
    category: "Growth Insights",
    prompts: [
      "What are my biggest growth areas based on my journaling?",
      "What strengths do you see in my writing?",
      "What themes keep appearing in my entries?"
    ]
  },
  {
    category: "Goal Setting",
    prompts: [
      "Based on my entries, what goals should I focus on?",
      "What habits would benefit me most right now?",
      "How can I better support my mental health?"
    ]
  }
];

export const TalkToJournalCard: React.FC = () => {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    if (question.trim()) {
      navigate('/chat', { 
        state: { 
          initialMessage: question,
          contextType: 'journal-analysis' 
        } 
      });
    }
  };

  const handlePromptClick = (prompt: string) => {
    navigate('/chat', { 
      state: { 
        initialMessage: prompt,
        contextType: 'journal-analysis' 
      } 
    });
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-indigo-400" />
          Talk to Your Journal
        </CardTitle>
        <p className="text-gray-400 text-sm">Ask questions about your entries and get AI-powered insights</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ask Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-4 h-4 text-indigo-400" />
              <h3 className="text-white font-medium">Ask a Question</h3>
            </div>
            
            <Textarea
              placeholder="What would you like to know about your journal entries?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px] resize-none"
            />
            
            <Button 
              onClick={handleAskQuestion}
              disabled={!question.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </div>

          {/* Recommended Prompts Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-white font-medium">Recommended Prompts</h3>
            </div>
            
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {RECOMMENDED_PROMPTS.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {category.category}
                  </h4>
                  {category.prompts.map((prompt, promptIndex) => (
                    <button
                      key={promptIndex}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 group"
                    >
                      <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
