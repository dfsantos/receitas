<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import RecipeCard from '@/components/RecipeCard.vue';
import { useRecipesStore } from '@/stores/recipes';
import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/types/recipe';

const store = useRecipesStore();
const search = ref('');
const category = ref<Category | ''>('');
const page = ref(1);

function load() {
  store.fetchList({
    search: search.value || undefined,
    category: category.value || undefined,
    page: page.value,
  });
}

onMounted(load);

watch([search, category], () => {
  page.value = 1;
  load();
});

watch(page, load);

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > store.totalPages) return;
  page.value = nextPage;
}
</script>

<template>
  <section>
    <div class="filters">
      <input
        v-model="search"
        type="search"
        placeholder="Buscar receitas..."
        aria-label="Buscar receitas"
      />
      <select v-model="category" aria-label="Filtrar por categoria">
        <option value="">Todas as categorias</option>
        <option v-for="value in CATEGORIES" :key="value" :value="value">
          {{ CATEGORY_LABELS[value] }}
        </option>
      </select>
    </div>

    <p v-if="store.loading" class="muted">Carregando receitas...</p>
    <p v-else-if="store.error" class="field__error">{{ store.error }}</p>
    <p v-else-if="store.items.length === 0" class="empty-state">
      Nenhuma receita encontrada. Que tal cadastrar a primeira?
    </p>

    <div v-else class="recipe-grid">
      <RecipeCard v-for="recipe in store.items" :key="recipe.id" :recipe="recipe" />
    </div>

    <div v-if="store.totalPages > 1" class="pagination">
      <button class="button button--secondary" :disabled="page <= 1" @click="goToPage(page - 1)">
        Anterior
      </button>
      <span class="muted">Pagina {{ store.page }} de {{ store.totalPages }}</span>
      <button
        class="button button--secondary"
        :disabled="page >= store.totalPages"
        @click="goToPage(page + 1)"
      >
        Proxima
      </button>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.95rem;
}

.filters input {
  flex: 1;
  min-width: 220px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}
</style>
