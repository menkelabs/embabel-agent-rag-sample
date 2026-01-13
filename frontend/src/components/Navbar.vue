<template>
  <header class="nav">
    <div class="nav__left">
      <img class="nav__logo" :src="logoUrl" alt="JettroDev Logo" />
      <div class="nav__title">Knowledge Agent</div>

      <div class="nav__tabs">
        <button
          class="tab"
          :class="{ 'tab--active': currentScreen === 'chat' }"
          type="button"
          @click="$emit('change-screen', 'chat')"
        >
          Chat
        </button>
        <button
          class="tab"
          :class="{ 'tab--active': currentScreen === 'admin' }"
          type="button"
          @click="$emit('change-screen', 'admin')"
        >
          Admin
        </button>
      </div>
    </div>

    <div class="nav__right">
      <div class="nav__welcome">Welcome, {{ auth.username.value }}</div>
      <button class="btn btn--danger" type="button" :disabled="isLoggingOut" @click="handleLogout">
        {{ isLoggingOut ? 'Logging out…' : 'Logout' }}
      </button>
      <ColorModeButton />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logout as apiLogout } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { useToasts } from '@/composables/useToasts'
import ColorModeButton from '@/components/ColorModeButton.vue'
import logoUrl from '@/assets/logo-jettrodev.png'

type Screen = 'chat' | 'admin'

defineProps<{ currentScreen: Screen }>()
defineEmits<{ (e: 'change-screen', screen: Screen): void }>()

const auth = useAuth()
const toasts = useToasts()
const isLoggingOut = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  try {
    await apiLogout()
    auth.logout()
    toasts.create({ title: 'Logged out', description: 'You have been successfully logged out', type: 'success' })
  } catch {
    auth.logout()
    toasts.create({ title: 'Logged out', description: 'Logged out locally', type: 'info' })
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--panel);
}
.nav__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.nav__logo {
  height: 34px;
  width: auto;
}
.nav__title {
  font-weight: 700;
  white-space: nowrap;
}
.nav__tabs {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}
.tab {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--fg);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
}
.tab--active {
  background: var(--primary);
  color: var(--primary-contrast);
  border-color: transparent;
}
.nav__right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav__welcome {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}
.btn {
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--fg);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
}
.btn--danger {
  border-color: rgba(220, 38, 38, 0.35);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

