<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="layout">
    <header class="layout__header">
      <RouterLink to="/" class="layout__brand">🍲 Receitas</RouterLink>
      <RouterLink to="/receitas/novo" class="button button--primary">Nova receita</RouterLink>
    </header>
    <main class="layout__content">
      <RouterView />
    </main>
  </div>
</template>
