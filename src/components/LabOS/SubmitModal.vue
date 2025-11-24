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

        <div class="uploader" :class="{ 'upload-complete': allUploadsComplete }">
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
          <div v-if="uploading" class="upload-progress">
            <div v-for="file in fileList" :key="file.uid" class="file-progress-item">
              <div class="file-name">{{ file.name }}</div>
              <a-progress 
                :percent="file.uploadProgress || 0" 
                :status="file.status === 'error' ? 'exception' : file.status === 'success' ? 'success' : 'active'"
                :show-info="true"
              />
            </div>
          </div>
        </div>

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
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

type UploadFileItem = {
  uid: string
  name: string
  file?: File
  status?: 'error' | 'success' | 'done' | 'uploading'
  url?: string
  uploadProgress?: number
}

const fileList = ref<UploadFileItem[]>([])
const submitting = ref(false)
const uploading = ref(false)

// API base URL - includes /api context path from backend
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8101/api'

const allUploadsComplete = computed(() => {
  return fileList.value.length > 0 && 
         fileList.value.every(f => f.status === 'success' || f.status === 'done')
})

const handleBeforeUpload = (file: File) => {
  fileList.value = [...fileList.value, { 
    uid: `${Date.now()}-${file.name}`, 
    name: file.name,
    file: file,
    status: undefined,
    uploadProgress: 0
  }]
  return false
}

const onRemove = (file: UploadFileItem) => {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
}

/**
 * Fetch batch presigned URLs from backend
 */
const fetchBatchPresignedUrls = async (fileNames: string[]): Promise<Array<{ fileName: string; sanitizedFileName: string; presignedUrl: string }>> => {
  const response = await fetch(`${API_BASE_URL}/s3/folder/presigned-upload-url/benchmark-eval/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify({
      fileNames: fileNames,
      expirationTime: 3600000 // 1 hour
    })
  })

  if (!response.ok) {
    let errorText = ''
    try {
      errorText = await response.text()
      const errorJson = JSON.parse(errorText)
      throw new Error(errorJson.message || `Failed to get presigned URLs: ${response.status}`)
    } catch (parseError) {
      throw new Error(`Failed to get presigned URLs: ${response.status} ${errorText || response.statusText}`)
    }
  }

  const result = await response.json()
  if (result.code !== 0) {
    throw new Error(result.message || 'Failed to get presigned URLs')
  }

  return result.data.entries || []
}

/**
 * Upload a single file to S3 using presigned URL
 */
const uploadFileToS3 = async (
  file: File, 
  presignedUrl: string, 
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100)
        onProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        onProgress(100)
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'))
    })

    xhr.open('PUT', presignedUrl)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.send(file)
  })
}

const onSubmit = async () => {
  if (!fileList.value.length) {
    message.warning('Please add at least one file')
    return
  }

  // Filter out files that don't have the actual File object
  const filesToUpload = fileList.value.filter(item => item.file)
  if (filesToUpload.length === 0) {
    message.warning('No valid files to upload')
    return
  }

  try {
    submitting.value = true
    uploading.value = true

    // Reset all file statuses
    fileList.value.forEach(file => {
      file.status = 'uploading'
      file.uploadProgress = 0
    })

    // Step 1: Get batch presigned URLs
    const fileNames = filesToUpload.map(item => item.name)
    message.loading('Getting upload URLs...', 0)
    
    const presignedUrls = await fetchBatchPresignedUrls(fileNames)
    message.destroy()

    if (presignedUrls.length !== filesToUpload.length) {
      throw new Error('Mismatch between requested and received presigned URLs')
    }

    // Create a map of file name to presigned URL entry
    const urlMap = new Map<string, typeof presignedUrls[0]>()
    presignedUrls.forEach(entry => {
      urlMap.set(entry.fileName, entry)
    })

    // Step 2: Upload each file
    message.loading('Uploading files...', 0)
    
    const uploadPromises = filesToUpload.map(async (fileItem) => {
      const presignedUrlEntry = urlMap.get(fileItem.name)
      if (!presignedUrlEntry) {
        throw new Error(`No presigned URL found for file: ${fileItem.name}`)
      }

      try {
        await uploadFileToS3(
          fileItem.file!,
          presignedUrlEntry.presignedUrl,
          (progress) => {
            fileItem.uploadProgress = progress
          }
        )
        fileItem.status = 'success'
      } catch (error) {
        fileItem.status = 'error'
        throw error
      }
    })

    await Promise.allSettled(uploadPromises)
    message.destroy()

    // Check if all uploads succeeded
    const failedUploads = fileList.value.filter(f => f.status === 'error')
    if (failedUploads.length > 0) {
      message.error(`${failedUploads.length} file(s) failed to upload`)
    } else {
      message.success('All files uploaded successfully!')
      // Optionally close the modal after successful upload
      // emit('update:open', false)
    }

  } catch (e: any) {
    message.destroy()
    // Provide more detailed error messages
    let errorMessage = 'Failed to upload files'
    if (e.message) {
      errorMessage = e.message
    } else if (e.response) {
      errorMessage = `Server error: ${e.response.status} ${e.response.statusText}`
    }
    message.error(errorMessage)
    // Mark all files as error if the batch request failed
    fileList.value.forEach(file => {
      if (file.status === 'uploading') {
        file.status = 'error'
      }
    })
  } finally {
    submitting.value = false
    uploading.value = false
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
.uploader :deep(.ant-upload.ant-upload-drag) {
  background: #ffffff;
}
.uploader.upload-complete :deep(.ant-upload.ant-upload-drag) {
  border: 2px solid #52c41a;
  background: #f6ffed;
}
.upload-progress {
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}
.file-progress-item {
  margin-bottom: 12px;
}
.file-progress-item:last-child {
  margin-bottom: 0;
}
.file-name {
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
  font-weight: 500;
}
.actions { display:flex; justify-content:flex-end; margin-top:16px }
</style>


