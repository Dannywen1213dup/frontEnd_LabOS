<template>
  <a-layout-header class="labos-header">
    <div class="header-content">
      <div class="brand">
        <img :src="logoSrc" alt="LabOS logo" class="logo-img" />
        <span class="brand-text">LabOS</span>
      </div>
      <nav class="nav-menu">
        <button type="button" class="nav-link" @click="scrollToId('about')">About</button>
        <button type="button" class="nav-link" @click="scrollToId('use')">Use LabOS Now</button>
        <button type="button" class="nav-link" @click="scrollToId('benchmark')">Benchmark</button>
        <button type="button" class="nav-link" @click="scrollToId('leaderboard')">Leaderboard</button>
        <button type="button" class="nav-link" @click="scrollToId('media')">Media</button>
        <button type="button" class="nav-link" @click="scrollToId('team')">Team</button>
        <a
          class="paper-link"
          href="https://arxiv.org/abs/2510.14861"
          target="_blank"
          rel="noopener"
        >
          Paper ↗
        </a>
      </nav>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import logoSrc from '@/assets/picture/LabOS_logo.jpg'
import { useSmoothScroll } from '@/composables/useSmoothScroll'

const { scrollToId } = useSmoothScroll()
</script>

<style scoped>
.labos-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff; /* 白色背景 */
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
  height: 58px; /* 减少10%: 64px * 0.9 = 57.6px ≈ 58px */
  line-height: 58px;
}

.header-content {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #1f2937; /* 深灰色文字 */
}

.logo-img {
  height: 28px;
  width: auto;
}

.brand-text {
  font-size: 16px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav-link {
  color: #475569; /* 中灰色文字 */
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  white-space: nowrap;
}

.nav-link:hover {
  color: #111827; /* 悬停时深色 */
}

.paper-link {
  color: #4f46e5; /* 紫色文字 */
  text-decoration: none;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}
.paper-link:hover {
  background: #eef2ff;
  color: #4338ca; /* 悬停时深紫色 */
}

@media (max-width: 768px) {
  .labos-header {
    height: auto;
    min-height: 50px; /* 减少10%: 56px * 0.9 = 50.4px ≈ 50px */
    padding: 8px 0;
  }
  
  .header-content {
    padding: 0 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .brand {
    flex-shrink: 0;
    margin-right: auto;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    gap: 4px;
    width: 100%;
    justify-content: flex-start;
    margin-top: 4px;
  }

  .nav-link {
    font-size: 11px;
    padding: 3px 6px;
    line-height: 1.2;
  }
  
  .paper-link {
    font-size: 11px;
    padding: 3px 6px;
    line-height: 1.2;
  }
  
  .brand-text {
    font-size: 12px;
  }
  
  .logo-img {
    height: 20px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 8px;
  }
  
  .nav-menu {
    gap: 3px;
  }
  
  .nav-link {
    font-size: 10px;
    padding: 2px 4px;
  }
  
  .paper-link {
    font-size: 10px;
    padding: 2px 4px;
  }
  
  .brand-text {
    font-size: 11px;
  }
  
  .logo-img {
    height: 18px;
  }
}
</style>

