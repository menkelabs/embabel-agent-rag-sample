import { inject, provide, ref } from 'vue'
import type { Ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  createdAt: number
  durationMs: number
}

export interface ToastCreateInput {
  title: string
  description?: string
  type?: ToastType
  durationMs?: number
}

export interface ToastContext {
  toasts: Ref<Toast[]>
  create: (t: ToastCreateInput) => void
  remove: (id: string) => void
}

const ToastKey = Symbol('Toasts')

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function provideToasts(): ToastContext {
  const toasts = ref<Toast[]>([])

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function create(input: ToastCreateInput) {
    const toast: Toast = {
      id: uid(),
      title: input.title,
      description: input.description,
      type: input.type ?? 'info',
      createdAt: Date.now(),
      durationMs: input.durationMs ?? 3500,
    }

    toasts.value = [...toasts.value, toast]
    window.setTimeout(() => remove(toast.id), toast.durationMs)
  }

  const ctx: ToastContext = { toasts, create, remove }
  provide(ToastKey, ctx)
  return ctx
}

export function useToasts(): ToastContext {
  const ctx = inject<ToastContext>(ToastKey)
  if (!ctx) {
    throw new Error('useToasts must be used within provideToasts()')
  }
  return ctx
}

