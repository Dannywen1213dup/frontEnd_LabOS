<template>
  <section class="hero">
    <video
      class="hero-video"
      autoplay
      muted
      loop
      playsinline
      :src="videoSrc"
      :poster="heroPoster"
    ></video>
    <div class="hero-inner">
      <h1 class="hero-title">LabOS: The AI-XR Co-Scientist</h1>
      <p class="hero-description">
        Agentic AI that sees, reasons, and works with humans in real laboratories — 
        linking dry-lab planning to wet-lab execution.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary" type="button" @click="scrollToId('use')">Use LabOS Now</button>
        <button class="btn btn-secondary" type="button" @click="scrollToId('benchmark')">Explore LSV Benchmark</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSmoothScroll } from '@/composables/useSmoothScroll'

const { scrollToId } = useSmoothScroll()
// Video background asset
// Using import ensures proper bundling
// File: src/assets/video/XR-Robotics_Background.mp4
import videoUrl from '@/assets/video/XR-Robotics_Background.mp4'
import heroPosterImg from '@/assets/picture/Hero_section_first_frame.png'
const videoSrc = videoUrl
const heroPoster = heroPosterImg
</script>

<style scoped>
.hero {
  position: relative;
  background: transparent;
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1; /* 100% opacity - full video */
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.25), rgba(2, 6, 23, 0.35));
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding: 125px 20px 94px;
  max-width: 1160px;
  margin: 0 auto;
}

.hero-title {
  margin: 0 0 10px;
  font-size: 44px;
  line-height: 1.1;
  font-weight: 800;
  color: #5b21b6; /* Deep purple color */
}

.hero-description {
  margin: 0 auto 22px;
  max-width: 720px;
  font-size: 18px;
  color: #ffffff; /* White color */
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  text-decoration: none;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 700;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  color: #fff;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(16, 24, 40, 0.12);
}

.btn-secondary {
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .hero-inner {
    padding: 83px 20px 62px;
  }
}
</style>

