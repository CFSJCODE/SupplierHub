"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Cpu,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Check,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verifica se o usuário já possui sessão ativa ao carregar a página
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        router.replace("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Login com Google OAuth 2.0
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);

    try {
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

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao autenticar com a conta Google. Verifique sua conexão e tente novamente.";
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
          toast.success("Conta criada com sucesso! Verifique seu e-mail para confirmar seu acesso.");
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-50 select-none">
      {/* 
        ========================================================================
        COLUNA 1: SHOWCASE INSTITUCIONAL (Desktop >= 1024px, oculto em Mobile)
        ========================================================================
      */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 2xl:col-span-8 bg-forest-950 text-slate-100 flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 relative overflow-hidden border-r border-forest-900">
        <div className="absolute inset-0 bg-engineering-grid opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Topo do Showcase: Brand Header */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block leading-tight">
                SupplierHub
              </span>
              <span className="text-xs text-emerald-400 font-mono tracking-wider uppercase block font-semibold">
                Gestão de Fornecedores
              </span>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 bg-forest-900/80 border border-forest-800 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ambiente Seguro & Conectado</span>
          </div>
        </div>

        {/* Centro do Showcase: Proposta de Valor & Grid de Recursos */}
        <div className="relative z-10 space-y-8 my-auto py-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Gestão Completa de Fornecedores e Parceiros Comerciais
            </h2>
            <p className="text-sm xl:text-base text-slate-300 leading-relaxed">
              Centralize catálogos, contatos de vendas, avaliações inteligentes e histórico de pedidos em uma única plataforma intuitiva e protegida.
            </p>
          </div>

          {/* Cards de Recursos em Grid Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {/* Recurso 1: IA */}
            <div className="p-4 bg-forest-900/60 border border-forest-800 rounded-xl space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Análise Inteligente</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Avaliações automáticas de prazos, atendimento e recomendações comerciais de compras.
              </p>
            </div>

            {/* Recurso 2: Segurança */}
            <div className="p-4 bg-forest-900/60 border border-forest-800 rounded-xl space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Privacidade & Segurança</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seus dados e listas de fornecedores protegidos com acesso restrito e seguro.
              </p>
            </div>

            {/* Recurso 3: Categorias */}
            <div className="p-4 bg-forest-900/60 border border-forest-800 rounded-xl space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Categorias Organizadas</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filtros por produtos, serviços, distribuidores, fabricantes e cidades.
              </p>
            </div>

            {/* Recurso 4: Google OAuth */}
            <div className="p-4 bg-forest-900/60 border border-forest-800 rounded-xl space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                <Users className="w-4 h-4 shrink-0" />
                <span>Acesso Rápido com Google</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Login corporativo prático em 1 clique sem necessidade de memorizar senhas.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé do Showcase */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-forest-900/80 text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5" /> Alta Disponibilidade
            </span>
            <span>•</span>
            <span>Plataforma Corporativa</span>
          </div>
          <p>© {new Date().getFullYear()} SupplierHub</p>
        </div>
      </section>

      {/* 
        ========================================================================
        COLUNA 2: FORMULÁRIO DE LOGIN E CADASTRO
        ========================================================================
      */}
      <main className="lg:col-span-6 xl:col-span-5 2xl:col-span-4 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 lg:p-10 xl:p-14 min-h-screen">
        <div className="w-full max-w-md space-y-6">
          {/* Header Mobile Exclusivo (< 1024px) */}
          <div className="lg:hidden text-center space-y-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Cpu className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              SupplierHub
            </h1>
            <p className="text-xs text-slate-500">
              Gestão de Fornecedores
            </p>
          </div>

          {/* Cartão de Autenticação */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
            {/* Título de Entrada */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {isSignUp ? "Criar nova conta" : "Acessar plataforma"}
              </h2>
              <p className="text-xs text-slate-500">
                {isSignUp
                  ? "Preencha seus dados para gerenciar seus fornecedores."
                  : "Entre com sua conta Google ou utilize seu e-mail."}
              </p>
            </div>

            {/* Botão de Autenticação Oficial Google */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="w-full h-11 flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                )}
                <span>Entrar com a Conta Google</span>
              </button>

              {/* Separador Visual */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="bg-white px-3 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  ou e-mail
                </span>
              </div>
            </div>

            {/* Abas Alternar Login / Cadastro */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  !isSignUp
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
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
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isSignUp
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Criar Nova Conta
              </button>
            </div>

            {/* Mensagem de Erro se houver */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-800 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Formulário de E-mail e Senha */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="E-mail"
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftElement={<Mail className="w-4 h-4" />}
              />

              <div className="space-y-1.5">
                <div className="relative">
                  <Input
                    label="Senha de Acesso"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    leftElement={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 focus-visible:outline-none cursor-pointer"
                        title={showPassword ? "Ocultar senha" : "Ver senha"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-11 text-xs sm:text-sm font-semibold tracking-wide"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSignUp ? "Criar Conta de Acesso" : "Entrar no SupplierHub"}
              </Button>
            </form>

            {/* Selos de Segurança e Privacidade */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Ambiente protegido com criptografia de ponta a ponta.</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Privacidade garantida para seus dados e contatos.</span>
              </div>
            </div>
          </div>

          {/* Rodapé Mobile / Direitos */}
          <footer className="text-center text-xs text-slate-400 font-mono space-y-1">
            <p>SupplierHub • Gestão Estratégica de Fornecedores</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
