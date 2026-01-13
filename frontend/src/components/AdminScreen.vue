<template>
  <main class="admin">
    <div class="admin__wrap">
      <div class="admin__header">
        <div class="admin__title">Administration</div>
        <div class="admin__subtitle">Manage your knowledge base and system settings</div>
      </div>

      <section class="card">
        <div class="card__title">Data Ingestion</div>
        <div class="card__subtitle">Reindex your knowledge base documents</div>
        <p class="card__text">
          This process will scan the <code>./data</code> directory and ingest supported documents into the knowledge
          base.
        </p>

        <div v-if="lastIndexResult" class="result">
          <strong>Last Result:</strong> {{ lastIndexResult }}
        </div>

        <button class="btn btn--primary" type="button" :disabled="isReindexing" @click="handleReindex">
          {{ isReindexing ? 'Reindexing…' : 'Start Reindex' }}
        </button>
      </section>

      <section class="card card--muted">
        <div class="card__title">Additional Settings</div>
        <div class="card__text muted">More administrative features coming soon…</div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { reindexData } from '@/api'
import { useToasts } from '@/composables/useToasts'

const isReindexing = ref(false)
const lastIndexResult = ref<string | null>(null)
const toasts = useToasts()

async function handleReindex() {
  isReindexing.value = true
  lastIndexResult.value = null
  try {
    const result = await reindexData()
    lastIndexResult.value = result
    toasts.create({ title: 'Reindex Complete', description: result, type: 'success', durationMs: 5000 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error occurred'
    toasts.create({ title: 'Reindex Failed', description: msg, type: 'error', durationMs: 7000 })
  } finally {
    isReindexing.value = false
  }
}
</script>

<style scoped>
.admin {
  flex: 1;
  overflow: auto;
  background: var(--bg);
}
.admin__wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.admin__header {
  padding: 6px 2px;
}
.admin__title {
  font-size: 26px;
  font-weight: 800;
}
.admin__subtitle {
  margin-top: 4px;
  color: var(--muted);
}
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
}
.card__title {
  font-weight: 800;
  font-size: 16px;
}
.card__subtitle {
  margin-top: 2px;
  font-size: 13px;
  color: var(--muted);
}
.card__text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.4;
}
.result {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(22, 163, 74, 0.35);
  background: rgba(22, 163, 74, 0.06);
}
.btn {
  margin-top: 12px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--fg);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
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
.card--muted {
  opacity: 0.7;
}
.muted {
  color: var(--muted);
  font-style: italic;
}
</style>

