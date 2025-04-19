// lib/supabase/server-admin.ts
import { createClient } from '@supabase/supabase-js'
import 'server-only' // Ensures this module only runs on the server

export const createSupabaseServerAdminClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_KEY');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY, // Use Service Role Key
    {
      auth: {
        // Important: disable auto-refreshing for service role
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}