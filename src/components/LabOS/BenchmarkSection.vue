<template>
  <section id="benchmark" class="section-container">
    <div v-reveal class="section-content">
      <h2 class="section-title">LabSuperVision (LSV) Benchmark</h2>
      <p class="section-lead clickable-text" @click="scrollToLeaderboard">
        We are launching LSV in close collaboration with NVIDIA for lab-driven science. We are calling on academic groups to contribute to this exciting ecosystem, where we already have 200+ expert-annotated lab videos with gold-standard protocols for protocol alignment and issue detection.
      </p>
      <p class="section-subtext">
        To submit your model to the leaderboard please provide your code and paper below.
      </p>

      <a-row :gutter="[28, 28]">
        <a-col :xs="24" :sm="24" :md="12" :lg="12">
          <a-card class="content-card">
            <h3 class="card-title">Evaluate Your Model</h3>
            <p class="card-text">
              We evaluate leading VLMs/agents (e.g., GPT-4o, Gemini 2.5, Cosmos) and
              support community submissions.
            </p>
            <button type="button" class="btn btn-primary" @click="goToSubmit">
              Submit Model / Data
            </button>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12" :lg="12">
          <a-card class="content-card">
            <ImagePreview
              :src="fig2Src"
              alt="LSV Benchmark illustration"
            />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script setup lang="ts">
import { vReveal } from '@/directives/reveal'
import ImagePreview from './ImagePreview.vue'
import fig2Src from '@/assets/picture/New Fig2 LSV benchmark_page.jpg'
import { useSmoothScroll } from '@/composables/useSmoothScroll'
import { useRouter } from 'vue-router'

const router = useRouter()
const { scrollToId } = useSmoothScroll()
const goToSubmit = () => router.push('/submit')
const scrollToLeaderboard = () => scrollToId('leaderboard')
</script>

<style scoped>
.section-container {
  padding: 72px 0;
  background: #ffffff;
}

.section-content {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 34px;
  margin: 0 0 18px;
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.section-lead {
  font-size: 18px;
  color: #6b7280;
  margin-top: -6px;
  margin-bottom: 8px;
  line-height: 1.6;
}

.clickable-text {
  cursor: pointer;
  transition: color 0.2s ease;
}

.clickable-text:hover {
  color: #4f46e5;
}

.section-subtext {
  font-size: 14px;
  color: #6b7280;
  margin-top: 0;
  margin-bottom: 24px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }
  
  .section-lead {
    font-size: 16px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .card-text {
    font-size: 14px;
  }
}

/* Custom tooltip style - black border with black text, white background */
:deep(.ant-tooltip-inner) {
  background-color: #ffffff !important;
  color: #000000 !important;
  border: 1px solid #000000 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

:deep(.ant-tooltip-arrow) {
  border-color: #000000 !important;
}

:deep(.ant-tooltip-arrow::before) {
  background-color: #ffffff !important;
  border: 1px solid #000000 !important;
}

.content-card {
  background: #ffffff;
  border: 1px solid #eef2ff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.card-text {
  color: #6b7280;
  margin: 0 0 18px;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.12);
  color: #fff;
}

.content-card :deep(.ant-image) {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.content-card :deep(.ant-image img) {
  width: 100%;
  border-radius: 8px;
}

/* 滚动动画 */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.on {
  opacity: 1;
  transform: none;
}

:deep(.media-preview-root .ant-image-preview-img) {
  max-width: none;
  max-height: none;
  cursor: grab;
}

:deep(.media-preview-root .ant-image-preview-img.moving) {
  cursor: grabbing;
}
</style>

