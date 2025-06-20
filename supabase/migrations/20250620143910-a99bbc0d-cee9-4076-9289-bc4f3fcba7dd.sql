
-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  context_type TEXT NOT NULL DEFAULT 'general', -- 'general', 'coaching', 'emotion_exploration', etc.
  context_data JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('user', 'bot')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- stores activity_type, coaching_metadata, habit_suggestion, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_session_context table for preserving conversation context
CREATE TABLE public.chat_session_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_key TEXT NOT NULL,
  context_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, context_key)
);

-- Enable Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_session_context ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" 
  ON public.chat_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
  ON public.chat_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
  ON public.chat_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" 
  ON public.chat_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chat messages" 
  ON public.chat_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat messages" 
  ON public.chat_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" 
  ON public.chat_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for chat_session_context
CREATE POLICY "Users can view their own session context" 
  ON public.chat_session_context 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own session context" 
  ON public.chat_session_context 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session context" 
  ON public.chat_session_context 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own session context" 
  ON public.chat_session_context 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_active ON public.chat_sessions(user_id, is_active, last_message_at DESC);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id, created_at);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_session_context_session_id ON public.chat_session_context(session_id);

-- Trigger to update last_message_at when messages are added
CREATE OR REPLACE FUNCTION update_session_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions 
  SET 
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_last_message_at
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_last_message_at();

-- Trigger to auto-update updated_at columns
CREATE TRIGGER trigger_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_chat_session_context_updated_at
  BEFORE UPDATE ON public.chat_session_context
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
