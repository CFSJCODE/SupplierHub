import { createClient } from "@/lib/supabase/client";
import {
  Supplier,
  CreateSupplierInput,
  UpdateSupplierInput,
  SupplierFilters,
  SupplierStats,
} from "@/types/supplier";

export const supplierService = {
  // Obter lista com filtros e busca
  async getSuppliers(filters?: Partial<SupplierFilters>): Promise<Supplier[]> {
    const supabase = createClient();
    let query = supabase.from("suppliers").select("*");

    if (filters) {
      if (filters.search) {
        const s = `%${filters.search.trim()}%`;
        query = query.or(
          `name.ilike.${s},category.ilike.${s},city.ilike.${s},state.ilike.${s},country.ilike.${s},description.ilike.${s}`
        );
      }
      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.state) {
        query = query.eq("state", filters.state);
      }
      if (filters.country) {
        query = query.eq("country", filters.country);
      }
      if (filters.favoriteOnly) {
        query = query.eq("favorite", true);
      }

      // Ordenação
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "name_asc":
            query = query.order("name", { ascending: true });
            break;
          case "name_desc":
            query = query.order("name", { ascending: false });
            break;
          case "created_desc":
            query = query.order("created_at", { ascending: false });
            break;
          case "created_asc":
            query = query.order("created_at", { ascending: true });
            break;
          case "updated_desc":
            query = query.order("updated_at", { ascending: false });
            break;
          case "rating_desc":
            query = query.order("rating", { ascending: false, nullsFirst: false });
            break;
        }
      } else {
        query = query.order("created_at", { ascending: false });
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      console.error("Erro ao buscar fornecedores no Supabase:", error);
      throw error;
    }
    return data || [];
  },

  // Obter um fornecedor específico por ID
  async getSupplierById(id: string): Promise<Supplier | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      console.error("Erro ao buscar fornecedor:", error);
      throw error;
    }
    return data;
  },

  // Criar novo fornecedor no Supabase
  async createSupplier(input: CreateSupplierInput): Promise<Supplier> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Sua sessão expirou. Faça login novamente para cadastrar fornecedores.");
    }

    const payload = {
      ...input,
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("suppliers")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar fornecedor no Supabase:", error);
      throw error;
    }
    return data;
  },

  // Atualizar fornecedor existente
  async updateSupplier(id: string, input: UpdateSupplierInput): Promise<Supplier> {
    const supabase = createClient();
    const payload = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("suppliers")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
    return data;
  },

  // Excluir fornecedor
  async deleteSupplier(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("suppliers").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir fornecedor:", error);
      throw error;
    }
  },

  // Alternar status de favorito
  async toggleFavorite(id: string, currentStatus: boolean): Promise<boolean> {
    const nextStatus = !currentStatus;
    const supabase = createClient();
    const { error } = await supabase
      .from("suppliers")
      .update({ favorite: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Erro ao alternar favorito:", error);
      throw error;
    }
    return nextStatus;
  },

  // Estatísticas para o Dashboard
  async getDashboardStats(): Promise<{
    stats: SupplierStats;
    recentSuppliers: Supplier[];
    categoryCounts: Record<string, number>;
  }> {
    const all = await this.getSuppliers({ sortBy: "created_desc" });

    const total = all.length;
    const active = all.filter((s) => s.status === "Ativo").length;
    const preferred = all.filter((s) => s.status === "Preferencial").length;
    const evaluating = all.filter((s) => s.status === "Em avaliação").length;
    const favorites = all.filter((s) => s.favorite).length;

    const categorySet = new Set(all.map((s) => s.category));
    const categoriesCount = categorySet.size;

    const ratedSuppliers = all.filter((s) => s.rating && s.rating > 0);
    const averageRating =
      ratedSuppliers.length > 0
        ? ratedSuppliers.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedSuppliers.length
        : 0;

    const categoryCounts: Record<string, number> = {};
    all.forEach((s) => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });

    const recentSuppliers = all.slice(0, 5);

    return {
      stats: {
        total,
        active,
        favorites,
        categoriesCount,
        preferred,
        evaluating,
        averageRating,
      },
      recentSuppliers,
      categoryCounts,
    };
  },

  // Upload de logotipo para o Supabase Storage
  async uploadLogo(file: File): Promise<string> {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Formato de arquivo inválido. Envie uma imagem JPG, PNG, WebP ou SVG.");
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error("O tamanho máximo do logotipo é 2MB.");
    }

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("supplier-logos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro no upload do logotipo:", uploadError);
      throw new Error("Falha ao salvar a imagem no servidor. Tente novamente.");
    }

    const { data } = supabase.storage
      .from("supplier-logos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
