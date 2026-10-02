import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'recipe-list',
      component: () => import('@/views/RecipeListView.vue'),
    },
    {
      path: '/receitas/novo',
      name: 'recipe-create',
      component: () => import('@/views/RecipeFormView.vue'),
    },
    {
      path: '/receitas/:id',
      name: 'recipe-detail',
      component: () => import('@/views/RecipeDetailView.vue'),
      props: true,
    },
    {
      path: '/receitas/:id/editar',
      name: 'recipe-edit',
      component: () => import('@/views/RecipeFormView.vue'),
      props: true,
    },
  ],
});

export default router;
