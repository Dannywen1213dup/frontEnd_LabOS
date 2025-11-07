import { createApp } from 'vue'
import router from './router'
import Antd from 'ant-design-vue'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import 'ant-design-vue/dist/reset.css'

if (typeof window !== 'undefined') {
  const stopIfResizeObserver = (msg: any): boolean => {
    const text = typeof msg === 'string' ? msg : (msg?.message || msg?.toString?.() || '')
    return text.includes('ResizeObserver loop') || text.includes('ResizeObserver loop limit exceeded')
  }

  const errorHandler = (e: ErrorEvent) => {
    if (stopIfResizeObserver(e)) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  }

  const rejectionHandler = (e: PromiseRejectionEvent) => {
    if (stopIfResizeObserver(e.reason)) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  }

  window.addEventListener('error', errorHandler, true)
  window.addEventListener('unhandledrejection', rejectionHandler, true)

  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    if (args.some(arg => stopIfResizeObserver(arg))) {
      return
    }
    originalConsoleError(...args)
  }
}

const app = createApp(App)

app.directive('reveal', vReveal)

app
  .use(Antd)
  .use(router)
  .mount('#app')
