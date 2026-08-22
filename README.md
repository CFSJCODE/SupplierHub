# SupplierHub — Gestão Estratégica de Fornecedores de Engenharia

**SupplierHub** é uma aplicação web full-stack corporativa, minimalista e de alta performance desenvolvida para o gerenciamento e procurement pessoal de fornecedores de componentes eletrônicos, robótica, sistemas embarcados, materiais mecânicos, usinagem, impressão 3D, ferramentas e equipamentos de laboratório.

A aplicação foi projetada com uma estética formal de software interno de engenharia (B2B Procurement), eliminando elementos visuais supérfluos e priorizando densidade de dados, velocidade, filtros multifacetados, busca com debounce e organização estruturada.

---

## 🎨 Identidade Visual e Design Tokens

Toda a interface é estritamente orientada pela paleta corporativa:

| Token | Nome | Valor HEX | Aplicação Semântica |
| :--- | :--- | :--- | :--- |
| `--black-forest` | **Black Forest** | `#283618` | Sidebar desktop, navegação institucional, títulos e textos primários. |
| `--olive-leaf` | **Olive Leaf** | `#606C38` | Estados ativos, filtros selecionados, botões secundários e badges de status. |
| `--sunlit-clay` | **Sunlit Clay** | `#DDA15E` | Destaques sutis, fundos discretos e indicadores numéricos. |
| `--cornsilk` | **Cornsilk** | `#FEFAE0` | Fundo estrutural claro da aplicação (combinado com `#FFFFFF` para contraste). |
| `--copperwood` | **Copperwood** | `#BC6C25` | Botões de ação primária (CTA), links e indicadores de foco. |

A geometria utiliza raios moderados (`4px`, `6px`, `8px`), fontes técnicas de alta legibilidade e conformidade de contraste WCAG.

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Biblioteca Base**: React 19 & TypeScript
- **Estilização**: Tailwind CSS com design tokens customizados
- **Formulários & Validação**: React Hook Form + Zod
- **Notificações**: Sonner (estilizado corporativamente)
- **Ícones**: Lucide React
- **Responsividade**: Mobile-first com Drawer off-canvas em telas menores e Tabela moderna no desktop

### Backend & Banco de Dados
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth (E-mail e Senha)
- **Segurança**: Row Level Security (RLS) associado a `auth.uid() = created_by`
- **Armazenamento**: Supabase Storage (Bucket `supplier-logos`)
- **SDK**: `@supabase/supabase-js` e `@supabase/ssr`

### Hospedagem & CI/CD
- **Frontend**: Vercel (Ready)
- **Backend**: Supabase Cloud

---

## 📂 Arquitetura do Projeto

```text
SupplierHub/
├── supabase/
│   └── migrations/
│       └── 20260822000001_create_suppliers_table.sql # Schema, RLS, triggers, storage e seed
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx                          # Autenticação (Login / Cadastro)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                            # Layout padrão das rotas autenticadas
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                          # Dashboard com estatísticas e recentes
│   │   │   ├── fornecedores/
│   │   │   │   ├── page.tsx                          # Catálogo de fornecedores (Tabela/Cards)
│   │   │   │   ├── novo/
│   │   │   │   │   └── page.tsx                      # Formulário de novo fornecedor
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                      # Ficha técnica detalhada
│   │   │   │       └── editar/
│   │   │   │           └── page.tsx                  # Edição com carregamento direto
│   │   │   ├── favoritos/
│   │   │   │   └── page.tsx                          # Listagem exclusiva de favoritos
│   │   │   └── configuracoes/
│   │   │       └── page.tsx                          # Diagnóstico, exportação e seed demo
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts                          # Callback de sessão PKCE
│   │   ├── globals.css                               # Tokens CSS e regras semânticas
│   │   ├── layout.tsx                                # Root layout com Toaster Sonner
│   │   └── page.tsx                                  # Redirecionamento da raiz
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx                        # Sidebar institucional Black Forest
│   │   │   ├── MobileNav.tsx                         # Menu drawer off-canvas para smartphone
│   │   │   ├── TopHeader.tsx                         # Cabeçalho com ações e navegação
│   │   │   └── AppShell.tsx                          # Estrutura base da aplicação
│   │   ├── suppliers/
│   │   │   ├── SupplierTable.tsx                     # Tabela desktop de alta densidade
│   │   │   ├── SupplierCard.tsx                      # Card compacto para mobile/tablet
│   │   │   ├── SupplierFilters.tsx                   # Busca com debounce (300ms) e filtros
│   │   │   ├── SupplierForm.tsx                      # Formulário semântico em 5 grupos
│   │   │   ├── SupplierDetailView.tsx                # Dossiê técnico completo
│   │   │   ├── StatusBadge.tsx                       # Badge de status operacional
│   │   │   ├── CategoryBadge.tsx                     # Badge de categorias de engenharia
│   │   │   └── RatingStars.tsx                       # Seletor e display de avaliação (1-5)
│   │   └── ui/
│   │       ├── Button.tsx                            # Botões Copperwood, Olive e Destrutivo
│   │       ├── Input.tsx, Textarea.tsx, Select.tsx   # Controles de formulário com foco WCAG
│   │       ├── Modal.tsx & ConfirmModal.tsx          # Diálogos de confirmação de exclusão
│   │       ├── EmptyState.tsx                        # Estados vazios orientativos com CTA
│   │       └── Skeleton.tsx                          # Skeleton loaders discretos
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                             # Cliente browser SSR
│   │   │   ├── server.ts                             # Cliente server SSR
│   │   │   └── middleware.ts                         # Sincronização de cookies de sessão
│   │   ├── validations/
│   │   │   └── supplier.ts                           # Schema Zod para fornecedores
│   │   ├── services/
│   │   │   └── supplierService.ts                    # Camada de integração com Supabase/Local
│   │   ├── constants/
│   │   │   ├── categories.ts                         # 18 categorias de engenharia
│   │   │   └── statuses.ts                           # Status operacionais (Ativo, Preferencial...)
│   │   └── utils/
│   │       ├── cn.ts                                 # Utilitário Tailwind Merge
│   │       ├── formatters.ts                         # Formatação de WhatsApp, telefone e datas
│   │       └── export.ts                             # Exportação para CSV e JSON
│   ├── types/
│   │   └── supplier.ts                               # Tipagens TypeScript completas
│   └── middleware.ts                                 # Proteção de rotas Next.js
├── .env.example                                      # Modelo de variáveis de ambiente
├── tailwind.config.ts                                # Configuração de cores e raios moderados
└── tsconfig.json                                     # Configuração TypeScript estrita
```

---

## ⚡ Instalação e Execução Local

### 1. Pré-requisitos
- Node.js 18.18+ ou 20+ (recomendado LTS)
- npm ou yarn / pnpm

### 2. Clonar e Instalar Dependências
```bash
git clone <url-do-repositorio>
cd SupplierHub
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto baseado no `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anon-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em `http://localhost:3000`.

---

## 🗄️ Configuração do Banco de Dados (Supabase)

1. Acesse o seu painel do **Supabase** ([supabase.com](https://supabase.com)) e crie um novo projeto.
2. No menu lateral, acesse **SQL Editor** -> **New Query**.
3. Copie e cole todo o conteúdo do arquivo [`supabase/migrations/20260822000001_create_suppliers_table.sql`](file:///e:/SoftwareProjects/SupplierHub/supabase/migrations/20260822000001_create_suppliers_table.sql).
4. Clique em **Run** para executar o script.

O script configurará automaticamente:
- A tabela `suppliers` com campos de identificação, contato, localização, classificação e procurement.
- Índices otimizados para busca rápida (`name`, `category`, `status`, `favorite`, `created_at`).
- Trigger `trigger_suppliers_updated_at` para atualização automática de `updated_at`.
- Políticas estritas de **Row Level Security (RLS)** garantindo que cada usuário acesse apenas seus próprios registros.
- O bucket de Storage `supplier-logos` com políticas de upload autenticado e leitura pública.

---

## 🚀 Deployment na Vercel

1. Envie o código para um repositório no **GitHub**.
2. No dashboard da **Vercel** ([vercel.com](https://vercel.com)), clique em **Add New Project** e importe o repositório.
3. Na seção **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave Anon pública do Supabase.
4. Clique em **Deploy**.

---

## 🛡️ Segurança & Boas Práticas

- **Row Level Security (RLS)**: Cada registro possui `created_by = auth.uid()`. Nenhum usuário autenticado pode ler, modificar ou deletar fornecedores de terceiros.
- **Validação Dupla**: Formulários validados com **Zod** no frontend e checados no PostgreSQL via restrições `CHECK (status IN (...))` e `CHECK (rating >= 1 AND rating <= 5)`.
- **Upload Seguro**: Uploads para `supplier-logos` verificam MIME type permitido (PNG, JPG, WebP, SVG) e tamanho máximo de 2MB.
- **Proteção de Links Externos**: Todos os links externos utilizam `target="_blank"` e `rel="noopener noreferrer"`.
- **Sem Segredos Expostos**: Apenas a chave pública `anon` é utilizada no frontend; a chave `service_role` nunca é embutida.

---

## 📄 Scripts Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento.
- `npm run build`: Executa a compilação de produção com verificação TypeScript.
- `npm run start`: Inicia o servidor de produção.
- `npm run lint`: Executa a verificação de código e linter.
