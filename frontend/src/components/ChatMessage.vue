<template>
  <div class="row" :class="{ 'row--user': isUser }">
    <div class="bubble" :class="{ 'bubble--user': isUser }">
      <div class="bubble__text">{{ message.content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage as ChatMessageType } from '@/api'
import { computed } from 'vue'

const props = defineProps<{ message: ChatMessageType }>()
const isUser = computed(() => props.message.role === 'user')
</script>

<style scoped>
.row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}
.row--user {
  justify-content: flex-end;
}
.bubble {
  max-width: min(70%, 720px);
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
html.dark .bubble {
  background: rgba(226, 232, 240, 0.06);
}
.bubble--user {
  background: var(--primary);
  border-color: transparent;
  color: var(--primary-contrast);
}
.bubble__text {
  font-size: 14px;
  line-height: 1.35;
}
</style>

