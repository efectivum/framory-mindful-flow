
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';

interface AnalysisStatusButtonProps {
  onTriggerAnalysis: () => void;
  isAnalyzing: boolean;
  hasAnalysisError?: boolean;
  entriesNeedingAnalysis: number;
}

export const AnalysisStatusButton = ({ 
  onTriggerAnalysis, 
  isAnalyzing, 
  hasAnalysisError,
  entriesNeedingAnalysis 
}: AnalysisStatusButtonProps) => {
  if (entriesNeedingAnalysis === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Button
        onClick={onTriggerAnalysis}
        disabled={isAnalyzing}
        variant={hasAnalysisError ? "destructive" : "outline"}
        className="w-full"
      >
        {isAnalyzing ? (
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        ) : hasAnalysisError ? (
          <AlertCircle className="w-4 h-4 mr-2" />
        ) : (
          <Brain className="w-4 h-4 mr-2" />
        )}
        {isAnalyzing 
          ? "Analyzing entries..." 
          : hasAnalysisError 
          ? "Retry analysis" 
          : `Analyze ${entriesNeedingAnalysis} entries`
        }
        {entriesNeedingAnalysis > 0 && !isAnalyzing && (
          <Badge variant="secondary" className="ml-2">
            {entriesNeedingAnalysis}
          </Badge>
        )}
      </Button>
      {hasAnalysisError && (
        <p className="text-sm text-red-400 mt-2 text-center">
          Some entries failed to analyze. Click to retry.
        </p>
      )}
    </div>
  );
};
