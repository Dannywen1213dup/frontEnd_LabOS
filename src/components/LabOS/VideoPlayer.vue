<template>
  <div class="video-wrapper">
    <div 
      class="video-container"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <video
        ref="videoRef"
        class="video-element"
        :src="src"
        :poster="poster"
        preload="metadata"
        playsinline
        muted
        loop
        :style="videoStyle"
        @canplay="handleAutoPlayOnce"
        @play="handleVideoPlay"
        @pause="handleVideoPause"
      >
        Your browser does not support the video tag.
      </video>
      
      <div v-show="hover" class="video-overlay">
        <button type="button" class="overlay-expand" @click.stop="openModal">
          <FullscreenOutlined class="expand-icon" />
        </button>
      </div>
    </div>

    <a-modal
      v-model:open="isModalOpen"
      :footer="null"
      centered
      :width="'90%'"
      :style="{ maxWidth: '1400px' }"
      wrap-class-name="video-modal"
      @afterClose="handleModalClose"
      @cancel="handleModalCancel"
    >
      <video
        ref="modalVideoRef"
        class="modal-video"
        :src="src"
        playsinline
        controls
        autoplay
      >
        Your browser does not support the video tag.
      </video>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, onMounted, onUnmounted } from 'vue'
import { FullscreenOutlined } from '@ant-design/icons-vue'
import { useVideo } from '@/composables/useVideo'

const noop = () => undefined

interface Props {
  src: string
  poster?: string
  coverScale?: number
}

const props = defineProps<Props>()

const videoRef = ref<HTMLVideoElement | null>(null)
const modalVideoRef = ref<HTMLVideoElement | null>(null)
const { isPlaying, togglePlay, handleVideoPlay, handleVideoPause } = useVideo()

const hasAutoPlayed = ref(false)
const hover = ref(false)
const isModalOpen = ref(false)

let activeAudio: HTMLVideoElement | null = null
let wasPlayingBeforeHidden = false

const ensureExclusiveAudio = (video: HTMLVideoElement | null) => {
  if (activeAudio && activeAudio !== video) {
    activeAudio.pause()
    activeAudio.currentTime = 0
  }
  activeAudio = video
}

const clearActiveAudio = (video: HTMLVideoElement | null) => {
  if (activeAudio === video) {
    activeAudio = null
  }
}

const videoStyle = computed(() => {
  if (props.coverScale && props.coverScale !== 1) {
    return {
      transform: `scale(${props.coverScale})`,
      transformOrigin: 'center center'
    }
  }
  return {}
})

const handleAutoPlayOnce = () => {
  if (hasAutoPlayed.value || !videoRef.value) return
  videoRef.value.muted = true
  const p = videoRef.value.play()
  if (p && typeof p.then === 'function') {
    p.then(() => { hasAutoPlayed.value = true }).catch(noop)
  }
}

// Looping is handled via the `loop` attribute; no manual ended handling is required.

const openModal = () => {
  hover.value = false
  if (videoRef.value) {
    videoRef.value.pause()
  }
  isModalOpen.value = true
  nextTick(() => {
    if (modalVideoRef.value) {
      modalVideoRef.value.muted = false
      modalVideoRef.value.currentTime = 0
      modalVideoRef.value.play().then(() => {
        ensureExclusiveAudio(modalVideoRef.value)
      }).catch(noop)
    }
  })
}

const stopModalAudio = () => {
  if (modalVideoRef.value) {
    modalVideoRef.value.pause()
    modalVideoRef.value.currentTime = 0
    modalVideoRef.value.muted = true
    clearActiveAudio(modalVideoRef.value)
  }
}

const resumeInlineMuted = () => {
  if (videoRef.value) {
    videoRef.value.muted = true
    videoRef.value.play().catch(noop)
  }
}

const handleModalCancel = () => {
  stopModalAudio()
}

const handleModalClose = () => {
  stopModalAudio()
  resumeInlineMuted()
}

watch(isModalOpen, (open) => {
  if (!open) {
    stopModalAudio()
    resumeInlineMuted()
  }
})

// Handle page visibility changes to keep videos playing on mobile
const handleVisibilityChange = () => {
  if (!videoRef.value) return
  
  if (document.hidden) {
    // Page is hidden - save playing state
    wasPlayingBeforeHidden = !videoRef.value.paused
  } else {
    // Page is visible again - resume if it was playing
    if (wasPlayingBeforeHidden && videoRef.value.paused) {
      videoRef.value.play().catch(noop)
    }
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.video-wrapper { width: 100%; }
.video-container { position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08); border: 1px solid #e5e7eb; }
.video-element { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center center; transition: transform 0.4s ease-out; }
.video-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: none; pointer-events: none; }
.overlay-expand { position: absolute; top: 12px; right: 12px; width: 40px; height: 40px; border-radius: 999px; background: rgba(15, 23, 42, 0.6); border: none; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; transition: background 0.2s ease; pointer-events: auto; }
.overlay-expand:hover { background: rgba(15, 23, 42, 0.8); }
.expand-icon { font-size: 20px; }
/* removed play/pause overlay icon */

:deep(.video-modal .ant-modal-body) {
  padding: 0;
  background: transparent; /* 透明背景，只显示视频 */
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.video-modal .ant-modal-content) {
  background: transparent;
  box-shadow: none;
}

.modal-video {
  width: 100%;
  height: auto;
  max-height: 85vh; /* 限制最大高度，防止超出屏幕 */
  display: block;
  background: #000;
  border-radius: 8px; /* 给视频加点圆角 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  object-fit: contain; /* 保持比例，完全显示 */
  margin: 0 auto;
}
</style>

