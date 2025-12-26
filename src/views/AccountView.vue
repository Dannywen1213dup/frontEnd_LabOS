<template>
  <div class="account-page-wrapper">
    <div class="account-container">
      <button class="back-button" @click="goBack">← Back</button>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <a-spin size="large" />
        <p class="loading-text">Loading account information...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Unable to Load Account</h2>
        <p class="error-message">{{ error }}</p>
        <button class="btn btn-primary" @click="retryFetch">Retry</button>
      </div>

      <!-- Success State - Show Account Details -->
      <div v-else-if="userData" class="account-content">
        <!-- Profile Section -->
        <div class="profile-section">
          <div class="avatar-section">
            <img :src="userAvatar" alt="Profile" class="profile-avatar" />
          </div>
          <div class="user-info-primary">
            <h1 class="user-display-name">{{ displayName }}</h1>
            <p class="user-email-text">{{ email }}</p>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="settings-section">
          <h2 class="section-title">Account Settings</h2>
          
          <div class="setting-item">
            <div class="setting-label">Username</div>
            <div class="setting-value-row">
              <a-input 
                :value="displayName"
                class="setting-input" 
                :bordered="false"
                readonly
              />
              <a-button class="action-btn" @click="openNameModal">Edit</a-button>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Email</div>
            <div class="setting-value-row">
              <a-input 
                :value="email"
                class="setting-input" 
                :bordered="false"
                readonly
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Password</div>
            <div class="setting-value-row">
              <div class="password-placeholder">
                Change your password (you will be logged out)
              </div>
              <a-button class="action-btn" @click="openPasswordModal">Change</a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Name Edit Modal -->
      <a-modal
        :open="nameModalOpen"
        :footer="null"
        :mask-closable="true"
        destroy-on-close
        @cancel="closeNameModal"
      >
        <div class="modal-body">
          <h3 class="modal-title">Edit Name</h3>
          <p class="modal-desc">Update your first name / last name.</p>

          <div class="form-field">
            <div class="form-label">First name</div>
            <a-input v-model:value="firstName" placeholder="Enter first name" />
          </div>

          <div class="form-field">
            <div class="form-label">Last name</div>
            <a-input v-model:value="lastName" placeholder="Enter last name" />
          </div>

          <div class="modal-actions">
            <a-button @click="closeNameModal" :disabled="nameSubmitting">Cancel</a-button>
            <a-button type="primary" @click="submitNameChange" :loading="nameSubmitting">
              Submit
            </a-button>
          </div>
        </div>
      </a-modal>

      <!-- Password Change Modal -->
      <a-modal
        :open="passwordModalOpen"
        :footer="null"
        :mask-closable="true"
        destroy-on-close
        @cancel="closePasswordModal"
      >
        <div class="modal-body">
          <h3 class="modal-title">Change Password</h3>
          <p class="modal-desc">After changing password, you will be logged out for security.</p>

          <div class="form-field">
            <div class="form-label">Current password</div>
            <a-input-password v-model:value="oldPassword" placeholder="Enter current password" />
          </div>

          <div class="form-field">
            <div class="form-label">New password</div>
            <a-input-password v-model:value="newPassword" placeholder="Enter new password (min 8 characters)" />
          </div>

          <div class="form-field">
            <div class="form-label">Confirm new password</div>
            <a-input-password v-model:value="confirmPassword" placeholder="Re-enter new password" />
          </div>

          <div class="modal-actions">
            <a-button @click="closePasswordModal" :disabled="passwordSubmitting">Cancel</a-button>
            <a-button type="primary" @click="submitPasswordChange" :loading="passwordSubmitting">
              Submit
            </a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { API_BASE_URL } from '@/composables/useApiConfig'
import defaultAvatarSrc from '@/assets/picture/newUserAvatar.jpeg'

const { getTokenValue, logout, checkLoginStatus } = useAuth()
const router = useRouter()

interface AccountUserInfo {
  userName?: string
  email?: string
  userAvatar?: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const userData = ref<AccountUserInfo | null>(null)

const displayName = computed(() => userData.value?.userName || 'User')
const email = computed(() => userData.value?.email || '')
// For now, always use the frontend default avatar.
const userAvatar = computed(() => defaultAvatarSrc)

const nameModalOpen = ref(false)
const nameSubmitting = ref(false)
const firstName = ref('')
const lastName = ref('')

const passwordModalOpen = ref(false)
const passwordSubmitting = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const fetchUserInfo = async () => {
  loading.value = true
  error.value = null
  
  const tokenValue = getTokenValue()
  
  if (!tokenValue) {
    error.value = 'You are not logged in. Please log in to view your account.'
    loading.value = false
    setTimeout(() => {
      router.push('/')
    }, 2000)
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/user-info`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'satoken': tokenValue,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user information')
    }

    const result = await response.json()
    
    if (result.code !== 0 || !result.data) {
      throw new Error(result.message || 'Failed to load user information')
    }

    userData.value = result.data
  } catch (err) {
    console.error('Error fetching user info:', err)
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    message.error('Failed to load account information')
  } finally {
    loading.value = false
  }
}

const retryFetch = () => {
  fetchUserInfo()
}

const goBack = () => {
  router.back()
}

const openNameModal = () => {
  // best-effort prefill from current displayName like "First Last"
  const raw = displayName.value?.trim() || ''
  const parts = raw.split(/\s+/).filter(Boolean)
  firstName.value = parts[0] || ''
  lastName.value = parts.length > 1 ? parts.slice(1).join(' ') : ''
  nameModalOpen.value = true
}

const closeNameModal = () => {
  nameModalOpen.value = false
  firstName.value = ''
  lastName.value = ''
}

const submitNameChange = async () => {
  const tokenValue = getTokenValue()
  if (!tokenValue) {
    message.error('Please login first')
    return
  }

  if (!firstName.value.trim() && !lastName.value.trim()) {
    message.warning('Please enter at least a first name or last name')
    return
  }

  try {
    nameSubmitting.value = true
    const response = await fetch(`${API_BASE_URL}/user/update/name`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        satoken: tokenValue,
      },
      body: JSON.stringify({
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
      }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || `Update name failed: ${response.status}`)
    }

    const result = await response.json()
    if (result.code !== 0) {
      throw new Error(result.message || 'Update name failed')
    }

    message.success('Name updated')
    closeNameModal()
    // Refresh global user profile (HeaderNav uses currentUser)
    await checkLoginStatus()
    await fetchUserInfo()
  } catch (e: any) {
    console.error('Update name error:', e)
    message.error(e?.message || 'Failed to update name')
  } finally {
    nameSubmitting.value = false
  }
}

const openPasswordModal = () => {
  passwordModalOpen.value = true
}

const closePasswordModal = () => {
  passwordModalOpen.value = false
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const submitPasswordChange = async () => {
  const tokenValue = getTokenValue()
  if (!tokenValue) {
    message.error('Please login first')
    return
  }

  if (!oldPassword.value) {
    message.warning('Please enter your current password')
    return
  }
  if (!newPassword.value || newPassword.value.length < 8) {
    message.warning('New password must be at least 8 characters')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    message.warning('New password and confirm password do not match')
    return
  }

  try {
    passwordSubmitting.value = true
    const response = await fetch(`${API_BASE_URL}/user/update/password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        satoken: tokenValue,
      },
      body: JSON.stringify({
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || `Change password failed: ${response.status}`)
    }

    const result = await response.json()
    if (result.code !== 0) {
      throw new Error(result.message || 'Change password failed')
    }

    message.success('Password updated. Please login again.')
    closePasswordModal()
    await logout()
    router.push('/')
  } catch (e: any) {
    console.error('Change password error:', e)
    message.error(e?.message || 'Failed to change password')
  } finally {
    passwordSubmitting.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.account-page-wrapper {
  min-height: calc(100vh - 58px);
  background-color: #ffffff;
  padding: 0;
  width: 100%;
}

.account-container {
  min-height: calc(100vh - 58px);
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.back-button {
  position: absolute;
  top: 32px;
  left: 32px;
  background: transparent;
  border: none;
  color: #4f46e5;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  transition: all 0.2s ease;
}

.back-button:hover {
  color: #4338ca;
  transform: translateX(-4px);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 58px);
  gap: 20px;
}

.loading-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 58px);
  text-align: center;
  gap: 16px;
}

.error-icon {
  font-size: 48px;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.error-message {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  max-width: 500px;
}

/* Account Content */
.account-content {
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 58px);
  padding: 120px 40px 60px 40px;
}

/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;
  max-width: 600px;
}

.avatar-section {
  flex-shrink: 0;
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
}

.user-info-primary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
}

.user-display-name {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.user-email-text {
  color: #6b7280;
  font-size: 17px;
  margin: 0;
}

/* Settings Section */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  max-width: 600px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px;
  text-align: center;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.setting-value-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f9fafb;
  padding: 4px 4px 4px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.setting-input {
  flex: 1;
  background: transparent !important;
  color: #1f2937 !important;
  padding: 8px 0;
  font-size: 15px;
}

:deep(.ant-input) {
  background: transparent !important;
  color: #1f2937 !important;
}

:deep(.ant-input[disabled]) {
  color: #1f2937 !important;
  cursor: default;
}

.password-placeholder {
  flex: 1;
  color: #6b7280;
  font-size: 14px;
  padding: 8px 0;
}

.action-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  height: 36px;
  padding: 0 16px;
  transition: all 0.2s ease;
}

.action-btn:not([disabled]):hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
  color: #374151;
}

.action-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  display: inline-block;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 15px;
}

.btn-primary {
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.12);
}

/* Modals */
.modal-body {
  padding: 6px 2px 0;
}

.modal-title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.modal-desc {
  margin: 0 0 14px;
  color: #6b7280;
  font-size: 14px;
}

.selected-file {
  margin-top: 12px;
  color: #374151;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.form-field {
  margin-top: 12px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .account-content {
    padding: 100px 24px 40px 24px;
  }

  .back-button {
    top: 20px;
    left: 20px;
    font-size: 16px;
    padding: 10px 12px;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
  }
  
  .user-display-name {
    font-size: 28px;
  }

  .user-email-text {
    font-size: 15px;
  }
  
  .setting-value-row {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 10px;
  }
  
  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .account-content {
    padding: 80px 16px 32px 16px;
  }

  .back-button {
    top: 16px;
    left: 16px;
    font-size: 15px;
  }

  .user-display-name {
    font-size: 24px;
  }
}
</style>


