<template>
  <div class="image-preview-wrapper">
    <div class="thumbnail-container" @click="openPreview">
      <img
        :src="src"
        :alt="alt"
        class="preview-image"
      />
      <div class="hover-overlay">
        <span class="zoom-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </span>
      </div>
    </div>
    
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="modern-preview-overlay" @click="closePreview">
          <div class="preview-backdrop"></div>
          
          <button class="close-btn" @click.stop="closePreview">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div class="preview-content" @click="closePreview">
            <img
              :src="src"
              :alt="alt"
              class="modal-image"
              @click.stop
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  alt?: string
}

const props = defineProps<Props>()

const isOpen = ref(false)

const openPreview = () => {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closePreview = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closePreview()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.image-preview-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  display: block;
}

.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.thumbnail-container:hover .hover-overlay {
  opacity: 1;
}

.thumbnail-container:hover .preview-image {
  transform: scale(1.02);
}

.zoom-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(10px);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.thumbnail-container:hover .zoom-icon {
  transform: translateY(0);
}

/* Modern Overlay Styles */
.modern-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.preview-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.preview-content {
  position: relative;
  z-index: 10001;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Ensure image fits within viewport with padding */
  width: 90vw;
  height: 90vh;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  /* Ensure image is not stretched */
  margin: auto;
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10002;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-image {
  animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-leave-active .modal-image {
  animation: zoom-out 0.2s ease;
}

@keyframes zoom-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes zoom-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.9); opacity: 0; }
}

@media (max-width: 768px) {
  .modern-preview-overlay {
    padding: 20px;
  }
  
  .close-btn {
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
  }

  .preview-content {
    width: 100%;
    height: 100%;
  }
}
</style>
