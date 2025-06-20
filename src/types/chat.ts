
export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  activityType?: string;
  isJournalEntry?: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  habitSuggestion?: {
    title: string;
    description: string;
    frequency_type: 'daily' | 'weekly';
    target_days: number;
    conversationContext?: string;
  };
  coachingMetadata?: {
    interventionType: string;
    hasProtocolReference: boolean;
    canRequestFeedback: boolean;
    interactionId?: string;
  };
}

export interface VoiceRecording {
  blob: Blob;
  duration: number;
  transcript?: string;
}

export interface FileAttachment {
  file: File;
  type: 'image' | 'document';
  preview?: string;
}
