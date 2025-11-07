<template>
  <section id="team" class="section-container">
    <div v-reveal class="section-content">
      <h2 class="section-title">Team & Founding Partners</h2>

      <a-row :gutter="[28, 28]">
        <!-- 核心作者 -->
        <a-col :xs="24" :md="12">
          <a-card class="content-card">
            <h3 class="card-title">Core Authors</h3>
            <p class="author-lead">
              <strong>Le Cong</strong> (Stanford) &nbsp;•&nbsp; <strong>Mengdi Wang</strong> (Princeton)
            </p>
            <p class="author-text">
              Co-first/core contributors include: Zaixi Zhang, Xiaotong Wang, Yin Di, Ruofan Jin, 
              Michal Gerasimiuk, Yinkai Wang, Ravi K. Dinesh, David Smerkous, Alex Smerkous, 
              Xuekun Wu, Shilong Liu, Peishan Li, Yi Zhu, Simran Serrao, Ning Zhao, 
              Imran A. Mohammad, John B. Sunwoo, Joseph C. Wu.
            </p>
            <a-collapse ghost>
              <a-collapse-panel key="1" header="View full author listing & affiliations">
                <div class="affiliations-text">
                  Le Cong¹²*, Zaixi Zhang³*, Xiaotong Wang¹²*, Yin Di¹²*, Ruofan Jin³, 
                  Michal Gerasimiuk¹², Yinkai Wang¹², Ravi K. Dinesh¹², David Smerkous⁴, 
                  Alex Smerkous⁵, Xuekun Wu²⁶, Shilong Liu³, Peishan Li¹², Yi Zhu¹², 
                  Simran Serrao¹², Ning Zhao¹², Imran A. Mohammad²⁷, John B. Sunwoo²⁷, 
                  Joseph C. Wu²⁶, Mengdi Wang³**.
                  <br><em>(See paper for full institutional details.)</em>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-card>
        </a-col>

        <!-- 创始合作伙伴 -->
        <a-col :xs="24" :md="12">
          <a-card class="content-card">
            <h3 class="card-title">Founding Partners</h3>
            <div class="logo-row">
              <div class="partner-text">NVIDIA</div>
              <div class="partner-text">Nebius</div>
              <div class="partner-text">AI4Science Catalyst Institute</div>
              <div class="partner-text">VITURE</div>
            </div>
            <p class="partner-note">
              We acknowledge the support of NVIDIA, Nebius, AI4Science Catalyst Institute, and VITURE 
              for VLM fine-tuning, agentic integration, infrastructure, and hardware.
            </p>
          </a-card>
        </a-col>
      </a-row>

      <!-- 机构合作 -->
      <a-card class="institutions-card">
        <h3 class="card-title">Institutional Affiliations</h3>
        <div class="logo-row">
          <div class="institution-text">Stanford University</div>
          <div class="institution-text">Princeton University</div>
          <div class="institution-text">University of Washington</div>
          <div class="institution-text">Oregon State University</div>
        </div>
      </a-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { vReveal } from '@/directives/reveal'
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

.content-card {
  background: #ffffff;
  border: 1px solid #eef2ff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
  height: 100%;
}

.card-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.author-lead {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: 16px;
  line-height: 1.6;
}

.author-text {
  color: #6b7280;
  margin: 0 0 12px;
  line-height: 1.6;
  font-size: 15px;
}

.affiliations-text {
  margin-top: 8px;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.logo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .logo-row {
    justify-content: center;
  }
  
  .partner-text,
  .institution-text {
    font-size: 11px;
    padding: 5px 10px;
  }
}

.partner-text,
.institution-text {
  padding: 6px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 600;
  color: #475569;
  font-size: 12px;
  white-space: nowrap;
}

.partner-note {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 15px;
}

.institutions-card {
  margin-top: 18px;
  background: #ffffff;
  border: 1px solid #eef2ff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .author-lead {
    font-size: 15px;
  }
  
  .author-text {
    font-size: 14px;
  }
  
  .affiliations-text {
    font-size: 14px;
  }
  
  .partner-note {
    font-size: 14px;
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

