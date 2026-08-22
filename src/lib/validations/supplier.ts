import { z } from "zod";

const emptyStringToNull = (val: unknown) => {
  if (typeof val === "string" && val.trim() === "") return null;
  return val;
};

export const supplierSchema = z.object({
  // Identificação
  name: z
    .string({ required_error: "O nome do fornecedor é obrigatório." })
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(120, "O nome não pode exceder 120 caracteres."),
  legal_name: z
    .preprocess(emptyStringToNull, z.string().max(160, "A razão social não pode exceder 160 caracteres.").nullable().optional()),
  trade_name: z
    .preprocess(emptyStringToNull, z.string().max(120, "O nome fantasia não pode exceder 120 caracteres.").nullable().optional()),
  logo_url: z
    .preprocess(emptyStringToNull, z.string().url("A URL do logotipo deve ser válida.").nullable().optional()),
  description: z
    .preprocess(emptyStringToNull, z.string().max(1000, "A descrição não pode exceder 1000 caracteres.").nullable().optional()),

  // Contato
  website: z
    .preprocess(emptyStringToNull, z.string().url("Informe um website válido (ex: https://exemplo.com.br).").nullable().optional()),
  email: z
    .preprocess(emptyStringToNull, z.string().email("Informe um endereço de e-mail válido.").nullable().optional()),
  phone: z
    .preprocess(emptyStringToNull, z.string().max(30, "Telefone inválido.").nullable().optional()),
  whatsapp: z
    .preprocess(emptyStringToNull, z.string().max(30, "WhatsApp inválido.").nullable().optional()),

  // Localização
  country: z
    .string()
    .default("Brasil"),
  state: z
    .preprocess(emptyStringToNull, z.string().max(50, "Estado inválido.").nullable().optional()),
  city: z
    .preprocess(emptyStringToNull, z.string().max(80, "Cidade inválida.").nullable().optional()),
  address: z
    .preprocess(emptyStringToNull, z.string().max(250, "Endereço não pode exceder 250 caracteres.").nullable().optional()),

  // Classificação
  category: z
    .string({ required_error: "Selecione uma categoria para o fornecedor." })
    .min(1, "Selecione uma categoria válida."),
  status: z
    .enum(["Ativo", "Inativo", "Em avaliação", "Preferencial"], {
      errorMap: () => ({ message: "Status operacional inválido." }),
    })
    .default("Ativo"),
  rating: z
    .preprocess(
      (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
      z.number().int().min(1, "A avaliação deve ser entre 1 e 5.").max(5, "A avaliação deve ser entre 1 e 5.").nullable().optional()
    ),
  favorite: z
    .boolean()
    .default(false),

  // Informações Internas / Procurement
  notes: z
    .preprocess(emptyStringToNull, z.string().max(2000, "As observações não podem exceder 2000 caracteres.").nullable().optional()),
  advantages: z
    .preprocess(emptyStringToNull, z.string().max(1000, "As vantagens não podem exceder 1000 caracteres.").nullable().optional()),
  limitations: z
    .preprocess(emptyStringToNull, z.string().max(1000, "As limitações não podem exceder 1000 caracteres.").nullable().optional()),
  purchase_experience: z
    .preprocess(emptyStringToNull, z.string().max(1000, "A experiência de compra não pode exceder 1000 caracteres.").nullable().optional()),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
