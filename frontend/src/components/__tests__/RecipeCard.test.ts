import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import RecipeCard from '../RecipeCard.vue';
import type { Recipe } from '@/types/recipe';

const recipe: Recipe = {
  id: '1',
  title: 'Pao de Queijo',
  description: 'Tradicional pao de queijo mineiro, crocante por fora e macio por dentro.',
  category: 'LANCHE',
  prepTimeMin: 40,
  servings: 20,
  ingredients: [],
  steps: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'recipe-list', component: { template: '<div />' } },
    { path: '/receitas/:id', name: 'recipe-detail', component: { template: '<div />' } },
  ],
});

describe('RecipeCard', () => {
  it('exibe titulo, categoria e metadados da receita', async () => {
    await router.push('/');
    await router.isReady();

    const wrapper = mount(RecipeCard, {
      props: { recipe },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Pao de Queijo');
    expect(wrapper.text()).toContain('Lanche');
    expect(wrapper.text()).toContain('40 min');
    expect(wrapper.text()).toContain('20 porcoes');
  });
});
