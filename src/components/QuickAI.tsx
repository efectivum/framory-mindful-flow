
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickAI: React.FC = () => {
  return (
    <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700 my-6">
      <Sparkles className="w-8 h-8 mx-auto text-purple-400 mb-2" />
      <h3 className="text-lg font-semibold text-white">Have something on your mind?</h3>
      <p className="text-gray-400 text-sm mb-4">Your AI assistant is here to help you unpack your thoughts.</p>
      <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <Link to="/coach">Talk to Coach</Link>
      </Button>
    </div>
  );
};
