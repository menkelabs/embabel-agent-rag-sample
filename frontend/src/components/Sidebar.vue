<template>
  <aside class="sidebar">
    <div class="sidebar__title">Chat History</div>
    <div class="sidebar__hint">Conversation history coming soon…</div>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  height: 100%;
  border-right: 1px solid var(--border);
  background: var(--panel);
  padding: 16px;
  overflow: auto;
}
.sidebar__title {
  font-weight: 700;
  margin-bottom: 10px;
}
.sidebar__hint {
  font-size: 13px;
  color: var(--muted);
  font-style: italic;
}
</style>

