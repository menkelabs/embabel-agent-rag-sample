import { onBeforeUnmount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { MessageOutputChannelEvent } from '@/types/chatEvents'

export interface UseChatSSEReturn {
  isConnected: Ref<boolean>
  error: Ref<string | null>
  onMessage: (cb: (content: string) => void) => void
}

export function useChatSSE(conversationId: Ref<string | null>): UseChatSSEReturn {
  const isConnected = ref(false)
  const error = ref<string | null>(null)
  const eventSource = ref<EventSource | null>(null)
  const onMessageCb = ref<((content: string) => void) | null>(null)

  function close() {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    isConnected.value = false
  }

  watch(
    conversationId,
    (id) => {
      close()
      error.value = null

      if (!id) return

      const es = new EventSource(`/chat/stream/${id}`)
      eventSource.value = es

      es.onopen = () => {
        isConnected.value = true
        error.value = null
      }

      // Generic message handler (useful for debugging)
      es.onmessage = () => {
        // Intentionally no-op; typed events are handled via addEventListener below.
      }

      es.addEventListener('MessageOutputChannelEvent', (e) => {
        try {
          const data = (e as MessageEvent).data
          const event: MessageOutputChannelEvent = JSON.parse(data)
          const content = event.message?.content
          if (content && onMessageCb.value) onMessageCb.value(content)
        } catch {
          // ignore malformed events
        }
      })

      es.onerror = () => {
        error.value = `Connection error (readyState: ${es.readyState})`
        isConnected.value = false
      }
    },
    { immediate: true },
  )

  function onMessage(cb: (content: string) => void) {
    onMessageCb.value = cb
  }

  onBeforeUnmount(() => {
    close()
  })

  return { isConnected, error, onMessage }
}

