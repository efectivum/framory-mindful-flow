## Plan: Stop RLS spam from error tracking

### Context
`useErrorTracking.tsx` writes every client error into `ai_insights` with `source_type: 'error_tracking'`. Since the row's `user_id` is often null (errors fire before/without auth), the `ai_insights` RLS policy (`auth.uid() = user_id`) rejects the insert and produces `42501` errors — which themselves trigger more error logs.

Good news: the `error_logs` table already exists with the right columns (`message`, `stack`, `severity`, `url`, `user_agent`, `context`, `resolved`, `user_id`) and proper RLS policies (users can insert/view/update their own rows). No migration is needed.

### Change
Update `src/hooks/useErrorTracking.tsx`:

1. Replace the `supabase.from('ai_insights').insert(...)` block with an insert into `error_logs` using the native column names:
   ```
   { user_id, message, stack, url, user_agent, severity, context, resolved: false }
   ```
2. Short-circuit the DB write when `user?.id` is null — keep the error in local state only, so unauthenticated errors don't trigger RLS rejections.
3. Update `markErrorResolved` to actually update the `error_logs` row (`resolved: true`) now that the table exists, scoped to `auth.uid()`.
4. Leave `ErrorBoundary`'s `window.logError` integration untouched — it already routes through this hook.

### Out of scope
- No schema changes (table already there).
- No styling changes.
- Other audit items (missing nav on Coach/Insights, ProtectedRoute dark loading screen, etc.) remain for follow-up.
