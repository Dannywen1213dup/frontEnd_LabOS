import { Directive, DirectiveBinding } from 'vue'

/**
 * v-reveal directive
 * 使用 IntersectionObserver 实现滚动时的渐显动画
 * 用法: <div v-reveal>content</div>
 */
export const vReveal: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options = {
      threshold: binding.value?.threshold || 0.12,
      rootMargin: binding.value?.rootMargin || '0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on')
          observer.unobserve(entry.target)
        }
      })
    }, options)

    // 初始状态
    el.classList.add('reveal')
    observer.observe(el)

    // 保存 observer 实例以便清理
    ;(el as any).__revealObserver__ = observer
  },

  unmounted(el: HTMLElement) {
    const observer = (el as any).__revealObserver__
    if (observer) {
      observer.disconnect()
      delete (el as any).__revealObserver__
    }
  }
}

