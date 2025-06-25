import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles } from 'lucide-react';
import { RoutineTemplateCard } from './RoutineTemplateCard';
import { useRoutines } from '@/hooks/useRoutines';

export const RoutineTemplatesSection = () => {
  const { templates, userRoutines, createFromTemplate, isCreating } = useRoutines();

  const coachRecommended = templates.filter(t => t.is_coach_recommended);
  const otherTemplates = templates.filter(t => !t.is_coach_recommended);
  const userRoutineTemplateIds = new Set(userRoutines.map(r => r.template_id));

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Coach Recommended Section */}
      {coachRecommended.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-xl text-white">Coach Recommended</CardTitle>
              <Badge className="bg-orange-500/20 text-orange-300">
                <Sparkles className="w-3 h-3 mr-1" />
                Personalized for You
              </Badge>
            </div>
            <p className="text-gray-300 text-sm">
              Routines specifically suggested by your AI coach based on your patterns and goals.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coachRecommended.map((template) => (
                <RoutineTemplateCard
                  key={template.id}
                  template={template}
                  onAddToRoutines={createFromTemplate}
                  isCreating={isCreating}
                  isAdded={userRoutineTemplateIds.has(template.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Templates Section */}
      {otherTemplates.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">More Routines</CardTitle>
            <p className="text-gray-400 text-sm">
              Explore additional structured routines to enhance your daily practice.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherTemplates.map((template) => (
                <RoutineTemplateCard
                  key={template.id}
                  template={template}
                  onAddToRoutines={createFromTemplate}
                  isCreating={isCreating}
                  isAdded={userRoutineTemplateIds.has(template.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
