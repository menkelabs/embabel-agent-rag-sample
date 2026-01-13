import { onBeforeUnmount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { AgentProcessEvent } from '@/types/events'

export interface UseSSEReturn {
  events: Ref<AgentProcessEvent[]>
  isConnected: Ref<boolean>
  error: Ref<string | null>
  clearEvents: () => void
}

export function useSSE(processId: Ref<string | null>): UseSSEReturn {
  const events = ref<AgentProcessEvent[]>([])
  const isConnected = ref(false)
  const error = ref<string | null>(null)
  const eventSource = ref<EventSource | null>(null)

  function close() {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    isConnected.value = false
  }

  watch(
    processId,
    (id) => {
      events.value = []
      error.value = null
      close()

      if (!id) return

      const es = new EventSource(`/events/process/${id}`)
      eventSource.value = es

      es.addEventListener('connected', () => {
        isConnected.value = true
        error.value = null
      })

      es.addEventListener('agent-process-event', (e) => {
        try {
          const data = (e as MessageEvent).data
          const event: AgentProcessEvent = JSON.parse(data)
          events.value = [...events.value, event]
        } catch {
          // ignore malformed events
        }
      })

      es.onerror = () => {
        error.value = 'Connection error'
        isConnected.value = false
      }
    },
    { immediate: true },
  )

  function clearEvents() {
    events.value = []
  }

  onBeforeUnmount(() => close())

  return { events, isConnected, error, clearEvents }
}

