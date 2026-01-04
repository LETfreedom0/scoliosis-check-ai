import { createClient } from '@supabase/supabase-js'

// Provide placeholder values to prevent crash during build or if env vars are missing
// The actual functionality will fail if these are invalid, but the app will load.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing. Authentication will not work.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
