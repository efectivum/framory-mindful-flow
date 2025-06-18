
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Target, Calendar } from 'lucide-react';
import { useCoachHabitSuggestion, HabitSuggestion } from '@/hooks/useCoachHabitSuggestion';

interface CoachHabitSuggestionProps {
  suggestion: HabitSuggestion;
  onHabitCreated: () => void;
}

export const CoachHabitSuggestion: React.FC<CoachHabitSuggestionProps> = ({
  suggestion,
  onHabitCreated
}) => {
  const { createHabitFromSuggestion, isCreating } = useCoachHabitSuggestion();

  const handleCreateHabit = async () => {
    const result = await createHabitFromSuggestion(suggestion);
    if (result) {
      onHabitCreated();
    }
  };

  return (
    <Card className="bg-blue-950/20 border-blue-700/30 mt-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-300 text-sm flex items-center gap-2">
          <Target className="w-4 h-4" />
          Coach Recommendation
        </CardTitle>
        <CardDescription className="text-gray-300">
          Your coach suggests creating this habit to support your growth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-white font-medium mb-1">{suggestion.title}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{suggestion.description}</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {suggestion.frequency_type === 'daily' ? 'Daily practice' : 'Weekly practice'}
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {suggestion.target_days} day goal
          </div>
        </div>

        <Button 
          onClick={handleCreateHabit}
          disabled={isCreating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating Habit...' : 'Create This Habit'}
        </Button>
      </CardContent>
    </Card>
  );
};
