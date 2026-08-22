"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/services/supplierService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Ícone oficial SVG do Google
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login com Google via Supabase OAuth
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        toast.success("Login simulado via Google (Ambiente de Demonstração Local)!");
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao autenticar com a conta Google. Verifique se o provedor está habilitado no Supabase.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsGoogleLoading(false);
    }
  };

  // Login ou Cadastro com E-mail e Senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        toast.success(
          isSignUp
            ? "Conta simulada criada com sucesso (Modo Local)!"
            : "Login efetuado com sucesso (Modo Local)!"
        );
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const supabase = createClient();

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          toast.error(error.message);
          return;
        }

        if (data.session) {
          toast.success("Conta criada e autenticada com sucesso!");
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.success("Conta criada! Verifique seu e-mail para confirmar seu cadastro.");
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(
            error.message === "Invalid login credentials"
              ? "Credenciais inválidas. Verifique seu e-mail e senha."
              : error.message
          );
          toast.error("Erro na autenticação.");
          return;
        }

        toast.success("Login efetuado com sucesso!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-brand-cornsilk bg-engineering-grid p-4 sm:p-6 selection:bg-brand-clay/30">
      {/* Container Principal */}
      <div className="w-full max-w-md bg-white border border-[#D2CAA9] rounded-xl shadow-dropdown overflow-hidden transition-all">
        {/* Header Institucional Black Forest com Gradiente Suave */}
        <div className="relative bg-gradient-to-b from-forest-800 to-forest-900 p-7 text-white text-center space-y-2 border-b border-forest-950/40">
          <div className="w-13 h-13 bg-brand-copper/90 border border-brand-copper text-white rounded-lg flex items-center justify-center mx-auto shadow-md transform hover:scale-105 transition-transform">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FEFAE0]">
              SupplierHub
            </h1>
            <p className="text-xs text-clay-300 font-mono tracking-wider uppercase mt-0.5">
              Engineering Procurement Suite
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 bg-forest-950/60 border border-forest-700/50 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-clay-200">
            <Sparkles className="w-3 h-3 text-brand-clay" />
            <span>Vercel AI & Supabase Cloud</span>
          </div>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Botão de Autenticação Google */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full h-11 flex items-center justify-center space-x-3 bg-white hover:bg-[#FAF7EE] active:bg-[#F3EED8] text-forest-900 border border-[#D2CAA9] hover:border-forest-700/40 font-medium text-xs sm:text-sm rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-copper disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-forest-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="w-4 h-4 shrink-0" />
              )}
              <span>Continuar com Conta Google</span>
            </button>

            {/* Divisor "ou" */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#E5DFC5]" />
              <span className="bg-white px-3 text-[11px] font-mono uppercase text-olive-800/60 tracking-wider">
                ou com e-mail
              </span>
            </div>
          </div>

          {/* Abas Alternar Login / Cadastro */}
          <div className="flex border-b border-[#F0EBD7]">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage(null);
              }}
              className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider text-center transition-colors border-b-2 ${
                !isSignUp
                  ? "border-brand-copper text-forest-900 font-bold"
                  : "border-transparent text-forest-700/50 hover:text-forest-800"
              }`}
            >
              Acessar Conta
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage(null);
              }}
              className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider text-center transition-colors border-b-2 ${
                isSignUp
                  ? "border-brand-copper text-forest-900 font-bold"
                  : "border-transparent text-forest-700/50 hover:text-forest-800"
              }`}
            >
              Criar Nova Conta
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-800 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail Corporativo"
              type="email"
              placeholder="seu.email@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftElement={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Senha de Acesso"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftElement={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-11 text-sm font-semibold tracking-wide"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSignUp ? "Criar Conta de Acesso" : "Entrar no SupplierHub"}
            </Button>
          </form>

          {/* Destaque de Segurança Corporativa */}
          <div className="pt-4 border-t border-[#F0EBD7] text-[11px] text-olive-800/80 space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-olive shrink-0" />
              <span>Autenticação isolada via Supabase Auth & Google OAuth.</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-copper shrink-0" />
              <span>Row Level Security (RLS): privacidade estrita dos seus fornecedores.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-olive-800/70 font-mono space-y-1">
        <p>SupplierHub • Gestão Estratégica de Fornecedores de Engenharia</p>
        <p className="text-[11px] text-olive-800/50">Next.js 15 App Router • Vercel AI SDK • Supabase Cloud</p>
      </footer>
    </div>
  );
}
