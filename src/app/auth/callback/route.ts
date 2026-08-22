import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_SUPABASE_URL = "https://csillmqnoxvsubpcddja.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzaWxsbXFub3h2c3VicGNkZGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MzI5ODUsImV4cCI6MjEwMzAwODk4NX0.5wHIkBSXmCVdXP-iwosbv63qPL9eD4eqexSirHtW3m0";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  let redirectBase = requestUrl.origin;

  if (!isLocalEnv && forwardedHost) {
    redirectBase = `https://${forwardedHost}`;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    redirectBase = process.env.NEXT_PUBLIC_APP_URL;
  }

  const redirectTarget = `${redirectBase}${next.startsWith("/") ? next : `/${next}`}`;

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

    // Criamos a resposta de redirecionamento final
    const response = NextResponse.redirect(redirectTarget);

    // Criamos o cliente Supabase vinculado à resposta para gravar os cookies da sessão
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, {
                ...options,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      return response;
    }

    console.error("Auth callback exchange error:", error);
  }

  // Se falhar, redireciona para o login com mensagem
  return NextResponse.redirect(`${redirectBase}/login?error=auth_callback_failed`);
}
