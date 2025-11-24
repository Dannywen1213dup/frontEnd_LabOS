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
      <a-form-item label="Username" name="userAccount">
        <a-input
          v-model:value="form.userAccount"
          placeholder="Enter your username"
          @pressEnter="handleLogin"
        />
      </a-form-item>
      <a-form-item label="Password" name="userPassword">
        <a-input-password
          v-model:value="form.userPassword"
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
  userAccount: '',
  userPassword: '',
})

const rules = {
  userAccount: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  userPassword: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    await login(form.userAccount, form.userPassword)
    message.success('Login successful!')
    emit('update:open', false)
    emit('success')
    // Reset form
    form.userAccount = ''
    form.userPassword = ''
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
  form.userAccount = ''
  form.userPassword = ''
}
</script>


