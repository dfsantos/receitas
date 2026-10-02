import { apiClient } from './client';
import type { Category, PaginatedRecipes, Recipe, RecipeInput } from '@/types/recipe';

export interface ListRecipesParams {
  search?: string;
  category?: Category;
  page?: number;
  pageSize?: number;
}

function toQueryString(params: ListRecipesParams): string {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

export const recipesApi = {
  list: (params: ListRecipesParams = {}) =>
    apiClient.get<PaginatedRecipes>(`/recipes${toQueryString(params)}`),
  get: (id: string) => apiClient.get<Recipe>(`/recipes/${id}`),
  create: (input: RecipeInput) => apiClient.post<Recipe>('/recipes', input),
  update: (id: string, input: Partial<RecipeInput>) =>
    apiClient.patch<Recipe>(`/recipes/${id}`, input),
  remove: (id: string) => apiClient.delete<void>(`/recipes/${id}`),
};
