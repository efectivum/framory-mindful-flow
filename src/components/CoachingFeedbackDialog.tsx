
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, ThumbsUp, ThumbsDown, Target, Lightbulb } from 'lucide-react';

interface CoachingFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (data: {
    satisfaction: number;
    interventionType: string;
    successMetric: string;
    notes?: string;
  }) => void;
  interventionType: string;
  coachingContent: string;
}

export const CoachingFeedbackDialog: React.FC<CoachingFeedbackDialogProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
  interventionType,
  coachingContent,
}) => {
  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [successMetric, setSuccessMetric] = useState('helpfulness');

  const handleSubmit = () => {
    if (satisfaction === 0) return;

    onSubmitFeedback({
      satisfaction,
      interventionType,
      successMetric,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSatisfaction(0);
    setNotes('');
    setSuccessMetric('helpfulness');
    onClose();
  };

  const successMetrics = [
    { value: 'helpfulness', label: 'Overall Helpfulness', icon: ThumbsUp },
    { value: 'actionability', label: 'How Actionable', icon: Target },
    { value: 'insight_quality', label: 'Quality of Insights', icon: Lightbulb },
    { value: 'motivation', label: 'Motivation Boost', icon: Star },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            How was this coaching interaction?
          </DialogTitle>
          <DialogDescription>
            Your feedback helps me learn and provide better coaching over time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Satisfaction Rating */}
          <div>
            <Label className="text-sm font-medium">Overall Satisfaction</Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSatisfaction(rating)}
                  className={`p-1 transition-colors ${
                    satisfaction >= rating
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {satisfaction === 0 && "Please rate your experience"}
              {satisfaction === 1 && "Not helpful"}
              {satisfaction === 2 && "Slightly helpful"}
              {satisfaction === 3 && "Moderately helpful"}
              {satisfaction === 4 && "Very helpful"}
              {satisfaction === 5 && "Extremely helpful"}
            </p>
          </div>

          {/* Success Metric */}
          <div>
            <Label className="text-sm font-medium">What was most valuable?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {successMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <button
                    key={metric.value}
                    onClick={() => setSuccessMetric(metric.value)}
                    className={`p-3 text-left rounded-lg border transition-colors ${
                      successMetric === metric.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional feedback (optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What worked well? What could be improved? Any specific requests for future coaching?"
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Coaching Content Preview */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs font-medium text-gray-600">Coaching content:</Label>
            <p className="text-sm text-gray-700 mt-1 line-clamp-3">
              {coachingContent}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={satisfaction === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
