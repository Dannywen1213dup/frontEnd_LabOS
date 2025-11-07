<template>
  <a-layout-footer class="labos-footer">
    <div class="footer-content">
      <a-row :gutter="[28, 28]">
        <a-col :xs="24" :md="12">
          <div class="footer-section">
            <h4 class="footer-title">LabOS</h4>
            <p class="footer-text">
              AI-XR co-scientist for modern labs — from reasoning to real-world execution 
              and documentation.
            </p>
          </div>
        </a-col>

        <a-col :xs="12" :md="6">
          <div class="footer-section">
            <h4 class="footer-title">Quick Links</h4>
            <button type="button" class="footer-link" @click="scrollToId('about')">About</button>
            <button type="button" class="footer-link" @click="scrollToId('use')">Use LabOS Now</button>
            <button type="button" class="footer-link" @click="scrollToId('media')">Media</button>
            <button type="button" class="footer-link" @click="scrollToId('benchmark')">Benchmark</button>
            <button type="button" class="footer-link" @click="scrollToId('leaderboard')">Leaderboard</button>
            <button type="button" class="footer-link" @click="scrollToId('team')">Team</button>
          </div>
        </a-col>

        <a-col :xs="12" :md="6">
          <div class="footer-section">
            <h4 class="footer-title">Contact</h4>
            <a href="mailto:congle@stanford.edu" class="footer-link">congle@stanford.edu</a>
            <a href="mailto:mengdiw@princeton.edu" class="footer-link">mengdiw@princeton.edu</a>
          </div>
        </a-col>
      </a-row>

      <div class="footer-copyright">
        &copy; 2025 LabOS Project. All rights reserved.
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { useSmoothScroll } from '@/composables/useSmoothScroll'

const { scrollToId } = useSmoothScroll()
</script>

<style scoped>
.labos-footer {
  background: #0b1220;
  color: #cbd5e1;
  padding: 48px 0 0;
}

.footer-content {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-section {
  margin-bottom: 24px;
}

.footer-title {
  color: #fff;
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.footer-text {
  color: #cbd5e1;
  margin: 0;
  line-height: 1.6;
}

.footer-link {
  color: #cbd5e1;
  text-decoration: none;
  display: block;
  margin: 6px 0;
  transition: color 0.2s ease;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
}
.footer-link:hover {
  color: #fff;
}

.footer-copyright {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  margin-top: 24px;
  padding-top: 14px;
  padding-bottom: 24px;
  text-align: center;
  font-size: 14px;
  color: #cbd5e1;
}
</style>

