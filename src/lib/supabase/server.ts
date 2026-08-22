import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DEFAULT_SUPABASE_URL = "https://csillmqnoxvsubpcddja.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzaWxsbXFub3h2c3VicGNkZGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MzI5ODUsImV4cCI6MjEwMzAwODk4NX0.5wHIkBSXmCVdXP-iwosbv63qPL9eD4eqexSirHtW3m0";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof cookieStore.set>[2] }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado em Server Components se o middleware estiver atualizando as sessões
          }
        },
      },
    }
  );
}
