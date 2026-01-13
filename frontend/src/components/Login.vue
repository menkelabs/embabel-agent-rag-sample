<template>
  <div class="page">
    <div class="card">
      <div class="brand">
        <img class="logo" :src="logoUrl" alt="JettroDev Logo" />
        <div class="title">Knowledge Agent</div>
        <div class="subtitle">Sign in to continue</div>
      </div>

      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          <span class="label">Username</span>
          <input v-model="username" class="input" type="text" autocomplete="username" :disabled="isLoading" />
        </label>

        <label class="field">
          <span class="label">Password</span>
          <input v-model="password" class="input" type="password" autocomplete="current-password" :disabled="isLoading" />
        </label>

        <button class="btn btn--primary" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToasts } from '@/composables/useToasts'
import logoUrl from '@/assets/logo-jettrodev.png'

const auth = useAuth()
const toasts = useToasts()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  if (!username.value.trim() || !password.value.trim()) {
    toasts.create({
      title: 'Validation Error',
      description: 'Please enter both username and password',
      type: 'error',
    })
    return
  }

  isLoading.value = true
  auth.login(username.value.trim(), password.value)
  toasts.create({ title: 'Login Successful', description: `Welcome, ${username.value.trim()}!`, type: 'success' })
  isLoading.value = false
}
</script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.card {
  width: min(420px, 100%);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
.logo {
  height: 56px;
}
.title {
  font-weight: 800;
  font-size: 20px;
}
.subtitle {
  font-size: 13px;
  color: var(--muted);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label {
  font-size: 12px;
  color: var(--muted);
}
.input {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--fg);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}
.btn {
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--fg);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 6px;
}
.btn--primary {
  border-color: transparent;
  background: var(--primary);
  color: var(--primary-contrast);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

