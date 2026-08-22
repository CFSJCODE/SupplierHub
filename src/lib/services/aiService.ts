import { createOpenAI } from "@ai-sdk/openai";
import { streamText, generateText } from "ai";

// Tenta obter o token OIDC da Vercel via @vercel/connect de forma segura
async function getAuthToken(): Promise<string> {
  try {
    const { getToken } = await import("@vercel/connect");
    const token = await getToken("api.openai.com", {
      subject: { type: "app" },
    });
    if (token) return token;
  } catch {
    // Ignorado se não estiver no ambiente Connect
  }

  return (
    process.env.VERCEL_AI_GATEWAY_KEY ||
    process.env.AI_GATEWAY_TOKEN ||
    process.env.OPENAI_API_KEY ||
    ""
  );
}

export async function getOpenAIClient() {
  const apiKey = await getAuthToken();
  return createOpenAI({
    apiKey,
    baseURL: "https://ai-gateway.vercel.sh/v1",
  });
}

export interface SupplierAIAnalysisInput {
  name: string;
  category: string;
  description?: string | null;
  advantages?: string | null;
  limitations?: string | null;
  country?: string | null;
  website?: string | null;
}

export const aiService = {
  // Gera um parecer técnico de engenharia e procurement
  async analyzeSupplier(input: SupplierAIAnalysisInput) {
    const openai = await getOpenAIClient();

    const systemPrompt = `Você é um Engenheiro Chefe de Procurement e Suprimentos de Hardware.
Analise os dados do fornecedor e gere um relatório técnico conciso em português contendo:
1. Perfil Estratégico (qualidade esperada, segmentos de aplicação).
2. Riscos de Cadeia de Suprimentos & Lead Time (pontos de atenção em importação, logística, estoque).
3. Recomendações de Compras & Prototipagem (quando acionar este fornecedor vs alternativas).
Mantenha o tom profissional, direto e formal.`;

    const userPrompt = `Fornecedor: ${input.name}
Categoria Técnica: ${input.category}
País: ${input.country || "Brasil"}
Website: ${input.website || "Não informado"}
Descrição: ${input.description || "Não informada"}
Vantagens Registradas: ${input.advantages || "Nenhuma"}
Limitações Registradas: ${input.limitations || "Nenhuma"}`;

    return streamText({
      model: openai("openai/gpt-4o-mini"),
      system: systemPrompt,
      prompt: userPrompt,
    });
  },

  // Sugere vantagens e limitações automáticas para o formulário de cadastro
  async suggestProcurementDetails(name: string, category: string) {
    const openai = await getOpenAIClient();

    const prompt = `Para o fornecedor de engenharia "${name}" na categoria "${category}", retorne um objeto JSON com:
- "advantages": 2 a 3 vantagens técnicas típicas deste fornecedor/categoria.
- "limitations": 1 a 2 limitações típicas.
- "description": 1 resumo técnico do catálogo deste fornecedor.
Retorne apenas JSON válido.`;

    try {
      const response = await generateText({
        model: openai("openai/gpt-4o-mini"),
        prompt,
      });

      return JSON.parse(response.text.replace(/```json|```/g, "").trim());
    } catch {
      return null;
    }
  },
};
