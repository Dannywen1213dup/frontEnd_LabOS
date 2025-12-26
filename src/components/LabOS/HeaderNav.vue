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
            <span v-if="userDisplayName" class="user-name">{{ userDisplayName }}</span>
          <div class="avatar-container" ref="avatarContainerRef">
            <div class="avatar-wrapper" @click.stop="toggleUserMenu">
              <img :src="userAvatarSrc" alt="User avatar" class="user-avatar" />
            </div>
            <div v-if="dropdownVisible" class="user-menu-panel">
              <div class="menu-item" @click="goToAccount">
                <div class="menu-icon"><UserOutlined /></div>
                <span>Account</span>
              </div>
              <div class="menu-item" @click="goToUploadHistory">
                <div class="menu-icon"><HistoryOutlined /></div>
                <span>Upload History</span>
              </div>
              <div class="menu-item" @click="dropdownVisible = false">
                <div class="menu-icon"><InfoCircleOutlined /></div>
                <span>About</span>
                <span class="version-text">{{ APP_VERSION }}</span>
              </div>
              <div class="menu-divider"></div>
              <button class="menu-item logout-action" @click="handleLogout">
                <div class="menu-icon"><LogoutOutlined /></div>
                <span>Log out</span>
              </button>
            </div>
          </div>
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
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { 
  UserOutlined, 
  InfoCircleOutlined, 
  HistoryOutlined, 
  LogoutOutlined 
} from '@ant-design/icons-vue'
import logoSrc from '@/assets/picture/LabOS_logo.jpg'
import defaultAvatarSrc from '@/assets/picture/newUserAvatar.jpeg'
import { useAuth } from '@/composables/useAuth'
import AuthModal from './AuthModal.vue'

const router = useRouter()
const { isLoggedIn, currentUser, logout, checkLoginStatus } = useAuth()
const showAuthModal = ref(false)
const initialTab = ref<'login' | 'register'>('login')
const dropdownVisible = ref(false)
const avatarContainerRef = ref<HTMLElement | null>(null)
// Always use frontend default avatar (no user avatar caching / no backend avatar)
const userAvatarSrc = computed(() => defaultAvatarSrc)
const userDisplayName = computed(() => currentUser.value?.userName || '')
const APP_VERSION = '1.0.1'

const handleShowAuth = (tab: 'login' | 'register') => {
  initialTab.value = tab
  showAuthModal.value = true
}

const goToAccount = () => {
  dropdownVisible.value = false
  router.push('/account')
}

const goToUploadHistory = () => {
  dropdownVisible.value = false
  router.push('/upload-history')
}

const handleLoginSuccess = () => {
  checkLoginStatus()
}

const toggleUserMenu = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const handleLogout = async () => {
  try {
    dropdownVisible.value = false
    await logout()
    message.success('Logged out successfully')
    checkLoginStatus()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to logout'
    message.error(errorMessage)
  }
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!avatarContainerRef.value) {
    return
  }

  if (!avatarContainerRef.value.contains(event.target as Node)) {
    dropdownVisible.value = false
  }
}

onMounted(() => {
  checkLoginStatus()
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.labos-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
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
  margin-left: auto;
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
  gap: 12px;
}

.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
  white-space: nowrap;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s ease;
}

.avatar-wrapper:hover .user-avatar {
  border-color: #4f46e5;
}

.user-menu-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.menu-item {
  width: 100%;
  padding: 0px 12px;
  text-align: left;
  background: transparent;
  border: none;
  color: #1f2937;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.5);
  color: #000000;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #4b5563;
}

.menu-item:hover .menu-icon {
  color: #000000;
}

/* Ensure History icon has same color as Account */
.menu-item .menu-icon :deep(svg),
.menu-item .menu-icon :deep(path) {
  fill: currentColor;
  stroke: currentColor;
}

.version-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
  margin-left: auto;
}

.menu-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06);
  margin: 4px 6px;
}

.logout-action {
  color: #ef4444;
}

.logout-action .menu-icon {
  color: #ef4444;
}

.logout-action:hover {
  background-color: rgba(254, 242, 242, 0.7);
  color: #dc2626;
}

.logout-action:hover .menu-icon {
  color: #dc2626;
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

