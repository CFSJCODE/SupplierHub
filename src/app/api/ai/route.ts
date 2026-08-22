import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY || process.env.AI_GATEWAY_TOKEN || "",
  baseURL: "https://ai-gateway.vercel.sh/v1",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = streamText({
      model: openai("openai/gpt-4o-mini"),
      system:
        "Você é um assistente técnico especializado em procurement, compras de componentes eletrônicos, robótica e materiais de engenharia para o SupplierHub.",
      prompt: prompt || "Resuma os principais critérios de escolha de fornecedores de eletrônica.",
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao processar requisição no AI Gateway.";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
