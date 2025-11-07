<template>
  <a-layout style="min-height: 100vh; background:#f8fafc">
    <a-layout-content>
      <div class="container">
        <a-card class="upload-card" :bordered="false">
          <h2 class="title">File Upload</h2>
          <p class="desc">
            Files <b>required</b> for submission to this journal are listed below. Figures, tables, supplementary
            material, and other relevant files meeting the file guidelines can also be provided.
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
            description="The journal operates anonymous peer review. Please ensure the anonymous copy contains nothing that can identify you or your co-authors."
          />

          <div class="uploader">
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
              <p class="ant-upload-text">Drag your research article and any supporting files here</p>
              <p class="ant-upload-hint">OR</p>
              <a-button>Choose files</a-button>
            </a-upload-dragger>
          </div>

          <div class="actions">
            <a-space>
              <a-button @click="onReset">Reset</a-button>
              <a-button type="primary" @click="onSubmit" :loading="submitting">Submit</a-button>
            </a-space>
          </div>
        </a-card>
      </div>
    </a-layout-content>
  </a-layout>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'

type UploadFileItem = {
  uid: string
  name: string
  status?: 'error' | 'success' | 'done' | 'uploading'
  url?: string
}

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
  // Placeholder for future backend integration
  await new Promise((resolve) => setTimeout(resolve, 800))
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

const onReset = () => {
  fileList.value = []
}
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 32px auto;
  padding: 0 20px;
}

.upload-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
}

.title {
  margin: 0 0 6px;
}

.desc {
  color: #6b7280;
  margin: 0 0 16px;
}

.file-types {
  background: #f3f4f6;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 14px;
}

.file-type {
  color: #374151;
  font-size: 14px;
}

.file-type + .file-type { margin-top: 4px; }

.anon-tip { margin-bottom: 16px; }

.uploader :deep(.ant-upload.ant-upload-drag) {
  background: #ffffff;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>


