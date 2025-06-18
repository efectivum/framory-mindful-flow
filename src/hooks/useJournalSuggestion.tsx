
import { useState } from 'react';

interface JournalSuggestionState {
  isWaitingForConfirmation: boolean;
  suggestedContent: string;
  showPreview: boolean;
}

export const useJournalSuggestion = () => {
  const [state, setState] = useState<JournalSuggestionState>({
    isWaitingForConfirmation: false,
    suggestedContent: '',
    showPreview: false,
  });

  const setSuggestion = (content: string) => {
    setState({
      isWaitingForConfirmation: true,
      suggestedContent: content,
      showPreview: false,
    });
  };

  const confirmSuggestion = () => {
    setState(prev => ({
      ...prev,
      isWaitingForConfirmation: false,
      showPreview: true,
    }));
  };

  const cancelSuggestion = () => {
    setState({
      isWaitingForConfirmation: false,
      suggestedContent: '',
      showPreview: false,
    });
  };

  const clearSuggestion = () => {
    setState({
      isWaitingForConfirmation: false,
      suggestedContent: '',
      showPreview: false,
    });
  };

  return {
    ...state,
    setSuggestion,
    confirmSuggestion,
    cancelSuggestion,
    clearSuggestion,
  };
};
