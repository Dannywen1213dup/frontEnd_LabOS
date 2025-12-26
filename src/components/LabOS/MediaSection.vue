<template>
  <section id="media" class="section-container">
    <div v-reveal class="section-content">
      <h2 class="section-title">Media</h2>
      <p class="section-lead">
        Key figures and short demo clips from the paper to make LabOS more intuitive at a glance.
      </p>

      <!-- 图片网格 -->
      <a-row :gutter="[18, 18]" style="margin-bottom: 22px">
        <a-col :xs="24" :sm="12" :md="12">
          <a-card class="media-card">
            <div class="image-wrap">
              <ImagePreview
                :src="fig1Src"
                alt="Figure 1: LabOS overview with agentic dry-lab and XR wet-lab modules"
              />
            </div>
            <div class="caption">
              Fig. 1 — LabOS overview: multi‑agent dry‑lab (planning, development, critic,
              tool‑creation) and XR‑mediated wet‑lab collaboration.
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="12">
          <a-card class="media-card">
            <div class="image-wrap">
              <ImagePreview
                :src="fig2Src"
                alt="Figure 2: LSV benchmark and LabOS‑VLM results"
              />
            </div>
            <div class="caption">
              Fig. 2 — LabSuperVision (LSV) benchmark & LabOS‑VLM family performance on
              protocol alignment and error detection.
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="12">
          <a-card class="media-card">
            <div class="image-wrap">
              <ImagePreview
                :src="fig3Src"
                alt="Figure 3: XR streaming and 3D/4D reconstruction for live guidance"
              />
            </div>
            <div class="caption">
              Fig. 3 — XR streaming, live guidance, deviation prompts, and 3D/4D reconstruction
              (Gaussian splatting) for spatial grounding.
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="12">
          <a-card class="media-card">
            <div class="image-wrap">
              <ImagePreview
                :src="fig4Src"
                alt="Figure 4: Applications across NK target discovery, cell fusion mechanism, and stem cell engineering"
              />
            </div>
            <div class="caption">
              Fig. 4 — Applications: NK immunotherapy target discovery (CEACAM6),
              cell‑fusion regulator (ITSN1), and iPSC experiments copiloted by LabOS.
            </div>
          </a-card>
        </a-col>
      </a-row>

      <p class="note-text">
        These figures showcase the key components and applications of the LabOS system,
        from architecture to real-world biomedical experiments.
      </p>

      <!-- 视频部分 -->
      <a-row :gutter="[18, 18]" style="margin-bottom: 22px">
        <a-col :xs="24" :sm="24" :md="24">
          <a-card class="media-card video-card">
            <div class="video-wrap">
              <VideoPlayer
                class="media-video"
                :src="videoSrc"
                :poster="videoPoster"
                :cover-scale="1.7"
              />
            </div>
            <div class="caption">
              NVIDIA GTC 2025Oct JensenHuang Keynote
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { vReveal } from '@/directives/reveal'
import VideoPlayer from './VideoPlayer.vue'
import ImagePreview from './ImagePreview.vue'
import fig1Src from '@/assets/picture/New Fig1 overview v10152025_page.jpg'
import fig2Src from '@/assets/picture/New Fig2 LSV benchmark_page.jpg'
import fig3Src from '@/assets/picture/New Fig3 XR-AI_page.jpg'
import fig4Src from '@/assets/picture/New Fig4 demo v10152025_page.jpg'
import videoPoster from '@/assets/picture/JasonHuang_first_frame.png'

// 视频文件放在 public 目录，直接使用路径引用
const videoSrc = '/videos/Media_No2_NVIDIA_GTC_2025Oct_JensenHuang_Keynote.mov'

const router = useRouter()

onMounted(() => {
  if (router.currentRoute.value.hash === '#media') {
    document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>

<style scoped>
.section-container {
  padding: 48px 0;
  background: #f7f9ff;
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
  margin-bottom: 24px;
  line-height: 1.6;
}

.media-card {
  background: #ffffff;
  border: 1px solid #eef2ff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
  height: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

.media-card :deep(.ant-card-body) {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}


.image-wrap {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-wrap {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  /* 使用标准 16:9 比例，完整显示视频 */
  aspect-ratio: 16 / 9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-wrap:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.video-card {
  min-height: auto;
}

.media-video {
  width: 100%;
  height: 100%;
}

.caption {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center; /* 居中对齐 */
  text-align: center; /* 文本居中 */
}

.note-text {
  font-size: 14px;
  margin-top: 14px;
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .section-lead {
    font-size: 16px;
  }
  
  .caption {
    font-size: 13px;
  }
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

</style>

