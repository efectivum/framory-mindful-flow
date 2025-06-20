
-- Add RLS policies for chat_sessions table
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

-- Add RLS policies for chat_messages table
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

-- Add RLS policies for chat_session_context table
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
