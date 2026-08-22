export type SupplierStatus = 'Ativo' | 'Inativo' | 'Em avaliação' | 'Preferencial';

export interface Supplier {
  id: string;
  created_by: string;
  
  // Identificação
  name: string;
  legal_name?: string | null;
  trade_name?: string | null;
  logo_url?: string | null;
  description?: string | null;

  // Contato
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;

  // Localização
  country: string;
  state?: string | null;
  city?: string | null;
  address?: string | null;

  // Classificação
  category: string;
  status: SupplierStatus;
  rating?: number | null; // 1 a 5
  favorite: boolean;

  // Informações Internas e Procurement
  notes?: string | null;
  advantages?: string | null;
  limitations?: string | null;
  purchase_experience?: string | null;

  // Auditoria
  created_at: string;
  updated_at: string;
}

export type CreateSupplierInput = Omit<Supplier, 'id' | 'created_by' | 'created_at' | 'updated_at'>;

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export type SupplierSortOption = 
  | 'name_asc' 
  | 'name_desc' 
  | 'created_desc' 
  | 'created_asc' 
  | 'updated_desc' 
  | 'rating_desc';

export interface SupplierFilters {
  search: string;
  category: string;
  status: string;
  state: string;
  country: string;
  favoriteOnly: boolean;
  sortBy: SupplierSortOption;
}

export interface SupplierStats {
  total: number;
  active: number;
  favorites: number;
  categoriesCount: number;
  preferred: number;
  evaluating: number;
  averageRating: number;
}
