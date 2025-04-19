// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Pass environment variables to the client
  // Make sure your .env.local file has these variables!
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // The '!' tells TypeScript we are sure this value exists
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}