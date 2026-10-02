import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRecipesStore } from '../recipes';
import { recipesApi } from '@/api/recipes';
import type { Recipe } from '@/types/recipe';

vi.mock('@/api/recipes', () => ({
  recipesApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const sampleRecipe: Recipe = {
  id: '1',
  title: 'Brigadeiro',
  description: 'Doce de chocolate tradicional.',
  category: 'SOBREMESA',
  prepTimeMin: 20,
  servings: 15,
  ingredients: [],
  steps: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  setActivePinia(createPinia());
  vi.resetAllMocks();
});

describe('useRecipesStore', () => {
  it('carrega a lista de receitas', async () => {
    vi.mocked(recipesApi.list).mockResolvedValue({
      items: [sampleRecipe],
      total: 1,
      page: 1,
      pageSize: 12,
      totalPages: 1,
    });

    const store = useRecipesStore();
    await store.fetchList();

    expect(store.items).toHaveLength(1);
    expect(store.items[0]?.title).toBe('Brigadeiro');
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('registra erro quando a listagem falha', async () => {
    vi.mocked(recipesApi.list).mockRejectedValue(new Error('falhou'));

    const store = useRecipesStore();
    await store.fetchList();

    expect(store.error).toBe('Falha ao carregar receitas');
  });

  it('remove uma receita da lista local apos exclusao', async () => {
    vi.mocked(recipesApi.remove).mockResolvedValue(undefined);

    const store = useRecipesStore();
    store.items = [sampleRecipe];

    await store.remove(sampleRecipe.id);

    expect(store.items).toHaveLength(0);
  });
});
