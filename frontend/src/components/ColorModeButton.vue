<template>
  <button class="btn btn--ghost" type="button" @click="toggle">
    {{ isDark ? 'Light' : 'Dark' }}
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function setTheme(theme: 'light' | 'dark') {
  const html = document.documentElement
  if (theme === 'dark') html.classList.add('dark')
  else html.classList.remove('dark')
  localStorage.setItem('theme', theme)
}

const theme = ref<'light' | 'dark'>(getInitialTheme())
setTheme(theme.value)

const isDark = computed(() => theme.value === 'dark')

function toggle() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  setTheme(theme.value)
}
</script>

<style scoped>
.btn {
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--fg);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
}
.btn--ghost {
  background: transparent;
}
</style>

