
-- Add beta tier feature limits with premium-level access
INSERT INTO public.feature_limits (subscription_tier, feature_name, limit_value, limit_type, reset_period) VALUES
  ('beta', 'ai_insights', -1, 'unlimited', 'monthly'),
  ('beta', 'journal_entries', -1, 'unlimited', 'monthly'),
  ('beta', 'habit_tracking', -1, 'unlimited', 'unlimited'),
  ('beta', 'data_export', 10, 'count', 'monthly'),
  ('beta', 'voice_transcription', -1, 'unlimited', 'monthly'),
  ('beta', 'advanced_analytics', -1, 'unlimited', 'monthly');
