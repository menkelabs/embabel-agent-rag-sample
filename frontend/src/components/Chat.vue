<template>
  <section class="chat">
    <div class="chat__messages">
      <div v-if="!conversationId" class="center">
        <div class="center__text">{{ isInitializing ? 'Initializing session…' : 'Initializing your chat session…' }}</div>
      </div>

      <div v-else-if="!isConnected" class="center">
        <div class="center__text">Connecting to chat stream…</div>
        <div v-if="sseError" class="center__error">Error: {{ sseError }}</div>
      </div>

      <div v-else-if="messages.length === 0" class="center">
        <div class="center__text">Start a conversation…</div>
        <div class="center__muted">Session ID: {{ conversationId.slice(0, 8) }}…</div>
      </div>

      <div v-else class="messages">
        <div class="messages__meta">Session: {{ conversationId.slice(0, 8) }}…</div>

        <ChatMessage v-for="(m, i) in messages" :key="i" :message="m" />

        <div v-if="isLoading" class="thinking">Assistant is thinking…</div>
        <div ref="messagesEndRef"></div>
      </div>
    </div>

    <div v-if="conversationId" class="chat__input">
      <input
        v-model="input"
        class="input"
        type="text"
        placeholder="Type your message…"
        :disabled="isLoading"
        @keydown.enter.exact.prevent="handleSend"
      />
      <button class="btn btn--primary" type="button" :disabled="isLoading || !input.trim()" @click="handleSend">
        {{ isLoading ? 'Sending…' : 'Send' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { ChatMessage as ChatMessageType } from '@/api'
import { initializeSession, sendChatMessage } from '@/api'
import { useChatSSE } from '@/composables/useChatSSE'
import { useAuth } from '@/composables/useAuth'
import { useToasts } from '@/composables/useToasts'
import ChatMessage from '@/components/ChatMessage.vue'

const emit = defineEmits<{ (e: 'conversation-id', id: string | null): void }>()

const auth = useAuth()
const toasts = useToasts()

const messages = ref<ChatMessageType[]>([])
const input = ref('')
const isLoading = ref(false)
const conversationId = ref<string | null>(null)
const isInitializing = ref(false)
const messagesEndRef = ref<HTMLDivElement | null>(null)

const { isConnected, error: sseError, onMessage } = useChatSSE(conversationId)

function scrollToBottom() {
  messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
}

watch(messages, async () => {
  await nextTick()
  scrollToBottom()
})

onMessage((content: string) => {
  messages.value = [
    ...messages.value,
    {
      role: 'assistant',
      content,
      timestamp: new Date(),
    },
  ]
  isLoading.value = false
})

async function handleInitializeSession() {
  isInitializing.value = true
  try {
    const res = await initializeSession()
    conversationId.value = res.conversationId
    emit('conversation-id', res.conversationId)
    messages.value = []
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to initialize'
    toasts.create({ title: 'Error initializing session', description: msg, type: 'error', durationMs: 7000 })
    conversationId.value = null
    emit('conversation-id', null)
  } finally {
    isInitializing.value = false
  }
}

async function handleSend() {
  if (!conversationId.value) return
  const text = input.value.trim()
  if (!text || isLoading.value) return

  messages.value = [
    ...messages.value,
    {
      role: 'user',
      content: text,
      timestamp: new Date(),
    },
  ]
  input.value = ''
  isLoading.value = true

  try {
    await sendChatMessage(text, conversationId.value)
    // Response will be streamed via SSE.
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to send message'
    toasts.create({ title: 'Send failed', description: msg, type: 'error', durationMs: 7000 })
    isLoading.value = false
  }
}

onMounted(() => {
  if (auth.username.value) void handleInitializeSession()
})

watch(
  () => auth.username.value,
  (u) => {
    if (u) void handleInitializeSession()
  },
)
</script>

<style scoped>
.chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.chat__messages {
  flex: 1;
  overflow: auto;
  padding: 18px;
}
.chat__input {
  display: flex;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid var(--border);
  background: var(--panel);
}
.input {
  flex: 1;
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
}
.btn--primary {
  background: var(--primary);
  border-color: transparent;
  color: var(--primary-contrast);
}
.btn:disabled,
.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.center {
  height: 100%;
  display: grid;
  place-items: center;
  text-align: center;
}
.center__text {
  font-size: 14px;
  color: var(--muted);
}
.center__muted {
  margin-top: 8px;
  font-size: 12px;
  color: var(--muted);
}
.center__error {
  margin-top: 8px;
  font-size: 12px;
  color: var(--danger);
}
.messages {
  display: flex;
  flex-direction: column;
}
.messages__meta {
  font-size: 12px;
  color: var(--muted);
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.thinking {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
}
</style>

