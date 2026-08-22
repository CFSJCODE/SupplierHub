import { aiService, SupplierAIAnalysisInput } from "@/lib/services/aiService";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const input: SupplierAIAnalysisInput = await req.json();

    if (!input.name || !input.category) {
      return new Response(
        JSON.stringify({ error: "Nome e categoria são obrigatórios para análise." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await aiService.analyzeSupplier(input);
    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro no AI Gateway.";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
