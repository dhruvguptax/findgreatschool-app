// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Only import cookies
import 'server-only';

// Define a minimal type shape we expect cookies() to conform to
// This helps the type assertion be slightly safer than 'any'
type MinimalCookieStore = {
  get: (name: string) => { name: string; value: string } | undefined;
  // We might need signatures for set/remove here too if we add those methods below
  // set?: (name: string, value: string, options?: any) => void;
  // remove?: (name: string, options?: any) => void;
};

export function createSupabaseServerClient() {
  // WORKAROUND for potential incorrect type inference in Next.js 15/React 19:
  // Explicitly assert the type to ensure TS knows .get() exists.
  const cookieStore = cookies() as unknown as MinimalCookieStore;

  const cookieHandlerOptions = {
    get(name: string): string | undefined {
      // TypeScript should now allow calling .get on the asserted type
      return cookieStore.get(name)?.value;
    },
    // --- Optional set/remove methods ---
    // set(name: string, value: string, options: CookieOptions) {
    //   try { cookieStore.set(name, value, options) } catch (error) {}
    // },
    // remove(name: string, options: CookieOptions) {
    //    try { cookieStore.remove(name, options) } catch (error) {}
    // }
    // --- End optional methods ---
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieHandlerOptions
    }
  );
}