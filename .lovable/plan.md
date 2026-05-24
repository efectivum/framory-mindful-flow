
## Problem

Password reset isn't delivering email. Logs show why:

- `useAuth.resetPassword` calls `supabase.auth.resetPasswordForEmail` (which succeeds — 200), then **also** invokes a custom edge function `send-auth-email`.
- `send-auth-email` uses Resend with a hardcoded sender `noreply@yourdomain.com` and fails:
  > "The yourdomain.com domain is not verified. Please, add and verify your domain on https://resend.com/domains"
- The same broken hook is invoked on signup ("welcome" email).

The native Supabase reset email path returns 200 in logs, so the underlying reset flow works — but the custom Resend layer is dead weight that confuses delivery and floods errors. We should remove it and rely on Supabase's default auth emails, which Lovable provisions automatically.

## Plan

1. **`src/hooks/useAuth.tsx`** — Remove the two `supabase.functions.invoke('send-auth-email', …)` calls:
   - In `signUp` (the welcome email block, lines ~385–400).
   - In `resetPassword` (the password_reset block, lines ~425–439).
   Keep the native `supabase.auth.signUp` and `supabase.auth.resetPasswordForEmail` calls untouched — those are what actually send the auth emails.

2. **Verify the redirect target exists.** `resetPassword` redirects to `/auth?reset=true`. Confirm the `/auth` page reads the recovery token (`type=recovery` in the hash) and shows a "set new password" form. If it doesn't, add a small handler that calls `supabase.auth.updateUser({ password })` after a recovery session is detected. (I'll check `src/pages/Auth.tsx` during implementation and only patch if missing.)

3. **Delete the dead edge function** `supabase/functions/send-auth-email/` and its `_templates/` so it stops booting, erroring in logs, and confusing future debugging.

4. **Tell the user** that reset emails will now arrive via the default Lovable/Supabase mailer (check spam folder, can be slow). If they want branded emails from their own domain (`lumatori.com` / `beta.lumatori.com`), that's a separate follow-up: configure a Lovable Email domain and scaffold auth email templates — I'll offer that as an optional next step, not part of this fix.

## Out of scope

- Setting up a custom sender domain (Lovable Emails). Optional follow-up.
- Changing the login flow itself — `signInWithPassword` is fine; the user simply needs a working reset path to recover their password.

## Technical notes

- The `RESEND_API_KEY` secret can stay or be removed later; it's no longer referenced after step 3.
- No DB migrations needed.
