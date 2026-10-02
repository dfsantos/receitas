<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useRecipesStore } from '@/stores/recipes';
import { CATEGORY_LABELS, type Recipe } from '@/types/recipe';

const props = defineProps<{ id: string }>();
const router = useRouter();
const store = useRecipesStore();
const recipe = ref<Recipe | null>(null);
const deleting = ref(false);

onMounted(async () => {
  recipe.value = await store.fetchOne(props.id);
});

async function handleDelete() {
  if (!recipe.value) return;
  if (!window.confirm(`Excluir a receita "${recipe.value.title}"?`)) return;

  deleting.value = true;
  try {
    await store.remove(recipe.value.id);
    router.push({ name: 'recipe-list' });
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <section v-if="store.loading" class="muted">Carregando receita...</section>
  <section v-else-if="store.error" class="field__error">{{ store.error }}</section>
  <section v-else-if="recipe" class="recipe-detail">
    <div class="recipe-detail__header">
      <div>
        <span class="badge">{{ CATEGORY_LABELS[recipe.category] }}</span>
        <h1>{{ recipe.title }}</h1>
        <p class="muted">{{ recipe.description }}</p>
        <p class="muted">⏱ {{ recipe.prepTimeMin }} min · 🍽 {{ recipe.servings }} porcoes</p>
      </div>
      <div class="recipe-detail__actions">
        <RouterLink
          :to="{ name: 'recipe-edit', params: { id: recipe.id } }"
          class="button button--secondary"
        >
          Editar
        </RouterLink>
        <button class="button button--danger" :disabled="deleting" @click="handleDelete">
          {{ deleting ? 'Excluindo...' : 'Excluir' }}
        </button>
      </div>
    </div>

    <div class="recipe-detail__grid">
      <div class="card">
        <h2>Ingredientes</h2>
        <ul>
          <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
            {{ ingredient.quantity }} de {{ ingredient.name }}
          </li>
        </ul>
      </div>
      <div class="card">
        <h2>Modo de preparo</h2>
        <ol>
          <li v-for="step in recipe.steps" :key="step.id">{{ step.description }}</li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.recipe-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.recipe-detail__actions {
  display: flex;
  gap: 0.6rem;
}

.recipe-detail__grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1rem;
}

@media (max-width: 720px) {
  .recipe-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
