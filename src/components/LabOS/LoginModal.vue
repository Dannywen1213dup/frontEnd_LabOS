<template>
  <a-modal
    :open="open"
    title="Login"
    :confirm-loading="loading"
    @ok="handleLogin"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
      <a-form-item label="Email" name="email">
        <a-input
          v-model:value="form.email"
          placeholder="Enter your email"
          type="email"
          @pressEnter="handleLogin"
        />
      </a-form-item>
      <a-form-item label="Password" name="password">
        <a-input-password
          v-model:value="form.password"
          placeholder="Enter your password"
          @pressEnter="handleLogin"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useAuth } from '@/composables/useAuth'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void; (e: 'success'): void }>()

const { login, isLoading } = useAuth()
const formRef = ref()
const loading = computed(() => isLoading.value)

const form = reactive({
  email: '',
  password: '',
})

const rules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    await login(form.email, form.password)
    message.success('Login successful!')
    emit('update:open', false)
    emit('success')
    // Reset form
    form.email = ''
    form.password = ''
  } catch (error: any) {
    if (error?.errorFields) {
      // Validation error
      return
    }
    message.error(error?.message || 'Login failed. Please check your credentials.')
  }
}

const handleCancel = () => {
  emit('update:open', false)
  form.email = ''
  form.password = ''
}
</script>


