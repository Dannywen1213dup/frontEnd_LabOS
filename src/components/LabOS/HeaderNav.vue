<template>
  <a-layout-header class="labos-header">
    <div class="header-content">
      <div class="brand">
        <img :src="logoSrc" alt="LabOS logo" class="logo-img" />
        <span class="brand-text">LabOS</span>
      </div>
      <nav class="nav-menu">
      <div class="auth-section">
        <div v-if="!isLoggedIn" class="auth-buttons">
          <button class="auth-btn login-btn" @click="handleShowAuth('login')">
            Login
          </button>
          <button class="auth-btn register-btn" @click="handleShowAuth('register')">
            Register
          </button>
        </div>
        <div v-else class="user-section">
          <span class="user-name">{{ currentUser?.userName || 'User' }}</span>
          <a-button
            type="text"
            size="small"
            class="logout-btn"
            @click="handleLogout"
          >
            Sign Out
          </a-button>
        </div>
      </div>
    </nav>
      <AuthModal 
        :open="showAuthModal" 
        :initial-tab="initialTab"
        @update:open="showAuthModal = $event" 
        @success="handleLoginSuccess" 
      />
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import logoSrc from '@/assets/picture/LabOS_logo.jpg'
import { useAuth } from '@/composables/useAuth'
import AuthModal from './AuthModal.vue'

const { isLoggedIn, currentUser, logout, checkLoginStatus } = useAuth()
const showAuthModal = ref(false)
const initialTab = ref<'login' | 'register'>('login')

const handleShowAuth = (tab: 'login' | 'register') => {
  initialTab.value = tab
  showAuthModal.value = true
}

const handleLoginSuccess = () => {
  checkLoginStatus()
}

const handleLogout = async () => {
  try {
    await logout()
    message.success('Logged out successfully')
    checkLoginStatus()
  } catch (error: any) {
    message.error(error?.message || 'Failed to logout')
  }
}

onMounted(() => {
  checkLoginStatus()
})
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

.auth-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.auth-btn {
  padding: 3px 13.6px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  letter-spacing: 0.2px;
  line-height: 1.2;
  box-sizing: border-box;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.login-btn {
  color: #6b7280;
  background: transparent;
  border: 1px solid #e5e7eb;
}

.login-btn:hover {
  color: #4f46e5;
  background: #f3f4f6;
}

.register-btn {
  color: #ffffff;
  background: #4f46e5;
  border: 1px solid #4f46e5;
  box-shadow: 0 2px 4px -1px rgba(79, 70, 229, 0.1);
}

.register-btn:hover {
  background: #4338ca;
  border-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  color: #475569;
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  color: #475569;
  font-weight: 500;
  padding: 0 8px;
}

.logout-btn:hover {
  color: #111827;
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
  
  .brand-text {
    font-size: 11px;
  }
  
  .logo-img {
    height: 18px;
  }
}
</style>

