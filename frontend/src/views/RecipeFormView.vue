<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ApiError } from '@/api/client';
import { useRecipesStore } from '@/stores/recipes';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  type Ingredient,
  type RecipeInput,
  type Step,
} from '@/types/recipe';

const props = defineProps<{ id?: string }>();
const router = useRouter();
const store = useRecipesStore();

const isEditing = computed(() => Boolean(props.id));
const loading = ref(false);
const submitting = ref(false);
const submitError = ref('');
const fieldErrors = ref<Record<string, string>>({});

const form = reactive<RecipeInput>({
  title: '',
  description: '',
  category: 'OUTRO',
  prepTimeMin: 30,
  servings: 4,
  imageUrl: '',
  ingredients: [{ name: '', quantity: '' }],
  steps: [{ description: '' }],
});

onMounted(async () => {
  if (!props.id) return;
  loading.value = true;
  const recipe = await store.fetchOne(props.id);
  if (recipe) {
    form.title = recipe.title;
    form.description = recipe.description;
    form.category = recipe.category;
    form.prepTimeMin = recipe.prepTimeMin;
    form.servings = recipe.servings;
    form.imageUrl = recipe.imageUrl ?? '';
    form.ingredients = recipe.ingredients.map((i) => ({ name: i.name, quantity: i.quantity }));
    form.steps = recipe.steps.map((s) => ({ description: s.description }));
  }
  loading.value = false;
});

function addIngredient() {
  form.ingredients.push({ name: '', quantity: '' });
}

function removeIngredient(index: number) {
  if (form.ingredients.length <= 1) return;
  form.ingredients.splice(index, 1);
}

function addStep() {
  form.steps.push({ description: '' });
}

function removeStep(index: number) {
  if (form.steps.length <= 1) return;
  form.steps.splice(index, 1);
}

function buildPayload(): RecipeInput {
  return {
    ...form,
    ingredients: form.ingredients.filter((i: Ingredient) => i.name.trim() && i.quantity.trim()),
    steps: form.steps.filter((s: Step) => s.description.trim()),
  };
}

async function handleSubmit() {
  submitting.value = true;
  submitError.value = '';
  fieldErrors.value = {};

  try {
    const payload = buildPayload();
    const recipe = isEditing.value
      ? await store.update(props.id as string, payload)
      : await store.create(payload);
    router.push({ name: 'recipe-detail', params: { id: recipe.id } });
  } catch (error) {
    if (error instanceof ApiError) {
      submitError.value = error.message;
      for (const issue of error.issues ?? []) {
        fieldErrors.value[issue.path] = issue.message;
      }
    } else {
      submitError.value = 'Erro inesperado ao salvar a receita';
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="recipe-form">
    <h1>{{ isEditing ? 'Editar receita' : 'Nova receita' }}</h1>

    <p v-if="loading" class="muted">Carregando receita...</p>

    <form v-else class="card" @submit.prevent="handleSubmit">
      <p v-if="submitError" class="field__error">{{ submitError }}</p>

      <div class="field">
        <label for="title">Titulo</label>
        <input id="title" v-model="form.title" type="text" required />
        <span v-if="fieldErrors.title" class="field__error">{{ fieldErrors.title }}</span>
      </div>

      <div class="field">
        <label for="description">Descricao</label>
        <textarea id="description" v-model="form.description" required></textarea>
        <span v-if="fieldErrors.description" class="field__error">{{
          fieldErrors.description
        }}</span>
      </div>

      <div class="form-row">
        <div class="field">
          <label for="category">Categoria</label>
          <select id="category" v-model="form.category">
            <option v-for="value in CATEGORIES" :key="value" :value="value">
              {{ CATEGORY_LABELS[value] }}
            </option>
          </select>
        </div>
        <div class="field">
          <label for="prepTimeMin">Tempo de preparo (min)</label>
          <input
            id="prepTimeMin"
            v-model.number="form.prepTimeMin"
            type="number"
            min="1"
            required
          />
        </div>
        <div class="field">
          <label for="servings">Porcoes</label>
          <input id="servings" v-model.number="form.servings" type="number" min="1" required />
        </div>
      </div>

      <div class="field">
        <label for="imageUrl">URL da imagem (opcional)</label>
        <input id="imageUrl" v-model="form.imageUrl" type="url" placeholder="https://..." />
      </div>

      <fieldset class="field">
        <legend>Ingredientes</legend>
        <span v-if="fieldErrors.ingredients" class="field__error">{{
          fieldErrors.ingredients
        }}</span>
        <div v-for="(ingredient, index) in form.ingredients" :key="index" class="dynamic-row">
          <input v-model="ingredient.quantity" placeholder="Quantidade" aria-label="Quantidade" />
          <input v-model="ingredient.name" placeholder="Ingrediente" aria-label="Ingrediente" />
          <button
            type="button"
            class="button button--secondary"
            :disabled="form.ingredients.length <= 1"
            @click="removeIngredient(index)"
          >
            Remover
          </button>
        </div>
        <button type="button" class="button button--secondary" @click="addIngredient">
          + Adicionar ingrediente
        </button>
      </fieldset>

      <fieldset class="field">
        <legend>Modo de preparo</legend>
        <span v-if="fieldErrors.steps" class="field__error">{{ fieldErrors.steps }}</span>
        <div v-for="(step, index) in form.steps" :key="index" class="dynamic-row">
          <span class="step-number">{{ index + 1 }}.</span>
          <textarea
            v-model="step.description"
            placeholder="Descreva o passo"
            aria-label="Passo"
          ></textarea>
          <button
            type="button"
            class="button button--secondary"
            :disabled="form.steps.length <= 1"
            @click="removeStep(index)"
          >
            Remover
          </button>
        </div>
        <button type="button" class="button button--secondary" @click="addStep">
          + Adicionar passo
        </button>
      </fieldset>

      <div class="form-actions">
        <button class="button button--primary" type="submit" :disabled="submitting">
          {{ submitting ? 'Salvando...' : 'Salvar receita' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.recipe-form h1 {
  margin-top: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

fieldset {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
}

legend {
  font-weight: 600;
  padding: 0 0.3rem;
}

.dynamic-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: flex-start;
}

.dynamic-row input {
  flex: 1;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.dynamic-row textarea {
  flex: 1;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  min-height: 50px;
}

.step-number {
  padding-top: 0.5rem;
  font-weight: 600;
  color: var(--color-muted);
}

.form-actions {
  margin-top: 1rem;
}

@media (max-width: 720px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
