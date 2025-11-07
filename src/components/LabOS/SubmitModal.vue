<template>
  <a-modal
    :open="open"
    :footer="null"
    :width="920"
    @cancel="emit('update:open', false)"
    :mask-closable="true"
    destroy-on-close
  >
    <div class="container">
      <a-card class="upload-card" :bordered="false">
        <h2 class="title">File Upload</h2>
        <p class="desc">
          Files <b>required</b> for submission are listed below. You can also provide figures, tables,
          and supplementary material.
        </p>

        <div class="file-types">
          <div class="file-type">Manuscript - with author details</div>
          <div class="file-type">Manuscript - anonymous</div>
        </div>

        <a-alert
          type="info"
          show-icon
          class="anon-tip"
          message="Why two copies of my manuscript?"
          description="We operate anonymous peer review. Ensure the anonymous copy has no identifying info."
        />

        <a-upload-dragger
          name="files"
          :multiple="true"
          :before-upload="handleBeforeUpload"
          :file-list="fileList"
          @remove="onRemove"
        >
          <p class="ant-upload-drag-icon">
            <upload-outlined />
          </p>
          <p class="ant-upload-text">Drag your research article and supporting files here</p>
          <p class="ant-upload-hint">OR</p>
          <a-button>Choose files</a-button>
        </a-upload-dragger>

        <div class="actions">
          <a-space>
            <a-button @click="onReset">Reset</a-button>
            <a-button type="primary" @click="onSubmit" :loading="submitting">Submit</a-button>
          </a-space>
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

type UploadFileItem = { uid: string; name: string; status?: 'error' | 'success' | 'done' | 'uploading' }
const fileList = ref<UploadFileItem[]>([])
const submitting = ref(false)

const handleBeforeUpload = (file: File) => {
  fileList.value = [...fileList.value, { uid: `${Date.now()}-${file.name}`, name: file.name }]
  return false
}
const onRemove = (file: UploadFileItem) => {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
}

const fakeSubmitApi = async () => {
  await new Promise(r => setTimeout(r, 800))
  throw new Error('fail to submit')
}

const onSubmit = async () => {
  if (!fileList.value.length) {
    message.warning('Please add at least one file')
    return
  }
  try {
    submitting.value = true
    await fakeSubmitApi()
  } catch (e) {
    message.error('fail to submit')
  } finally {
    submitting.value = false
  }
}

const onReset = () => { fileList.value = [] }
</script>

<style scoped>
.container { padding: 4px 4px 0 }
.upload-card { background:#ffffff; border-radius:10px; box-shadow:0 10px 24px rgba(16,24,40,.08) }
.title { margin:0 0 6px }
.desc { color:#6b7280; margin:0 0 16px }
.file-types { background:#f3f4f6; border-radius:6px; padding:10px 12px; margin-bottom:14px }
.file-type { color:#374151; font-size:14px }
.file-type + .file-type { margin-top:4px }
.anon-tip { margin-bottom:16px }
.actions { display:flex; justify-content:flex-end; margin-top:16px }
</style>


