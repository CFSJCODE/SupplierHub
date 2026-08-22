"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Supplier } from "@/types/supplier";
import { Sparkles, Bot, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export interface SupplierAIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
}

export function SupplierAIAnalysisModal({
  isOpen,
  onClose,
  supplier,
}: SupplierAIAnalysisModalProps) {
  const [analysisText, setAnalysisText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateAnalysis = async () => {
    setIsLoading(true);
    setHasError(null);
    setAnalysisText("");

    try {
      const res = await fetch("/api/ai/analyze-supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supplier.name,
          category: supplier.category,
          country: supplier.country,
          website: supplier.website,
          description: supplier.description,
          advantages: supplier.advantages,
          limitations: supplier.limitations,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao conectar com o AI Gateway.");
      }

      if (!res.body) throw new Error("Resposta vazia da IA.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setAnalysisText(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar análise com IA.";
      setHasError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysisText) return;
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    toast.success("Parecer copiado para a área de transferência.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Parecer Técnico de IA: ${supplier.name}`}
      description="Análise automatizada de risco de fornecimento, lead time e recomendações de compras."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {!analysisText && !isLoading && !hasError && (
          <div className="p-5 text-center bg-[#FAF7EE] border border-[#E5DFC5] rounded-lg space-y-3">
            <div className="w-10 h-10 bg-brand-clay/20 text-brand-copper rounded-md flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs text-forest-800/80 max-w-sm mx-auto leading-relaxed">
              O Vercel AI Gateway analisará o histórico, segmento ({supplier.category}) e localização para gerar recomendações técnicas de procurement.
            </p>
            <Button
              size="sm"
              onClick={handleGenerateAnalysis}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Iniciar Análise de IA
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="p-6 bg-[#FAF7EE] border border-[#E5DFC5] rounded-lg space-y-3 text-center">
            <div className="inline-flex p-2 bg-brand-copper/10 rounded-full animate-bounce">
              <Bot className="w-5 h-5 text-brand-copper" />
            </div>
            <p className="text-xs font-mono font-medium text-forest-900 animate-pulse">
              Consultando Vercel AI Gateway...
            </p>
            {analysisText && (
              <div className="text-left text-xs text-forest-900 whitespace-pre-wrap font-sans bg-white p-4 rounded-md border border-[#D2CAA9] max-h-60 overflow-y-auto">
                {analysisText}
              </div>
            )}
          </div>
        )}

        {hasError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-2 text-xs text-rose-800">
            <div className="flex items-center space-x-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Aviso do AI Gateway</span>
            </div>
            <p className="leading-relaxed">{hasError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateAnalysis}
              className="mt-2 text-xs"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {analysisText && !isLoading && (
          <div className="space-y-3">
            <div className="bg-[#FAF7EE] border border-[#E5DFC5] rounded-lg p-4 text-xs text-forest-900 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-sans">
              {analysisText}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-olive-800/70">
                Gerado via Vercel AI SDK & AI Gateway
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? "Copiado" : "Copiar"}
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={handleGenerateAnalysis}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Regerar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
