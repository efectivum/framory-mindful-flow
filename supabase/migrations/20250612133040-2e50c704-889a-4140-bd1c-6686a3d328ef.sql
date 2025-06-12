
-- Enable required extensions for cron scheduling and HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs every hour on Sunday to generate weekly insights
-- This will trigger at different timezones' 8:00 AM throughout the day
SELECT cron.schedule(
  'weekly-insights-generator',
  '0 * * * 0', -- Every hour on Sunday (0 = Sunday)
  $$
  SELECT
    net.http_post(
        url:='https://declymxlblaoeexpgfzq.supabase.co/functions/v1/generate-weekly-insights',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlY2x5bXhsYmxhb2VleHBnZnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzY4ODgsImV4cCI6MjA2MzY1Mjg4OH0.k122AH1XtDamIXr8c8hAnHSqlXmwMt7q65jbaQ7p43M"}'::jsonb,
        body:=json_build_object('current_utc_hour', EXTRACT(HOUR FROM NOW()))::jsonb
    ) as request_id;
  $$
);
