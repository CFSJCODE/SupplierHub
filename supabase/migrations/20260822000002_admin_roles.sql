-- ==============================================================================
-- SupplierHub - Database Migration: Admin Roles & Privileges
-- Description: Políticas de RLS para conceder acesso de Administrador a claudiofranciscojunior2006@gmail.com
-- ==============================================================================

DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios fornecedores" ON public.suppliers;
CREATE POLICY "Usuários podem visualizar seus próprios fornecedores"
    ON public.suppliers
    FOR SELECT
    USING (
        auth.uid() = created_by 
        OR (auth.jwt() ->> 'email') = 'claudiofranciscojunior2006@gmail.com'
    );

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios fornecedores" ON public.suppliers;
CREATE POLICY "Usuários podem atualizar seus próprios fornecedores"
    ON public.suppliers
    FOR UPDATE
    USING (
        auth.uid() = created_by 
        OR (auth.jwt() ->> 'email') = 'claudiofranciscojunior2006@gmail.com'
    )
    WITH CHECK (
        auth.uid() = created_by 
        OR (auth.jwt() ->> 'email') = 'claudiofranciscojunior2006@gmail.com'
    );

DROP POLICY IF EXISTS "Usuários podem excluir seus próprios fornecedores" ON public.suppliers;
CREATE POLICY "Usuários podem excluir seus próprios fornecedores"
    ON public.suppliers
    FOR DELETE
    USING (
        auth.uid() = created_by 
        OR (auth.jwt() ->> 'email') = 'claudiofranciscojunior2006@gmail.com'
    );
