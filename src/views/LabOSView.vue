<template>
  <div class="labos-page">
    <HeaderNav />
    <SidebarNav />
    <HeroSection />
    <AboutSection />
    <UseLabOSSection />
    <BenchmarkSection />
    <LeaderboardSection />
    <MediaSection />
    <TeamSection />
    <FooterSection />
    <SubmitModal v-model:open="showSubmit" />
  </div>
</template>

<script setup lang="ts">
import HeaderNav from '@/components/LabOS/HeaderNav.vue'
import SidebarNav from '@/components/LabOS/SidebarNav.vue'
import HeroSection from '@/components/LabOS/HeroSection.vue'
import AboutSection from '@/components/LabOS/AboutSection.vue'
import UseLabOSSection from '@/components/LabOS/UseLabOSSection.vue'
import MediaSection from '@/components/LabOS/MediaSection.vue'
import BenchmarkSection from '@/components/LabOS/BenchmarkSection.vue'
import LeaderboardSection from '@/components/LabOS/LeaderboardSection.vue'
import TeamSection from '@/components/LabOS/TeamSection.vue'
import FooterSection from '@/components/LabOS/FooterSection.vue'
import SubmitModal from '@/components/LabOS/SubmitModal.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showSubmit = ref(false)

watch(
  () => route.path,
  (p) => { showSubmit.value = p === '/submit' },
  { immediate: true }
)

watch(showSubmit, (open) => {
  if (!open && route.path === '/submit') {
    router.replace('/')
  }
})
</script>

<style>
/* 全局样式 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

:root {
  --bg: #f7f9ff;
  --surface: #ffffff;
  --text: #1f2937;
  --muted: #6b7280;
  --primary: #4f46e5;
  --accent: #22d3ee;
  --grad: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  --max: 1160px;
  --radius: 12px;
  --shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>

<style scoped>
.labos-page {
  min-height: 100vh;
  background: var(--bg);
}
</style>

