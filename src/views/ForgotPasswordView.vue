<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <div class="logo-section">
          <img src="@/assets/picture/LabOS_logo.jpg" alt="LabOS logo" class="logo-img" />
          <span class="brand-text">LabOS</span>
        </div>

        <h1 class="page-title">Reset Password</h1>

        <!-- Step 1: Send Verification Code -->
        <div v-if="step === 1" class="form-section">
          <p class="form-description">Enter your email address and we'll send you a verification code to reset your password.</p>
          
          <a-form :model="emailForm" layout="vertical" @finish="handleSendCode">
            <a-form-item
              label="Email"
              name="email"
              :rules="[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]"
            >
              <a-input
                v-model:value="emailForm.email"
                placeholder="your@email.com"
                size="large"
              />
            </a-form-item>

            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="loading"
              class="submit-btn"
            >
              Send Verification Code
            </a-button>
          </a-form>
        </div>

        <!-- Step 2: Reset Password -->
        <div v-if="step === 2" class="form-section">
          <p class="form-description">Enter the verification code sent to your email and your new password.</p>
          
          <a-form :model="resetForm" layout="vertical" @finish="handleResetPassword">
            <a-form-item
              label="Verification Code"
              name="token"
              :rules="[
                { required: true, message: 'Please enter verification code' },
                { pattern: /^\d{6}$/, message: 'Code must be 6 digits' }
              ]"
            >
              <a-input
                v-model:value="resetForm.token"
                placeholder="Enter 6-digit code"
                size="large"
                maxlength="6"
              />
            </a-form-item>

            <a-form-item
              label="New Password"
              name="newPassword"
              :rules="[
                { required: true, message: 'Please enter new password' },
                { min: 8, message: 'Password must be at least 8 characters' }
              ]"
            >
              <a-input-password
                v-model:value="resetForm.newPassword"
                placeholder="At least 8 characters"
                size="large"
              />
            </a-form-item>

            <a-form-item
              label="Confirm Password"
              name="confirmPassword"
              :rules="[
                { required: true, message: 'Please confirm password' },
                { validator: validatePasswordMatch }
              ]"
            >
              <a-input-password
                v-model:value="resetForm.confirmPassword"
                placeholder="Re-enter password"
                size="large"
              />
            </a-form-item>

            <a-space direction="vertical" :size="12" style="width: 100%">
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="loading"
                class="submit-btn"
              >
                Reset Password
              </a-button>
              <a-button
                size="large"
                block
                @click="step = 1"
              >
                Back
              </a-button>
            </a-space>
          </a-form>
        </div>

        <div class="back-to-login">
          <a @click="handleBackToLogin">Back to Login</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { API_BASE_URL } from '@/composables/useApiConfig'

const router = useRouter()
const step = ref(1) // 1: send code, 2: reset password
const loading = ref(false)

const emailForm = reactive({
  email: ''
})

const resetForm = reactive({
  token: '',
  newPassword: '',
  confirmPassword: ''
})

const validatePasswordMatch = async (_rule: unknown, value: string) => {
  if (value && value !== resetForm.newPassword) {
    return Promise.reject('Passwords do not match')
  }
  return Promise.resolve()
}

const handleSendCode = async () => {
  if (!emailForm.email) {
    message.error('Please enter your email')
    return
  }

  loading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: emailForm.email,
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to send verification code'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = `Failed to send verification code: ${response.status}`
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to send verification code')
    }

    message.success('If the account exists, we have sent a password reset email.')
    step.value = 2
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code'
    message.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!emailForm.email) {
    message.error('Please enter your email')
    return
  }

  loading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: emailForm.email,
        token: resetForm.token,
        newPassword: resetForm.newPassword,
        confirmPassword: resetForm.confirmPassword,
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to reset password'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = `Failed to reset password: ${response.status}`
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to reset password')
    }

    message.success('Password reset successful! Redirecting to login...')
    resetForm.token = ''
    resetForm.newPassword = ''
    resetForm.confirmPassword = ''
    step.value = 1
    await router.push('/')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reset password'
    message.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const handleBackToLogin = () => {
  router.push('/')
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.forgot-password-container {
  width: 100%;
  max-width: 480px;
}

.forgot-password-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
}

.logo-img {
  height: 32px;
  width: auto;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 0.2px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px;
  text-align: center;
}

.form-description {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 32px;
  line-height: 1.6;
}

.form-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
  margin-top: 8px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
}

.back-to-login {
  text-align: center;
  margin-top: 24px;
}

.back-to-login a {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-to-login a:hover {
  color: #4338ca;
  text-decoration: underline;
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
}

:deep(.ant-input),
:deep(.ant-input-password) {
  border-radius: 8px;
}

:deep(.ant-input:focus),
:deep(.ant-input-password:focus),
:deep(.ant-input-focused),
:deep(.ant-input-password-focused) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

@media (max-width: 768px) {
  .forgot-password-card {
    padding: 32px 24px;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>

