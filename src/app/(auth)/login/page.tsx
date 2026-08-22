"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/services/supplierService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        // Local preview fallback
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-brand-cornsilk p-4 sm:p-6">
      {/* Container Principal */}
      <div className="w-full max-w-md bg-white border border-[#D2CAA9] rounded-lg shadow-dropdown overflow-hidden">
        {/* Header Institucional Black Forest */}
        <div className="bg-forest-800 p-6 text-white text-center space-y-2 border-b border-forest-900">
          <div className="w-12 h-12 bg-brand-copper rounded-md flex items-center justify-center mx-auto shadow-subtle">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SupplierHub</h1>
            <p className="text-xs text-clay-400 font-mono tracking-wider uppercase">
              Procurement & Engineering Suite
            </p>
          </div>
        </div>

        {/* Formulário de Login / Cadastro */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex border-b border-[#F0EBD7]">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage(null);
              }}
              className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors border-b-2 ${
                !isSignUp
                  ? "border-brand-copper text-forest-900 font-bold"
                  : "border-transparent text-forest-700/50 hover:text-forest-800"
              }`}
            >
              Acessar Sistema
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage(null);
              }}
              className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors border-b-2 ${
                isSignUp
                  ? "border-brand-copper text-forest-900 font-bold"
                  : "border-transparent text-forest-700/50 hover:text-forest-800"
              }`}
            >
              Criar Nova Conta
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start space-x-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
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
              className="w-full h-10 text-sm font-semibold tracking-wide"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSignUp ? "Criar Conta de Acesso" : "Entrar no SupplierHub"}
            </Button>
          </form>

          {/* Destaque de Segurança Corporativa */}
          <div className="pt-4 border-t border-[#F0EBD7] text-[11px] text-olive-800/80 space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-olive shrink-0" />
              <span>Protegido por Supabase Auth & Row Level Security (RLS).</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-copper shrink-0" />
              <span>Isolamento estrito: seus fornecedores são visíveis apenas por você.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de Autoria */}
      <footer className="mt-8 text-center text-xs text-olive-800/60 font-mono">
        SupplierHub • Gestão Estratégica de Fornecedores de Engenharia
      </footer>
    </div>
  );
}
