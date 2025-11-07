import { ref, Ref } from 'vue'

export interface VideoState {
  isPlaying: Ref<boolean>
  togglePlay: (videoEl: HTMLVideoElement | null) => void
  handleVideoPlay: () => void
  handleVideoPause: () => void
}

export function useVideo(): VideoState {
  const isPlaying = ref(false)

  const togglePlay = (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return
    if (videoEl.paused) {
      videoEl.play()
    } else {
      videoEl.pause()
    }
  }

  const handleVideoPlay = () => { isPlaying.value = true }
  const handleVideoPause = () => { isPlaying.value = false }

  return { isPlaying, togglePlay, handleVideoPlay, handleVideoPause }
}


