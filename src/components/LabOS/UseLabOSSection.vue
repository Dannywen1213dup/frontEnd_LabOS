<template>
  <section id="use" class="section-container">
    <div v-reveal class="section-content">
      <h2 class="section-title">Use LabOS Now</h2>
      <p class="section-lead">
        Jump in: read the paper, browse code (when available), or sign up your lab to pilot LabOS.
      </p>

      <a-row :gutter="[18, 18]">
        <a-col :xs="24" :sm="24" :md="8" :lg="8">
          <a-card class="use-card">
            <h3 class="card-title">📄 LabOS Paper</h3>
            <p class="card-text">
              Full description of the agentic AI-XR platform, the LabSuperVision benchmark, 
              and biomedical studies.
            </p>
            <a 
              class="btn btn-primary" 
              href="https://arxiv.org/abs/2510.14861" 
              target="_blank" 
              rel="noopener"
            >
              Read on arXiv
            </a>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="24" :md="8" :lg="8">
          <a-card class="use-card">
            <h3 class="card-title">💾 LabOS Code and Hardware Kit</h3>
            <p class="card-text">
              Open-source software and hardware components. (Placeholder link — coming soon!)
            </p>
            <a 
              class="btn btn-primary" 
              href="https://forms.gle/i7cujsW9mBCpZq5m6" 
              target="_blank" 
              rel="noopener"
            >
              GitHub Repository
            </a>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="24" :md="8" :lg="8">
          <a-card class="use-card">
            <h3 class="card-title">🧪 Sign Up to Test</h3>
            <p class="card-text">
              Partner with us to deploy LabOS in your lab. Early access for research collaborators.
            </p>
            <a class="btn btn-primary" href="https://forms.gle/i7cujsW9mBCpZq5m6" target="_blank" rel="noopener">
              Go to Sign-up
            </a>
          </a-card>
        </a-col>
      </a-row>

      <!-- 嵌入的 Google 表单 -->
      <a-card id="signup-form" class="signup-card">
        <h3 class="signup-title">Sign-up Form</h3>
        <p class="signup-lead">
          Tell us about your lab and use-case. We'll follow up with access details.
        </p>
        <iframe 
          class="google-form" 
          loading="lazy" 
          src="https://forms.gle/i7cujsW9mBCpZq5m6" 
          title="LabOS Sign-up"
        >
          Loading…
        </iframe>
        <div class="form-help">
          Having trouble? 
          <a 
            href="https://forms.gle/i7cujsW9mBCpZq5m6" 
            target="_blank" 
            rel="noopener"
          >
            Open the form in a new tab ↗
          </a>
        </div>
      </a-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { vReveal } from '@/directives/reveal'
import { useSmoothScroll } from '@/composables/useSmoothScroll'

const { scrollToId } = useSmoothScroll()
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
  margin-bottom: 24px;
  line-height: 1.6;
}

.use-card {
  background: #ffffff;
  border: 1px solid #eef2ff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.use-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  margin: 8px 0 6px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.card-text {
  color: #6b7280;
  margin: 0 0 14px;
  line-height: 1.6;
  flex: 1;
}

.btn {
  display: inline-block;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  border: none;
  cursor: pointer;
  margin-top: auto; /* push to bottom so all buttons align */
  align-self: flex-start;
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

.signup-card {
  margin-top: 22px;
  background: #ffffff;
  border: 1px solid #eef2ff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
}

.signup-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.signup-lead {
  margin: 0 0 14px;
  color: #6b7280;
  line-height: 1.6;
}

.google-form {
  width: 100%;
  min-height: 576px;
  border: 0;
  border-radius: 10px;
  background: #fff;
}

.form-help {
  margin-top: 10px;
  font-size: 14px;
  color: #6b7280;
}

.form-help a {
  font-weight: 600;
  color: #4f46e5;
  text-decoration: none;
}

.form-help a:hover {
  color: #4338ca;
  text-decoration: underline;
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

@media (max-width: 900px) {
  .google-form {
    min-height: 768px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }
  
  .section-lead {
    font-size: 16px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-text {
    font-size: 14px;
  }
  
  .btn {
    font-size: 14px;
    padding: 8px 14px;
  }
  
  .signup-title {
    font-size: 18px;
  }
  
  .signup-lead {
    font-size: 14px;
  }
}
</style>

