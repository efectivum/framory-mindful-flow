## Goal
Restore account access safely. I cannot directly read or set your password in the database, and we should not store or modify passwords manually. Supabase Auth passwords are hashed and managed by the auth service, so the safe fix is to make the reset flow work reliably.

## Findings
- The password reset request reaches Supabase successfully (`/recover` returned 200), so the app is requesting reset emails.
- There is no Lovable email domain configured in this workspace, so auth emails are currently relying on the default auth mailer rather than a verified custom domain.
- The app already has a `PasswordResetForm` that calls `supabase.auth.updateUser({ password })`, but I need to make the route/token handling more robust so the reset link reliably lands users on a working new-password screen.

## Plan
1. Update the reset redirect path to a dedicated public route, e.g. `/reset-password`, instead of `/auth?reset=true`.
2. Add or wire a public `/reset-password` page that:
   - Detects Supabase recovery tokens from the URL hash/query.
   - Establishes the recovery session when needed.
   - Shows the existing serene `PasswordResetForm`.
   - Redirects back to sign in after a successful password update.
3. Keep `/auth?reset=true` as a backwards-compatible fallback so old reset links do not break.
4. Improve the reset UI copy/errors so it clearly tells you when a link is expired or invalid and asks you to request a new one.
5. Verify there are no remaining calls to the deleted custom `send-auth-email` function.

## Optional follow-up
If reset emails still do not arrive after this route fix, set up Lovable Emails for `beta.lumatori.com` or another sender subdomain in **Cloud → Emails** so auth emails come from a verified domain.