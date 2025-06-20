
-- Create table for tracking premium feature usage
CREATE TABLE public.premium_feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  feature_category TEXT NOT NULL,
  usage_context JSONB DEFAULT '{}'::jsonb,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for subscription analytics and business metrics
CREATE TABLE public.subscription_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_data JSONB DEFAULT '{}'::jsonb,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for billing events and transaction history
CREATE TABLE public.billing_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  amount NUMERIC,
  currency TEXT DEFAULT 'usd',
  stripe_event_id TEXT,
  event_data JSONB DEFAULT '{}'::jsonb,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for feature limits per subscription tier
CREATE TABLE public.feature_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_tier TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  limit_value INTEGER NOT NULL,
  limit_type TEXT NOT NULL DEFAULT 'count',
  reset_period TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(subscription_tier, feature_name)
);

-- Enable Row Level Security for all tables
ALTER TABLE public.premium_feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for premium_feature_usage
CREATE POLICY "Users can view their own feature usage" ON public.premium_feature_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feature usage" ON public.premium_feature_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for subscription_analytics
CREATE POLICY "Users can view their own analytics" ON public.subscription_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert analytics" ON public.subscription_analytics
  FOR INSERT WITH CHECK (true);

-- RLS policies for billing_events
CREATE POLICY "Users can view their own billing events" ON public.billing_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage billing events" ON public.billing_events
  FOR ALL WITH CHECK (true);

-- RLS policies for feature_limits (public read)
CREATE POLICY "Anyone can view feature limits" ON public.feature_limits
  FOR SELECT USING (true);

CREATE POLICY "Service can manage feature limits" ON public.feature_limits
  FOR ALL WITH CHECK (true);

-- Insert default feature limits for different tiers
INSERT INTO public.feature_limits (subscription_tier, feature_name, limit_value, limit_type, reset_period) VALUES
  ('free', 'ai_insights', 5, 'count', 'monthly'),
  ('free', 'journal_entries', 50, 'count', 'monthly'),
  ('free', 'habit_tracking', 3, 'count', 'unlimited'),
  ('free', 'data_export', 0, 'count', 'monthly'),
  ('premium', 'ai_insights', -1, 'unlimited', 'monthly'),
  ('premium', 'journal_entries', -1, 'unlimited', 'monthly'),
  ('premium', 'habit_tracking', -1, 'unlimited', 'unlimited'),
  ('premium', 'data_export', 10, 'count', 'monthly'),
  ('premium', 'voice_transcription', -1, 'unlimited', 'monthly'),
  ('premium', 'advanced_analytics', -1, 'unlimited', 'monthly');

-- Create indexes for performance
CREATE INDEX idx_premium_feature_usage_user_feature ON public.premium_feature_usage(user_id, feature_name);
CREATE INDEX idx_premium_feature_usage_created_at ON public.premium_feature_usage(created_at);
CREATE INDEX idx_subscription_analytics_user_metric ON public.subscription_analytics(user_id, metric_type, date_recorded);
CREATE INDEX idx_billing_events_user_type ON public.billing_events(user_id, event_type);
CREATE INDEX idx_feature_limits_tier_feature ON public.feature_limits(subscription_tier, feature_name);
