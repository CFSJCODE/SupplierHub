import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_SUPABASE_URL = "https://csillmqnoxvsubpcddja.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzaWxsbXFub3h2c3VicGNkZGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MzI5ODUsImV4cCI6MjEwMzAwODk4NX0.5wHIkBSXmCVdXP-iwosbv63qPL9eD4eqexSirHtW3m0";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof supabaseResponse.cookies.set>[2] }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run on static assets or favicon
  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return supabaseResponse;
  }

  // Se o usuário acessar a raiz (/), redireciona obrigatoriamente para a página de login
  if (path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/fornecedores") ||
    path.startsWith("/favoritos") ||
    path.startsWith("/configuracoes");

  // Se não houver usuário autenticado em rotas protegidas, redireciona para o login
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
