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
            :show-upload-list="false"
            @remove="onRemove"
          >
            <p class="ant-upload-drag-icon">
              <upload-outlined />
            </p>
            <p class="ant-upload-text">Drag your research article and supporting files here</p>
            <p class="ant-upload-hint">OR</p>
            <a-button>Choose files</a-button>
          </a-upload-dragger>
          <div v-if="fileList.length > 0" class="upload-progress">
            <div v-for="file in fileList" :key="file.uid" class="file-progress-item">
              <div class="file-row">
                <div class="file-name">{{ file.name }}</div>
                <button
                  v-if="!uploading"
                  type="button"
                  class="file-remove"
                  aria-label="Remove file"
                  @click="onRemove(file)"
                >
                  <CloseOutlined />
                </button>
              </div>
              <a-progress 
                :percent="file.uploadProgress ?? 0" 
                :status="file.status === 'error' ? 'exception' : (file.status === 'success' || file.status === 'done') ? 'success' : (uploading ? 'active' : 'normal')"
                :show-info="true"
              />
            </div>
          </div>
        </div>

        <div class="actions">
          <a-button type="primary" @click="onSubmit" :loading="submitting" :disabled="fileList.length === 0">
            Submit
          </a-button>
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { API_BASE_URL } from '@/composables/useApiConfig'
import { useAuth } from '@/composables/useAuth'

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

const { getTokenValue, checkLoginStatus } = useAuth()

const fileList = ref<UploadFileItem[]>([])
const submitting = ref(false)
const uploading = ref(false)

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
const fetchBatchPresignedUrls = async (
  fileNames: string[],
  tokenValue: string
): Promise<{ 
  batchId: string; 
  entries: Array<{ fileName: string; sanitizedFileName: string; presignedUrl: string }> 
}> => {
  const response = await fetch(`${API_BASE_URL}/s3/folder/presigned-upload-url/benchmark-eval/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      satoken: tokenValue,
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

  return {
    batchId: result.data.batchId,
    entries: result.data.entries || []
  }
}

/**
 * Upload a single file to S3 using presigned URL
 */
const uploadFileToS3 = async (
  file: File, 
  presignedUrl: string, 
  onProgress: (progress: number) => void
): Promise<{ status: number; success: boolean }> => {
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
        resolve({ status: xhr.status, success: true })
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

const requireAuthToken = async (): Promise<string> => {
  let tokenValue = getTokenValue()
  if (tokenValue) {
    return tokenValue
  }

  await checkLoginStatus()
  tokenValue = getTokenValue()

  if (!tokenValue) {
    throw new Error('Please login to upload files')
  }

  return tokenValue
}

/**
 * Report successful upload to backend tracking system
 */
const reportUploadSuccess = async (
  batchId: string,
  sanitizedFileName: string,
  fileSize: number,
  tokenValue: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload-tracking/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        satoken: tokenValue,
      },
      credentials: 'include',
      body: JSON.stringify({
        batchId,
        sanitizedFileName,
        uploadStatus: 'SUCCESS',
        fileSize,
        httpStatusCode: 200
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to report success for ${sanitizedFileName}:`, errorText)
    }
  } catch (error) {
    console.error(`Error reporting success for ${sanitizedFileName}:`, error)
  }
}

/**
 * Report failed upload to backend tracking system
 */
const reportUploadFailure = async (
  batchId: string,
  sanitizedFileName: string,
  errorMessage: string,
  httpStatusCode: number | undefined,
  tokenValue: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload-tracking/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        satoken: tokenValue,
      },
      credentials: 'include',
      body: JSON.stringify({
        batchId,
        sanitizedFileName,
        uploadStatus: 'FAILED',
        errorMessage,
        errorCode: 'UPLOAD_ERROR',
        httpStatusCode: httpStatusCode || 500
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to report failure for ${sanitizedFileName}:`, errorText)
    }
  } catch (error) {
    console.error(`Error reporting failure for ${sanitizedFileName}:`, error)
  }
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

    // Ensure user is authenticated
    const tokenValue = await requireAuthToken()

    // Step 1: Get batch presigned URLs
    const fileNames = filesToUpload.map(item => item.name)
    
    const batchResponse = await fetchBatchPresignedUrls(fileNames, tokenValue)
    const batchId = batchResponse.batchId
    const presignedUrls = batchResponse.entries

    if (presignedUrls.length !== filesToUpload.length) {
      throw new Error('Mismatch between requested and received presigned URLs')
    }

    console.log(`Starting batch upload with batchId: ${batchId}`)

    // Create a map of file name to presigned URL entry
    const urlMap = new Map<string, typeof presignedUrls[0]>()
    presignedUrls.forEach(entry => {
      urlMap.set(entry.fileName, entry)
    })

    // Step 2: Upload each file and report status
    
    const uploadPromises = filesToUpload.map(async (fileItem) => {
      const presignedUrlEntry = urlMap.get(fileItem.name)
      if (!presignedUrlEntry) {
        throw new Error(`No presigned URL found for file: ${fileItem.name}`)
      }

      try {
        // Upload to S3
        const uploadResult = await uploadFileToS3(
          fileItem.file!,
          presignedUrlEntry.presignedUrl,
          (progress) => {
            fileItem.uploadProgress = progress
          }
        )
        
        fileItem.status = 'success'
        
        // Report success to backend tracking system
        await reportUploadSuccess(
          batchId,
          presignedUrlEntry.sanitizedFileName,
          fileItem.file!.size,
          tokenValue
        )
      } catch (error: any) {
        fileItem.status = 'error'
        
        // Report failure to backend tracking system
        const errorMessage = error.message || 'Unknown upload error'
        const httpStatusCode = error.status || undefined
        
        await reportUploadFailure(
          batchId,
          presignedUrlEntry.sanitizedFileName,
          errorMessage,
          httpStatusCode,
          tokenValue
        )
        
        throw error
      }
    })

    await Promise.allSettled(uploadPromises)

    // Check if all uploads succeeded
    const failedUploads = fileList.value.filter(f => f.status === 'error')
    if (failedUploads.length > 0) {
      message.error(`${failedUploads.length} file(s) failed to upload`)
      // Keep files in the list for retry
    } else {
      message.success('All files uploaded successfully!')
      // Keep uploaded files in the list.
      // The list will reset only when user closes the modal (destroy-on-close).
    }

  } catch (e: any) {
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
.file-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}
.file-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.file-remove:hover {
  border-color: #d1d5db;
  color: #374151;
  background: #f9fafb;
}
.actions { display:flex; justify-content:flex-end; margin-top:16px }
</style>


