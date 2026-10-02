<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { CATEGORY_LABELS } from '@/types/recipe';
import type { Recipe } from '@/types/recipe';

defineProps<{ recipe: Recipe }>();
</script>

<template>
  <RouterLink :to="{ name: 'recipe-detail', params: { id: recipe.id } }" class="recipe-card card">
    <span class="badge">{{ CATEGORY_LABELS[recipe.category] }}</span>
    <h3>{{ recipe.title }}</h3>
    <p class="muted recipe-card__description">{{ recipe.description }}</p>
    <div class="recipe-card__meta muted">
      <span>⏱ {{ recipe.prepTimeMin }} min</span>
      <span>🍽 {{ recipe.servings }} porcoes</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: inherit;
}

.recipe-card h3 {
  margin: 0;
}

.recipe-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.recipe-card__meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
}
</style>
