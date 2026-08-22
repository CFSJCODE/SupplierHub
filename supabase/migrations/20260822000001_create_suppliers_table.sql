-- ==============================================================================
-- SupplierHub - Database Migration
-- Table: public.suppliers
-- Description: Schema inicial com RLS, restrições, triggers e storage.
-- ==============================================================================

-- 1. Criação da tabela principal de fornecedores
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Identificação
    name TEXT NOT NULL,
    legal_name TEXT,
    trade_name TEXT,
    logo_url TEXT,
    description TEXT,
    
    -- Contato
    website TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    
    -- Localização
    country TEXT NOT NULL DEFAULT 'Brasil',
    state TEXT,
    city TEXT,
    address TEXT,
    
    -- Classificação
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Em avaliação', 'Preferencial')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    favorite BOOLEAN NOT NULL DEFAULT false,
    
    -- Informações internas e procurement
    notes TEXT,
    advantages TEXT,
    limitations TEXT,
    purchase_experience TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índices para otimização de consultas e buscas
CREATE INDEX IF NOT EXISTS idx_suppliers_created_by ON public.suppliers(created_by);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON public.suppliers(category);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON public.suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_favorite ON public.suppliers(favorite);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON public.suppliers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suppliers_search ON public.suppliers(created_by, name, category, city, state);

-- 3. Trigger para atualização automática do campo updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER trigger_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Habilitação de Row Level Security (RLS)
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Segurança (Row Level Security)
-- Garantia: Usuário só acessa e manipula seus próprios registros (created_by = auth.uid())

DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios fornecedores" ON public.suppliers;
CREATE POLICY "Usuários podem visualizar seus próprios fornecedores"
    ON public.suppliers
    FOR SELECT
    USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Usuários podem cadastrar fornecedores para si mesmos" ON public.suppliers;
CREATE POLICY "Usuários podem cadastrar fornecedores para si mesmos"
    ON public.suppliers
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios fornecedores" ON public.suppliers;
CREATE POLICY "Usuários podem atualizar seus próprios fornecedores"
    ON public.suppliers
    FOR UPDATE
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Usuários podem excluir seus próprios fornecedores" ON public.suppliers;
CREATE POLICY "Usuários podem excluir seus próprios fornecedores"
    ON public.suppliers
    FOR DELETE
    USING (auth.uid() = created_by);

-- 6. Configuração do Storage para logotipos de fornecedores
INSERT INTO storage.buckets (id, name, public)
VALUES ('supplier-logos', 'supplier-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para o bucket supplier-logos
DROP POLICY IF EXISTS "Permitir leitura pública dos logotipos" ON storage.objects;
CREATE POLICY "Permitir leitura pública dos logotipos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'supplier-logos');

DROP POLICY IF EXISTS "Permitir upload autenticado de logotipos" ON storage.objects;
CREATE POLICY "Permitir upload autenticado de logotipos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'supplier-logos' 
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Permitir atualização autenticada de logotipos" ON storage.objects;
CREATE POLICY "Permitir atualização autenticada de logotipos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'supplier-logos' 
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Permitir remoção autenticada de logotipos" ON storage.objects;
CREATE POLICY "Permitir remoção autenticada de logotipos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'supplier-logos' 
        AND auth.role() = 'authenticated'
    );
