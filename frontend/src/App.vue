<template>
  <div class="app">
    <div v-if="!auth.isAuthenticated.value" class="app__full">
      <Login />
    </div>

    <template v-else>
      <Navbar :current-screen="currentScreen" @change-screen="currentScreen = $event" />

      <div v-if="currentScreen === 'chat'" class="layout">
        <Sidebar class="layout__sidebar" />
        <Chat class="layout__chat" @conversation-id="conversationId = $event" />
        <EventStream class="layout__events" :conversation-id="conversationId" />
      </div>

      <div v-else class="app__content">
        <AdminScreen />
      </div>
    </template>

    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { provideAuth } from '@/composables/useAuth'
import { provideToasts } from '@/composables/useToasts'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Chat from '@/components/Chat.vue'
import EventStream from '@/components/EventStream.vue'
import AdminScreen from '@/components/AdminScreen.vue'
import Login from '@/components/Login.vue'
import Toaster from '@/components/Toaster.vue'

provideToasts()
const auth = provideAuth()

type Screen = 'chat' | 'admin'

const currentScreen = ref<Screen>('chat')
const conversationId = ref<string | null>(null)
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app__full {
  flex: 1;
  display: flex;
  min-height: 100vh;
}
.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr 350px;
  min-height: 0;
}
.layout__sidebar,
.layout__chat,
.layout__events {
  min-height: 0;
}
.app__content {
  flex: 1;
  min-height: 0;
}
</style>

