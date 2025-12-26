<template>
  <nav class="sidebar-nav">
    <div class="nav-list">
      <div 
        v-for="item in navItems" 
        :key="item.id"
        class="nav-item"
        :class="{ active: activeId === item.id }"
        @click="scrollToId(item.id)"
      >
        <div class="nav-indicator"></div>
        <span class="nav-label">{{ item.label }}</span>
      </div>
      <Transition name="fade-slide">
      <a
          v-show="showPaperLink"
          class="nav-item paper-link"
          :class="{ active: activeId === 'paper' }"
          href="https://arxiv.org/abs/2510.14861"
          target="_blank"
          rel="noopener"
        >
        <div class="nav-indicator"></div>
        <span class="nav-label">Paper ↗</span>
      </a>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSmoothScroll } from '@/composables/useSmoothScroll'

const { scrollToId } = useSmoothScroll()
const activeId = ref('')
const showPaperLink = ref(false)

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'about', label: 'About' },
  { id: 'use', label: 'Use LabOS' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'media', label: 'Media' },
  { id: 'team', label: 'Team' }
]

let observer: IntersectionObserver | null = null
let footerObserver: IntersectionObserver | null = null

  onMounted(() => {
    // Main scroll handler for active section detection
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const viewportMiddle = scrollY + viewportHeight / 2
      
      // Handle top "Overview" vs "About" logic
      if (scrollY <= 10) {
        activeId.value = 'overview'
        return
      }
      
      // Check footer first for Paper link
      const footerEl = document.getElementById('footer')
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect()
        const footerVisible = footerRect.top < viewportHeight && footerRect.bottom > 0
        const footerVisibleRatio = footerVisible 
          ? Math.min((viewportHeight - footerRect.top) / viewportHeight, 1) 
          : 0
        
        showPaperLink.value = footerVisibleRatio >= 0.1
        
        // Switch to Paper when footer occupies 20% or more
        if (footerVisibleRatio >= 0.2) {
          activeId.value = 'paper'
          return
        }
      }
      
      // Find which section's content is near the middle of viewport
      let closestSection = 'about'
      let closestDistance = Infinity
      
      navItems.forEach((item) => {
        const el = document.getElementById(item.id)
        if (!el) return
        
        const rect = el.getBoundingClientRect()
        const elementTop = scrollY + rect.top
        const elementBottom = scrollY + rect.bottom
        
        // Check if viewport middle is within this section
        if (viewportMiddle >= elementTop && viewportMiddle <= elementBottom) {
          closestSection = item.id
          closestDistance = 0
          return
        }
        
        // Calculate distance from viewport middle to section
        const distanceToTop = Math.abs(viewportMiddle - elementTop)
        const distanceToBottom = Math.abs(viewportMiddle - elementBottom)
        const distance = Math.min(distanceToTop, distanceToBottom)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestSection = item.id
        }
      })
      
      activeId.value = closestSection
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    // Initial check
    setTimeout(handleScroll, 100)

    // Store cleanup for unmount
    ;(window as any)._labosScrollHandler = handleScroll
  })

  onUnmounted(() => {
    const handler = (window as any)._labosScrollHandler
    if (handler) {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  })
</script>

<style scoped>
.sidebar-nav {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
  display: flex;
  flex-direction: column;
  padding: 11.5px;
  /* Optional: Background for better visibility if needed, or transparent */
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 11.5px;
  position: relative;
}

/* Removed the vertical line as requested */
.nav-list::before {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  group: 1;
}

.nav-indicator {
  width: 11.5px;
  height: 4.6px; /* Increased by 15% */
  border-radius: 4.6px; /* Fully rounded */
  background-color: #cbd5e1; /* Grey 300 - visible on dark */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Subtle shadow for white backgrounds */
  margin-right: 11.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  z-index: 1;
}

.nav-label {
  font-size: 13.8px;
  color: #4b5563;
  font-weight: 600;
  opacity: 0;
  transform: translateX(-10px);
  transform-origin: left;
  transition: all 0.3s ease;
  white-space: nowrap;
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); /* Ensure text is readable */
}

/* Hover States */
.nav-item:hover .nav-indicator {
  background-color: #818cf8; /* Light Indigo */
  width: 16.1px;
}

.nav-item:hover .nav-label {
  opacity: 1;
  transform: translateX(0);
  color: #4f46e5;
  pointer-events: auto;
}

/* Active States */
.nav-item.active .nav-indicator {
  width: 23px; /* Increased by 15% */
  background-color: #4f46e5; /* Brand Purple */
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3); /* Glow effect */
}

.nav-item.active .nav-label {
  opacity: 1;
  transform: translateX(0);
  color: #4f46e5; /* Match indicator */
  font-weight: 700;
  pointer-events: auto;
}

/* Paper Link Special Styling */
.paper-link .nav-indicator {
  /* Keep same pill style for consistency, or modify if needed */
  border-radius: 4px; 
}

@media (max-width: 1280px) {
  /* Move closer to edge on smaller screens */
  .sidebar-nav {
    left: 10px;
  }
}

@media (max-width: 1024px) {
  /* Hide on tablet/mobile */
  .sidebar-nav {
    display: none;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

