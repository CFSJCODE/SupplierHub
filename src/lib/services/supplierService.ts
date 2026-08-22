import { createClient } from "@/lib/supabase/client";
import { Supplier, CreateSupplierInput, UpdateSupplierInput, SupplierFilters, SupplierStats } from "@/types/supplier";

// Demo initial dataset as requested in Requirement #49
export const DEMO_INITIAL_SUPPLIERS: Omit<Supplier, "id" | "created_by" | "created_at" | "updated_at">[] = [
  {
    name: "MakerHero",
    legal_name: "MakerHero Tecnologia Ltda.",
    trade_name: "MakerHero (antiga FilipeFlop)",
    website: "https://www.makerhero.com",
    email: "contato@makerhero.com",
    phone: "(48) 3371-7000",
    whatsapp: "48999990001",
    country: "Brasil",
    state: "SC",
    city: "Florianópolis",
    address: "Rodovia José Carlos Daux, 5500",
    category: "Microcontroladores",
    status: "Preferencial",
    rating: 5,
    favorite: true,
    description: "Referência nacional em placas Arduino, ESP32, Raspberry Pi, módulos e impressão 3D.",
    advantages: "Entrega rápida, suporte técnico especializado, ampla documentação e tutoriais.",
    limitations: "Preço ligeiramente acima de importação direta.",
    purchase_experience: "Excelente atendimento pós-venda e embalagem muito bem protegida para componentes sensíveis.",
    notes: "Utilizar como fornecedor prioritário para prototipagem rápida e desenvolvimento de PoCs.",
    logo_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&auto=format&fit=crop&q=80",
  },
  {
    name: "RoboCore",
    legal_name: "RoboCore Tecnologia Eireli",
    trade_name: "RoboCore",
    website: "https://www.robocore.net",
    email: "vendas@robocore.net",
    phone: "(11) 4118-2000",
    whatsapp: "11988880002",
    country: "Brasil",
    state: "SP",
    city: "Barueri",
    address: "Al. Rio Negro, 503",
    category: "Robótica",
    status: "Preferencial",
    rating: 5,
    favorite: true,
    description: "Fabricante e distribuidor especializado em robótica de combate, motores de alta potência, drivers e shields industriais.",
    advantages: "Equipamentos de alta robustez mecânica e eletrônica, desenvolvimento nacional.",
    limitations: "Catálogo focado em robótica e acionamentos.",
    purchase_experience: "Qualidade de construção impecável dos motores e pontes H.",
    notes: "Fornecedor padrão para sistemas de tração, servomotores de alto torque e drivers de potência.",
    logo_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=128&auto=format&fit=crop&q=80",
  },
  {
    name: "UsinaInfo",
    legal_name: "UsinaInfo Comércio Eletrônico Ltda.",
    trade_name: "UsinaInfo",
    website: "https://www.usinainfo.com.br",
    email: "atendimento@usinainfo.com.br",
    phone: "(54) 3025-1000",
    whatsapp: "54999990003",
    country: "Brasil",
    state: "RS",
    city: "Caxias do Sul",
    address: "Rua Sinimbu, 1200",
    category: "Ferramentas",
    status: "Ativo",
    rating: 4,
    favorite: false,
    description: "Amplo catálogo de ferramentas para bancada eletrônica, estações de solda, instrumentos de medição e insumos.",
    advantages: "Grande variedade de ferramentas específicas para manutenção e prototipagem.",
    limitations: "Estoque de alguns CIs específicos pode variar.",
    purchase_experience: "Envio ágil com opções de frete econômico.",
    notes: "Consultar sempre para aquisição de pontas de solda, microscópios USB e organizadores de bancada.",
    logo_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=128&auto=format&fit=crop&q=80",
  },
  {
    name: "Mouser Electronics",
    legal_name: "Mouser Electronics, Inc.",
    trade_name: "Mouser",
    website: "https://www.mouser.com",
    email: "brasil@mouser.com",
    phone: "(11) 4197-2000",
    whatsapp: null,
    country: "Estados Unidos",
    state: "Texas",
    city: "Mansfield",
    address: "1000 North Main Street",
    category: "Distribuidores",
    status: "Preferencial",
    rating: 5,
    favorite: true,
    description: "Distribuidor global autorizado de semicondutores e componentes eletrônicos originais com rastreabilidade total.",
    advantages: "Catálogo gigantesco, componentes 100% originais com datasheet e dados de engenharia completos.",
    limitations: "Frete internacional e impostos de importação em pedidos de baixo valor.",
    purchase_experience: "Padrão de excelência global em embalagem anti-estática e documentação de conformidade.",
    notes: "Ideal para BOMs de produção, circuitos integrados de precisão e componentes difíceis de encontrar localmente.",
    logo_url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=128&auto=format&fit=crop&q=80",
  },
  {
    name: "DigiKey",
    legal_name: "DigiKey Corporation",
    trade_name: "DigiKey",
    website: "https://www.digikey.com",
    email: "support@digikey.com",
    phone: "+1 800-344-4539",
    whatsapp: null,
    country: "Estados Unidos",
    state: "Minnesota",
    city: "Thief River Falls",
    address: "701 Brooks Avenue South",
    category: "Distribuidores",
    status: "Ativo",
    rating: 5,
    favorite: false,
    description: "Líder global em distribuição de componentes eletrônicos e ferramentas de design paramétrico para engenharia.",
    advantages: "Ferramenta de busca paramétrica excepcional e estoque em tempo real.",
    limitations: "Processo de desembaraço aduaneiro para o Brasil.",
    purchase_experience: "Despacho no mesmo dia para pedidos internacionais.",
    notes: "Excelente para pesquisa de componentes equivalentes e substitutos técnicos.",
    logo_url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=128&auto=format&fit=crop&q=80",
  },
  {
    name: "AliExpress",
    legal_name: "Alibaba Group",
    trade_name: "AliExpress Choice & Direct",
    website: "https://www.aliexpress.com",
    email: null,
    phone: null,
    whatsapp: null,
    country: "China",
    state: "Zhejiang",
    city: "Hangzhou",
    address: "969 West Wen Yi Road",
    category: "Marketplaces",
    status: "Em avaliação",
    rating: 3,
    favorite: false,
    description: "Marketplace internacional para insumos mecânicos, perfis de alumínio, rolamentos, parafusos e componentes genéricos.",
    advantages: "Preço unitário extremamente baixo para itens mecânicos e fixadores em quantidade.",
    limitations: "Tempo de trânsito internacional e variação de controle de qualidade entre vendedores.",
    purchase_experience: "Comprar somente de lojas oficiais com classificação superior a 95%.",
    notes: "Utilizar para perfis V-Slot, parafusos inox M2/M3/M4 e barras roscadas.",
    logo_url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=128&auto=format&fit=crop&q=80",
  }
];

// Helper to check if real Supabase environment variables are present
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    !url.includes("your-project") &&
    !url.includes("dummy") &&
    key &&
    !key.includes("dummy") &&
    key.length > 20
  );
}

// Local storage key for offline / preview mode fallback
const LOCAL_STORAGE_KEY = "supplierhub_local_suppliers_v1";

function getLocalSuppliers(): Supplier[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // Initialize with demo suppliers if empty
      const initial: Supplier[] = DEMO_INITIAL_SUPPLIERS.map((s, idx) => ({
        ...s,
        id: `demo-${idx + 1}-${Date.now()}`,
        created_by: "local-user-id",
        created_at: new Date(Date.now() - idx * 86400000).toISOString(),
        updated_at: new Date(Date.now() - idx * 86400000).toISOString(),
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erro ao ler dados locais:", err);
    return [];
  }
}

function setLocalSuppliers(suppliers: Supplier[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(suppliers));
  } catch (err) {
    console.error("Erro ao salvar dados locais:", err);
  }
}

export const supplierService = {
  // Obter lista com filtros e busca com debounce
  async getSuppliers(filters?: Partial<SupplierFilters>): Promise<Supplier[]> {
    if (!isSupabaseConfigured()) {
      let result = getLocalSuppliers();

      if (filters) {
        if (filters.search) {
          const s = filters.search.toLowerCase().trim();
          result = result.filter(
            (item) =>
              item.name.toLowerCase().includes(s) ||
              item.category.toLowerCase().includes(s) ||
              (item.city && item.city.toLowerCase().includes(s)) ||
              (item.state && item.state.toLowerCase().includes(s)) ||
              (item.country && item.country.toLowerCase().includes(s)) ||
              (item.description && item.description.toLowerCase().includes(s))
          );
        }
        if (filters.category) {
          result = result.filter((item) => item.category === filters.category);
        }
        if (filters.status) {
          result = result.filter((item) => item.status === filters.status);
        }
        if (filters.state) {
          result = result.filter((item) => item.state === filters.state);
        }
        if (filters.country) {
          result = result.filter((item) => item.country === filters.country);
        }
        if (filters.favoriteOnly) {
          result = result.filter((item) => item.favorite === true);
        }

        // Ordenação
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case "name_asc":
              result.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "name_desc":
              result.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case "created_desc":
              result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              break;
            case "created_asc":
              result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              break;
            case "updated_desc":
              result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              break;
            case "rating_desc":
              result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
              break;
          }
        }
      }
      return result;
    }

    const supabase = createClient();
    let query = supabase.from("suppliers").select("*");

    if (filters) {
      if (filters.search) {
        const s = `%${filters.search.trim()}%`;
        query = query.or(`name.ilike.${s},category.ilike.${s},city.ilike.${s},state.ilike.${s},country.ilike.${s}`);
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
    if (!isSupabaseConfigured()) {
      const list = getLocalSuppliers();
      return list.find((s) => s.id === id) || null;
    }

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

  // Criar novo fornecedor
  async createSupplier(input: CreateSupplierInput): Promise<Supplier> {
    if (!isSupabaseConfigured()) {
      const list = getLocalSuppliers();
      const newSupplier: Supplier = {
        ...input,
        id: `sup-${Date.now()}`,
        created_by: "local-user-id",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalSuppliers([newSupplier, ...list]);
      return newSupplier;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado.");
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
    if (!isSupabaseConfigured()) {
      const list = getLocalSuppliers();
      const index = list.findIndex((s) => s.id === id);
      if (index === -1) throw new Error("Fornecedor não encontrado.");
      const updated: Supplier = {
        ...list[index],
        ...input,
        updated_at: new Date().toISOString(),
      };
      list[index] = updated;
      setLocalSuppliers(list);
      return updated;
    }

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
    if (!isSupabaseConfigured()) {
      const list = getLocalSuppliers();
      setLocalSuppliers(list.filter((s) => s.id !== id));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("suppliers").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir fornecedor:", error);
      throw error;
    }
  },

  // Alternar status de favorito com feedback instantâneo
  async toggleFavorite(id: string, currentStatus: boolean): Promise<boolean> {
    const nextStatus = !currentStatus;
    if (!isSupabaseConfigured()) {
      const list = getLocalSuppliers();
      const item = list.find((s) => s.id === id);
      if (item) {
        item.favorite = nextStatus;
        item.updated_at = new Date().toISOString();
        setLocalSuppliers(list);
      }
      return nextStatus;
    }

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

  // Popular com dados de demonstração iniciais
  async seedDemoSuppliers(): Promise<number> {
    if (!isSupabaseConfigured()) {
      const current = getLocalSuppliers();
      const existingNames = new Set(current.map((s) => s.name.toLowerCase()));
      const toAdd = DEMO_INITIAL_SUPPLIERS.filter(
        (s) => !existingNames.has(s.name.toLowerCase())
      );

      const newItems: Supplier[] = toAdd.map((s, idx) => ({
        ...s,
        id: `seed-${idx + 1}-${Date.now()}`,
        created_by: "local-user-id",
        created_at: new Date(Date.now() - idx * 3600000).toISOString(),
        updated_at: new Date(Date.now() - idx * 3600000).toISOString(),
      }));

      setLocalSuppliers([...newItems, ...current]);
      return newItems.length;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Faça login para popular fornecedores.");

    const payloads = DEMO_INITIAL_SUPPLIERS.map((s) => ({
      ...s,
      created_by: user.id,
    }));

    const { data, error } = await supabase.from("suppliers").insert(payloads).select();
    if (error) {
      console.error("Erro ao popular dados de exemplo:", error);
      throw error;
    }
    return data ? data.length : 0;
  },

  // Upload de logotipo para o Supabase Storage
  async uploadLogo(file: File): Promise<string> {
    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Formato de arquivo inválido. Envie JPG, PNG, WebP ou SVG.");
    }

    // Validar tamanho máximo (2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("O tamanho máximo do logotipo é 2MB.");
    }

    if (!isSupabaseConfigured()) {
      // Em modo de demonstração local, cria data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
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
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("supplier-logos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
