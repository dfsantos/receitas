// @ts-check
import eslint from '@eslint/js';
import skipFormatting from '@vue/eslint-config-prettier';
import vueConfigTs from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

export default [
  eslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueConfigTs(),
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
