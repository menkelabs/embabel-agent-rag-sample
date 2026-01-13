<template>
  <teleport to="body">
    <div class="toaster">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.type}`"
        @click="remove(t.id)"
      >
        <div class="toast__title">{{ t.title }}</div>
        <div v-if="t.description" class="toast__desc">{{ t.description }}</div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useToasts } from '@/composables/useToasts'

const { toasts, remove } = useToasts()
</script>

<style scoped>
.toaster {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(380px, calc(100vw - 24px));
}
.toast {
  background: var(--panel);
  border: 1px solid var(--border);
  border-left: 4px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.toast__title {
  font-weight: 600;
  font-size: 14px;
}
.toast__desc {
  margin-top: 2px;
  font-size: 13px;
  color: var(--muted);
}
.toast--success {
  border-left-color: #16a34a;
}
.toast--error {
  border-left-color: var(--danger);
}
.toast--info {
  border-left-color: var(--primary);
}
</style>

