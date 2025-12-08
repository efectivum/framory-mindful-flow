
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
    <Card className="bg-primary/10 border-primary/30 mt-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-primary text-sm flex items-center gap-2">
          <Target className="w-4 h-4" />
          Coach Recommendation
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your coach suggests creating this habit to support your growth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-foreground font-medium mb-1">{suggestion.title}</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">{suggestion.description}</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating Habit...' : 'Create This Habit'}
        </Button>
      </CardContent>
    </Card>
  );
};
