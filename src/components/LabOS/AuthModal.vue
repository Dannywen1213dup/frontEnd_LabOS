<template>
  <a-modal
    :open="open"
    :footer="null"
    :closable="true"
    @cancel="handleCancel"
    :width="480"
    :mask-closable="false"
    class="auth-modal"
    :transition-name="'auth-modal'"
    :mask-transition-name="'auth-mask'"
  >
    <div class="auth-container">
      <!-- Tab Buttons -->
      <div class="auth-tabs">
        <button
          class="auth-tab"
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          Login
        </button>
        <button
          class="auth-tab"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          Register
        </button>
      </div>

      <!-- Login Form -->
      <div v-show="activeTab === 'login'" class="auth-form">
        <h2 class="form-title">Welcome Back</h2>
        <a-form :model="loginForm" layout="vertical" @finish="handleLogin">
          <a-form-item
            label="Email"
            name="email"
            :rules="[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]"
          >
            <a-input
              v-model:value="loginForm.email"
              placeholder="your@email.com"
              size="large"
            />
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Please enter your password' }]"
          >
            <a-input-password
              v-model:value="loginForm.password"
              placeholder="Enter your password"
              size="large"
            />
          </a-form-item>

          <div class="form-footer">
            <a class="forgot-link" @click="showForgotPassword = true">Forgot password?</a>
          </div>

          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="submit-btn"
          >
            Login
          </a-button>
        </a-form>
      </div>

      <!-- Register Form -->
      <div v-show="activeTab === 'register'" class="auth-form">
        <h2 class="form-title">Create Account</h2>
        
        <!-- Step 1: Send Verification Code -->
        <div v-if="registerStep === 1">
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

        <!-- Step 2: Complete Registration -->
        <div v-if="registerStep === 2">
          <a-form :model="registerForm" layout="vertical" @finish="handleRegister">
            <a-form-item
              label="Verification Code"
              name="code"
              :rules="[
                { required: true, message: 'Please enter verification code' },
                { pattern: /^\d{6}$/, message: 'Code must be 6 digits' }
              ]"
            >
              <a-input
                v-model:value="registerForm.code"
                placeholder="Enter 6-digit code"
                size="large"
                maxlength="6"
              />
            </a-form-item>

            <a-row :gutter="12">
              <a-col :span="12">
                <a-form-item
                  label="First Name"
                  name="firstName"
                  :rules="[{ required: true, message: 'Required' }]"
                >
                  <a-input
                    v-model:value="registerForm.firstName"
                    placeholder="John"
                    size="large"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Last Name"
                  name="lastName"
                  :rules="[{ required: true, message: 'Required' }]"
                >
                  <a-input
                    v-model:value="registerForm.lastName"
                    placeholder="Doe"
                    size="large"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item
              label="Password"
              name="password"
              :rules="[
                { required: true, message: 'Please enter password' },
                { min: 8, message: 'Password must be at least 8 characters' }
              ]"
            >
              <a-input-password
                v-model:value="registerForm.password"
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
                v-model:value="registerForm.confirmPassword"
                placeholder="Re-enter password"
                size="large"
              />
            </a-form-item>

            <a-form-item
              name="legalAccepted"
              :rules="[{ validator: validateLegalAccepted }]"
            >
              <a-checkbox v-model:checked="registerForm.legalAccepted">
                I agree to the Terms of Service and Privacy Policy
              </a-checkbox>
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
                Create Account
              </a-button>
              <a-button
                size="large"
                block
                @click="registerStep = 1"
              >
                Back
              </a-button>
            </a-space>
          </a-form>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <a-modal
      v-model:open="showForgotPassword"
      title="Reset Password"
      :footer="null"
      :width="400"
    >
      <div v-if="forgotStep === 1">
        <a-form :model="forgotEmailForm" layout="vertical" @finish="handleSendResetCode">
          <a-form-item
            label="Email"
            name="email"
            :rules="[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]"
          >
            <a-input
              v-model:value="forgotEmailForm.email"
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
          >
            Send Reset Code
          </a-button>
        </a-form>
      </div>

      <div v-if="forgotStep === 2">
        <a-form :model="resetForm" layout="vertical" @finish="handleResetPassword">
          <a-form-item
            label="Reset Code"
            name="token"
            :rules="[
              { required: true, message: 'Please enter reset code' },
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
              { validator: validateResetPasswordMatch }
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
            >
              Reset Password
            </a-button>
            <a-button
              size="large"
              block
              @click="forgotStep = 1"
            >
              Back
            </a-button>
          </a-space>
        </a-form>
      </div>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'

const props = defineProps<{ 
  open: boolean
  initialTab?: 'login' | 'register'
}>()
const emit = defineEmits<{ 
  (e: 'update:open', v: boolean): void
  (e: 'success'): void 
}>()

const activeTab = ref<'login' | 'register'>(props.initialTab || 'login')
const registerStep = ref(1) // 1: send code, 2: complete registration
const forgotStep = ref(1) // 1: send code, 2: reset password
const showForgotPassword = ref(false)
const loading = ref(false)

// Login Form
const loginForm = reactive({
  email: '',
  password: ''
})

// Email Form (Step 1 of Registration)
const emailForm = reactive({
  email: ''
})

// Register Form (Step 2)
const registerForm = reactive({
  code: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  legalAccepted: false
})

// Forgot Password Forms
const forgotEmailForm = reactive({
  email: ''
})

const resetForm = reactive({
  token: '',
  newPassword: '',
  confirmPassword: ''
})

// Validators
const validatePasswordMatch = async (_rule: any, value: string) => {
  if (value && value !== registerForm.password) {
    return Promise.reject('Passwords do not match')
  }
  return Promise.resolve()
}

const validateResetPasswordMatch = async (_rule: any, value: string) => {
  if (value && value !== resetForm.newPassword) {
    return Promise.reject('Passwords do not match')
  }
  return Promise.resolve()
}

const validateLegalAccepted = async (_rule: any, value: boolean) => {
  if (!registerForm.legalAccepted) {
    return Promise.reject('You must accept the terms')
  }
  return Promise.resolve()
}

// Handlers
const handleLogin = async () => {
  loading.value = true
  try {
    // TODO: Implement API call to /api/auth/login
    console.log('Login:', loginForm)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    message.success('Login successful!')
    emit('update:open', false)
    emit('success')
    resetForms()
  } catch (error: any) {
    message.error(error?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}

const handleSendCode = async () => {
  loading.value = true
  try {
    // TODO: Implement API call to /api/auth/send-code
    console.log('Send code to:', emailForm.email)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    message.success('Verification code sent! Please check your email.')
    registerStep.value = 2
  } catch (error: any) {
    message.error(error?.message || 'Failed to send verification code')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  try {
    // TODO: Implement API call to /api/auth/register
    const payload = {
      email: emailForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      code: registerForm.code,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      legalAccepted: registerForm.legalAccepted
    }
    console.log('Register:', payload)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    message.success('Registration successful!')
    emit('update:open', false)
    emit('success')
    resetForms()
  } catch (error: any) {
    message.error(error?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}

const handleSendResetCode = async () => {
  loading.value = true
  try {
    // TODO: Implement API call to /api/auth/forgot-password/send-code
    console.log('Send reset code to:', forgotEmailForm.email)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    message.success('If the account exists, we have sent a password reset email.')
    forgotStep.value = 2
  } catch (error: any) {
    message.error(error?.message || 'Failed to send reset code')
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  loading.value = true
  try {
    // TODO: Implement API call to /api/auth/forgot-password/reset
    const payload = {
      email: forgotEmailForm.email,
      token: resetForm.token,
      newPassword: resetForm.newPassword,
      confirmPassword: resetForm.confirmPassword
    }
    console.log('Reset password:', payload)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    message.success('Password reset successful! Please login with your new password.')
    showForgotPassword.value = false
    forgotStep.value = 1
    activeTab.value = 'login'
    resetForms()
  } catch (error: any) {
    message.error(error?.message || 'Failed to reset password')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:open', false)
  resetForms()
}

const resetForms = () => {
  loginForm.email = ''
  loginForm.password = ''
  emailForm.email = ''
  registerForm.code = ''
  registerForm.firstName = ''
  registerForm.lastName = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.legalAccepted = false
  forgotEmailForm.email = ''
  resetForm.token = ''
  resetForm.newPassword = ''
  resetForm.confirmPassword = ''
  registerStep.value = 1
  forgotStep.value = 1
}

// Reset forms when modal closes
watch(() => props.open, (newVal) => {
  if (!newVal) {
    resetForms()
    activeTab.value = props.initialTab || 'login'
  } else {
    // Set active tab when modal opens
    activeTab.value = props.initialTab || 'login'
  }
})
</script>

<style scoped>
.auth-container {
  padding: 12px 0;
}

.auth-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-radius: 12px;
  background: #f3f4f6;
  padding: 4px;
}

.auth-tab {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-tab:hover {
  color: #4f46e5;
}

.auth-tab.active {
  background: #ffffff;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.auth-form {
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

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px;
  text-align: center;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.forgot-link {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
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

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
:deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #8b5cf6;
}

/* Modal Animations */
:deep(.auth-modal-enter-active) {
  animation: authModalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

:deep(.auth-modal-leave-active) {
  animation: authModalSlideOut 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes authModalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes authModalSlideOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
}

:deep(.auth-mask-enter-active) {
  animation: authMaskFadeIn 0.3s ease;
}

:deep(.auth-mask-leave-active) {
  animation: authMaskFadeOut 0.3s ease;
}

@keyframes authMaskFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes authMaskFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Override Ant Design modal animations */
:deep(.ant-modal) {
  animation-duration: 0.4s !important;
}

:deep(.ant-modal-mask) {
  animation-duration: 0.3s !important;
}
</style>

