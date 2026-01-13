<template>
  <teleport to="body">
    <div v-if="open" class="backdrop" @click.self="$emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal__header">
          <div class="modal__title">{{ title }}</div>
          <button class="btn btn--ghost" type="button" @click="$emit('close')">Close</button>
        </div>
        <div class="modal__body">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; title: string }>()
defineEmits<{ (e: 'close'): void }>()
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 60;
}
.modal {
  width: min(900px, 100%);
  max-height: min(80vh, 820px);
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
}
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}
.modal__title {
  font-weight: 700;
}
.modal__body {
  padding: 14px;
  overflow: auto;
}
.btn {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--fg);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
}
.btn--ghost {
  background: transparent;
}
</style>

