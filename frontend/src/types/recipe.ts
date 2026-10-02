export const CATEGORIES = [
  'CAFE_DA_MANHA',
  'ENTRADA',
  'PRATO_PRINCIPAL',
  'SOBREMESA',
  'LANCHE',
  'BEBIDA',
  'OUTRO',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  CAFE_DA_MANHA: 'Cafe da manha',
  ENTRADA: 'Entrada',
  PRATO_PRINCIPAL: 'Prato principal',
  SOBREMESA: 'Sobremesa',
  LANCHE: 'Lanche',
  BEBIDA: 'Bebida',
  OUTRO: 'Outro',
};

export interface Ingredient {
  id?: string;
  name: string;
  quantity: string;
}

export interface Step {
  id?: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: Category;
  prepTimeMin: number;
  servings: number;
  imageUrl?: string | null;
  ingredients: Ingredient[];
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeInput {
  title: string;
  description: string;
  category: Category;
  prepTimeMin: number;
  servings: number;
  imageUrl?: string;
  ingredients: Ingredient[];
  steps: Step[];
}

export interface PaginatedRecipes {
  items: Recipe[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
