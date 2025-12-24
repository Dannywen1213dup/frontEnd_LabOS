<template>
  <section id="about" class="section-container">
    <div v-reveal class="section-content">
      <h2 class="section-title">About LabOS</h2>
      <p class="section-lead">
        A self-evolving, multi-agent system paired with XR smart-glasses and a lab-specialized VLM to co-pilot experiments with human scientists and robotics.
      </p>

      <a-row :gutter="[28, 28]" align="stretch" class="about-grid">
        <!-- 左侧：See-Reason-Act 文字内容 -->
        <a-col :xs="24" :lg="12" class="text-column">
          <a-card class="content-card">
            <div class="feature-block">
              <h3 class="feature-title">See</h3>
              <p class="feature-text">
                AR/XR smart‑glasses with real‑time multimodal sensing capture egocentric lab workflows.
                A lab‑specialized VLM, post‑trained on public and in‑house experimental videos and the
                LSV corpus, aligns live actions to reference protocols, detects deviations, verifies
                outcomes, and supports 3D/4D spatial "digital twins" for grounded scene understanding.
              </p>
            </div>
            
            <div class="feature-block">
              <h3 class="feature-title">Reason</h3>
              <p class="feature-text">
                A self‑evolving multi‑agent core—Manager/Planner, Developer (coding & execution),
                Critic (evaluation & refinement)—with a Tool‑Creation module that auto‑expands a
                shared Tool Ocean for new analyses. Demonstrates state‑of‑the‑art performance on
                HLE: Biomedicine and LAB‑Bench (DBQA/LitQA).
              </p>
            </div>
            
            <div class="feature-block">
              <h3 class="feature-title">Act</h3>
              <p class="feature-text feature-text-last">
                Streams protocol steps to XR for hands‑free, step‑by‑step guidance with
                error‑detection/correction cues and voice/gesture interaction. Records materials
                and steps for automated documentation, closing the loop from design to wet‑lab validation.




              </p>

            </div>
          </a-card>
        </a-col>

        <!-- 右侧：媒体列 -->
        <a-col :xs="24" :lg="12" class="media-column">
          <div class="media-top">
            <div class="media-item">
              <VideoPlayer
                class="media-video"
                :src="videoSrc1"
                :poster="posterIntro"
              />
              <p class="media-caption">LabOS System Intro</p>
            </div>
            <div class="media-item">
              <VideoPlayer
                class="media-video"
                :src="videoSrc2"
                :poster="posterLabDemo"
                :cover-scale="1.4"
              />
              <p class="media-caption">LabOS: The Future of Agentic Lab Automation </p>
            </div>
          </div>
          <div class="media-bottom">
            <ImagePreview
              class="media-image"
              :src="introFigure"
              alt="Intro Figure"
            />
            <p class="media-caption"> LabOS overview</p>
          </div>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script setup lang="ts">
import { vReveal } from '@/directives/reveal'
import VideoPlayer from './VideoPlayer.vue'
import ImagePreview from './ImagePreview.vue'
import posterIntro from '@/assets/picture/Intro_labOS_first_frame.png'
import posterLabDemo from '@/assets/picture/Media_No3_Lab_Demo_Cover.png'
import introFigure from '@/assets/picture/intro_labOS_f1.png'

// 视频文件放在 public 目录，直接使用路径引用
const videoSrc1 = '/videos/Media_No1_LabOS_System_Intro.mov'
const videoSrc2 = '/videos/Media_No3_LabOS_Demo_Video.mp4'

</script>

<style scoped>
.section-container {
  padding: 72px 0;
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

.section-lead { font-size: 18px; color: #6b7280; margin-top: -6px; margin-bottom: 24px; line-height: 1.6; }

.content-card { background: #ffffff; border: 1px solid #eef2ff; border-radius: 12px; box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08); height: 100%; }

.text-column { height: 100%; display: flex; }
.text-column :deep(.ant-card) { width: 100%; }

.feature-block { margin-bottom: 24px; }
.feature-block:last-child { margin-bottom: 0; }
.feature-title { margin: 8px 0 6px; font-size: 20px; font-weight: 700; color: #1f2937; }
.feature-text { color: #6b7280; margin: 0; line-height: 1.6; }
.feature-text-last { margin-bottom: 0; padding-bottom: 55px; }

.media-column { display: flex; flex-direction: column; gap: 14px; height: 100%; }
.media-top { display: flex; gap: 14px; flex: 1 1 60%; }
.media-item { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.media-video { flex: 1; min-height: 0; }
.media-bottom { flex: 0 0 40%; display: flex; flex-direction: column; gap: 8px; }

@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }
  
  .section-lead {
    font-size: 16px;
  }
  
  .feature-title {
    font-size: 18px;
  }
  
  .feature-text {
    font-size: 14px;
  }
  
  .media-top {
    flex-direction: column;
    flex: 1 1 auto;
  }
  
  .media-item {
    width: 100%;
  }
  
  .media-bottom {
    flex: 0 0 auto;
  }
  
  .media-caption {
    font-size: 12px;
  }
}
.media-caption { margin: 0; font-size: 13px; color: #6b7280; text-align: center; }
.media-image {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.12);
  border: 1px solid #e5e7eb;
}
.media-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* 滚动动画 */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
.reveal.on { opacity: 1; transform: none; }

:deep(.media-preview-root .ant-image-preview-img) {
  max-width: none;
  max-height: none;
  cursor: grab;
}

:deep(.media-preview-root .ant-image-preview-img.moving) {
  cursor: grabbing;
}
</style>

