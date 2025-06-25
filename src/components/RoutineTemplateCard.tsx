
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Users, Plus } from 'lucide-react';
import { HabitTemplate } from '@/types/routines';

interface RoutineTemplateCardProps {
  template: HabitTemplate;
  onAddToRoutines: (templateId: string) => void;
  isCreating?: boolean;
  isAdded?: boolean;
}

export const RoutineTemplateCard: React.FC<RoutineTemplateCardProps> = ({
  template,
  onAddToRoutines,
  isCreating = false,
  isAdded = false
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'wellness': return 'bg-blue-500/20 text-blue-300';
      case 'productivity': return 'bg-purple-500/20 text-purple-300';
      case 'mindfulness': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg text-white">{template.title}</CardTitle>
              {template.is_coach_recommended && (
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                  <Star className="w-3 h-3 mr-1" />
                  Coach Pick
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getCategoryColor(template.category)}>
            {template.category}
          </Badge>
          <Badge className={getDifficultyColor(template.difficulty_level)}>
            {template.difficulty_level}
          </Badge>
          {template.estimated_duration_minutes && (
            <Badge className="bg-gray-500/20 text-gray-300">
              <Clock className="w-3 h-3 mr-1" />
              {template.estimated_duration_minutes}min
            </Badge>
          )}
        </div>

        {template.coach_context && (
          <div className="mb-4">
            <p className="text-xs text-amber-400 italic">
              💡 {template.coach_context}
            </p>
          </div>
        )}

        <Button
          onClick={() => onAddToRoutines(template.id)}
          disabled={isCreating || isAdded}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          size="sm"
        >
          {isCreating ? (
            "Adding..."
          ) : isAdded ? (
            "Added to Routines"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to My Routines
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
