import { computed, inject, provide, reactive } from 'vue'
import type { ComputedRef } from 'vue'
import { setAuthCredentials } from '@/api'

export interface AuthContext {
  username: ComputedRef<string | null>
  credentials: ComputedRef<string | null>
  isAuthenticated: ComputedRef<boolean>
  login: (username: string, password: string) => void
  logout: () => void
}

const AuthKey = Symbol('Auth')

export function provideAuth(): AuthContext {
  const state = reactive({
    username: null as string | null,
    credentials: null as string | null,
  })

  function login(username: string, password: string) {
    const encoded = btoa(`${username}:${password}`)
    state.username = username
    state.credentials = encoded
    setAuthCredentials(encoded)
  }

  function logout() {
    state.username = null
    state.credentials = null
    setAuthCredentials(null)
  }

  const ctx: AuthContext = {
    username: computed(() => state.username),
    credentials: computed(() => state.credentials),
    isAuthenticated: computed(() => !!state.username),
    login,
    logout,
  }

  provide(AuthKey, ctx)
  return ctx
}

export function useAuth(): AuthContext {
  const ctx = inject<AuthContext>(AuthKey)
  if (!ctx) {
    throw new Error('useAuth must be used within provideAuth()')
  }
  return ctx
}

