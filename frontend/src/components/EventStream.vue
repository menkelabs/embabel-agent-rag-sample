<template>
  <aside v-if="conversationId" class="events">
    <div class="events__header">
      <div class="events__title">
        <span>Agent Events</span>
        <span class="badge" :class="{ 'badge--ok': isConnected }">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
      </div>
      <div class="events__sub">
        <span class="muted">Conversation: {{ conversationId.slice(0, 8) }}…</span>
        <button v-if="events.length" class="btn btn--ghost" type="button" @click="toggleExpandAll">
          {{ showAllExpanded ? 'Collapse All' : 'Expand All' }}
        </button>
      </div>
    </div>

    <div class="events__body">
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else-if="events.length === 0" class="empty">Waiting for events…</div>

      <div v-else class="list">
        <div v-for="(e, idx) in events" :key="idx" class="item">
          <div class="item__head" @click="toggleEvent(idx)">
            <div class="item__meta">
              <span class="pill">{{ shortType(e.type) || 'Unknown' }}</span>
              <span class="time">{{ new Date(e.timestamp).toLocaleTimeString() }}</span>
            </div>
            <div class="item__actions">
              <button class="btn btn--ghost" type="button" @click.stop="selectedEvent = e">Details</button>
              <button class="btn btn--ghost" type="button">
                {{ isExpanded(idx) ? '−' : '+' }}
              </button>
            </div>
          </div>

          <pre v-if="isExpanded(idx)" class="item__pre">{{ pretty(e) }}</pre>
        </div>
        <div ref="endRef"></div>
      </div>
    </div>

    <Modal :open="selectedEvent !== null" title="Event Details" @close="selectedEvent = null">
      <template v-if="selectedEvent">
        <div class="detail">
          <div class="detail__row">
            <div class="detail__k">Timestamp</div>
            <div class="detail__v">{{ new Date(selectedEvent.timestamp).toLocaleString() }}</div>
          </div>
          <div class="detail__row">
            <div class="detail__k">Event Type</div>
            <div class="detail__v">{{ selectedEvent.type || 'Unknown' }}</div>
          </div>
          <div class="detail__row">
            <div class="detail__k">Full Data</div>
            <pre class="detail__pre">{{ pretty(selectedEvent) }}</pre>
          </div>
        </div>
      </template>
    </Modal>
  </aside>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { AgentProcessEvent } from '@/types/events'
import { useSSE } from '@/composables/useSSE'
import Modal from '@/components/Modal.vue'

const props = defineProps<{ conversationId: string | null }>()

const processId = ref<string | null>(props.conversationId)
watch(
  () => props.conversationId,
  (v) => (processId.value = v),
)

const { events, isConnected, error } = useSSE(processId)

const endRef = ref<HTMLDivElement | null>(null)
watch(
  events,
  async () => {
    await nextTick()
    endRef.value?.scrollIntoView({ behavior: 'smooth' })
  },
  { deep: true },
)

const selectedEvent = ref<AgentProcessEvent | null>(null)
const expanded = ref<Set<number>>(new Set())
const showAllExpanded = ref(false)

function isExpanded(index: number) {
  return expanded.value.has(index)
}

function toggleEvent(index: number) {
  const next = new Set(expanded.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  expanded.value = next
}

function toggleExpandAll() {
  if (showAllExpanded.value) {
    expanded.value = new Set()
  } else {
    expanded.value = new Set(events.value.map((_, i) => i))
  }
  showAllExpanded.value = !showAllExpanded.value
}

function shortType(type: string) {
  const stripped = type.split('.').slice(-1)[0] ?? type
  return stripped.length > 20 ? stripped.slice(0, 20) + '…' : stripped
}

function pretty(e: unknown) {
  return JSON.stringify(e, null, 2)
}
</script>

<style scoped>
.events {
  height: 100%;
  border-left: 1px solid var(--border);
  background: var(--panel);
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.events__header {
  padding: 14px;
  border-bottom: 1px solid var(--border);
}
.events__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
}
.badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--muted);
}
.badge--ok {
  color: #16a34a;
  border-color: rgba(22, 163, 74, 0.35);
}
.events__sub {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.muted {
  font-size: 12px;
  color: var(--muted);
}
.events__body {
  flex: 1;
  overflow: auto;
  padding: 12px;
}
.error {
  padding: 10px 12px;
  border: 1px solid rgba(220, 38, 38, 0.35);
  border-radius: 10px;
  color: var(--danger);
  background: rgba(220, 38, 38, 0.06);
}
.empty {
  color: var(--muted);
  font-size: 13px;
  text-align: center;
  padding: 18px 12px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.item__head {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}
.item__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.pill {
  font-size: 11px;
  border: 1px solid var(--border);
  padding: 3px 8px;
  border-radius: 999px;
}
.time {
  font-size: 11px;
  color: var(--muted);
}
.item__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.item__pre {
  margin: 0;
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.03);
  font-size: 11px;
  overflow: auto;
}
html.dark .item__pre {
  background: rgba(226, 232, 240, 0.04);
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
.detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.detail__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail__k {
  font-size: 12px;
  color: var(--muted);
}
.detail__v {
  font-size: 13px;
}
.detail__pre {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 12px;
  overflow: auto;
  max-height: 420px;
}
</style>

