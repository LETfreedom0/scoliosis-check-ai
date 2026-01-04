# Supabase Auth Integration Plan

## Implementation Steps

### 1. Installation & Configuration
- [x] Install `@supabase/supabase-js`
- [x] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholders
- [x] Create `web/lib/supabase.ts` for client initialization

### 2. Context Updates
- [x] Modify `web/contexts/AuthContext.tsx`
  - Replace `localStorage` logic with Supabase Auth methods (`signInWithPassword`, `signUp`, `signOut`)
  - Add session persistence and auth state listener
  - Update `User` interface to align with Supabase (added `id`, optional `password`)
  - Update `login` and `register` to be asynchronous and return errors

### 3. UI Updates
- [x] Modify `web/app/login/page.tsx`
  - Make `handleSubmit` asynchronous
  - Handle loading states
  - Add error handling for Supabase responses
  - Remove legacy local storage logic

## User Action Required
- **Update Credentials**: Please update `web/.env.local` with your actual Supabase project URL and Anon Key.
