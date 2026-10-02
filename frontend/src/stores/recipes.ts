import { defineStore } from 'pinia';
import { ApiError } from '@/api/client';
import { recipesApi, type ListRecipesParams } from '@/api/recipes';
import type { Recipe, RecipeInput } from '@/types/recipe';

interface RecipesState {
  items: Recipe[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export const useRecipesStore = defineStore('recipes', {
  state: (): RecipesState => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchList(params: ListRecipesParams = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await recipesApi.list(params);
        this.items = result.items;
        this.total = result.total;
        this.page = result.page;
        this.pageSize = result.pageSize;
        this.totalPages = result.totalPages;
      } catch (error) {
        this.error = error instanceof ApiError ? error.message : 'Falha ao carregar receitas';
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id: string): Promise<Recipe | null> {
      this.loading = true;
      this.error = null;
      try {
        return await recipesApi.get(id);
      } catch (error) {
        this.error = error instanceof ApiError ? error.message : 'Receita nao encontrada';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async create(input: RecipeInput): Promise<Recipe> {
      const recipe = await recipesApi.create(input);
      this.items.unshift(recipe);
      return recipe;
    },

    async update(id: string, input: Partial<RecipeInput>): Promise<Recipe> {
      const recipe = await recipesApi.update(id, input);
      const index = this.items.findIndex((item) => item.id === id);
      if (index !== -1) this.items[index] = recipe;
      return recipe;
    },

    async remove(id: string): Promise<void> {
      await recipesApi.remove(id);
      this.items = this.items.filter((item) => item.id !== id);
    },
  },
});
