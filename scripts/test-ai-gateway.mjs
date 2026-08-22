import { createOpenAI } from "@ai-sdk/openai";
import { streamText, generateText } from "ai";

const AI_GATEWAY_KEY = process.env.VERCEL_AI_GATEWAY_KEY || process.env.AI_GATEWAY_TOKEN;

if (!AI_GATEWAY_KEY) {
  console.error("Defina a variável VERCEL_AI_GATEWAY_KEY ou AI_GATEWAY_TOKEN no .env.local");
  process.exit(1);
}

// Configure OpenAI compatible client pointing to Vercel AI Gateway
const openai = createOpenAI({
  apiKey: AI_GATEWAY_KEY,
  baseURL: "https://ai-gateway.vercel.sh/v1",
});

async function main() {
  console.log("=== Testando Vercel AI Gateway ===");
  
  try {
    const model = openai("openai/gpt-4o-mini");
    console.log("Enviando requisição via streamText...");

    const result = streamText({
      model,
      prompt: "Olá! Confirme em uma frase curta que o Vercel AI Gateway está operacional para o SupplierHub.",
    });

    process.stdout.write("Resposta do modelo: ");
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }
    console.log("\n=== Teste finalizado com sucesso! ===");
  } catch (error) {
    console.error("Detalhes do erro:", error.message || error);
  }
}

main();
