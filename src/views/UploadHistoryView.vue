<template>
  <div class="upload-history-page-wrapper">
    <div class="upload-history-container">
      <button class="back-button" @click="goBack">← Back</button>
      
      <div class="header">
        <h1>Upload History</h1>
        <p class="subtitle">View your file upload history and batch information</p>
      </div>

    <div class="content">
      <a-spin :spinning="loading" size="large">
        <div v-if="!loading && batches.length === 0" class="empty-state">
          <a-empty description="No upload history found">
            <template #image>
              <inbox-outlined :style="{ fontSize: '64px', color: '#d9d9d9' }" />
            </template>
          </a-empty>
        </div>

        <div v-else class="batch-list">
          <a-card
            v-for="batch in batches"
            :key="batch.batchId"
            class="batch-card"
            :hoverable="true"
          >
            <div class="batch-header">
              <div class="batch-info">
                <h3 class="batch-title">
                  <folder-outlined class="icon" />
                  Batch Upload
                </h3>
                <div class="batch-meta">
                  <a-tag :color="getStatusColor(batch.batchStatus)">
                    {{ batch.batchStatus }}
                  </a-tag>
                  <span class="batch-id">ID: {{ batch.batchId }}</span>
                </div>
              </div>
              <div class="batch-stats">
                <div class="stat-item">
                  <span class="stat-label">Files</span>
                  <span class="stat-value">{{ batch.totalFiles }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Success</span>
                  <span class="stat-value success">{{ batch.successCount }}</span>
                </div>
                <div class="stat-item" v-if="batch.failedCount > 0">
                  <span class="stat-label">Failed</span>
                  <span class="stat-value error">{{ batch.failedCount }}</span>
                </div>
              </div>
            </div>

            <a-divider style="margin: 12px 0" />

            <div class="batch-details">
              <div class="detail-row" v-if="batch.fileNamesSummary">
                <file-text-outlined class="detail-icon" />
                <span class="detail-label">Files:</span>
                <span class="detail-value">{{ batch.fileNamesSummary }}</span>
              </div>
              <div class="detail-row">
                <clock-circle-outlined class="detail-icon" />
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ formatDate(batch.createdTime) }}</span>
              </div>
              <div class="detail-row" v-if="batch.completedTime">
                <check-circle-outlined class="detail-icon" />
                <span class="detail-label">Completed:</span>
                <span class="detail-value">{{ formatDate(batch.completedTime) }}</span>
              </div>
              <div class="detail-row" v-if="batch.folderType">
                <folder-open-outlined class="detail-icon" />
                <span class="detail-label">Folder:</span>
                <span class="detail-value">{{ batch.folderType }}</span>
              </div>
              <div class="detail-row" v-if="batch.successRate !== undefined">
                <percentage-outlined class="detail-icon" />
                <span class="detail-label">Success Rate:</span>
                <span class="detail-value">{{ batch.successRate }}%</span>
              </div>
            </div>
          </a-card>
        </div>

        <div v-if="!loading && batches.length > 0" class="pagination">
          <a-pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :show-size-changer="true"
            :show-total="(total) => `Total ${total} batches`"
            :page-size-options="['10', '20', '50', '100']"
            @change="handlePageChange"
            @show-size-change="handlePageSizeChange"
          />
        </div>
      </a-spin>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  FolderOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  PercentageOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'
import { API_BASE_URL } from '@/composables/useApiConfig'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()

interface BatchRecord {
  batchId: string
  userId: number
  folderType: string
  batchStatus: string
  totalFiles: number
  successCount: number
  failedCount: number
  pendingCount: number
  successRate: number
  createdTime: string
  completedTime: string | null
  fileNamesSummary?: string
  userName?: string
  userEmail?: string
}

const { getTokenValue, checkLoginStatus } = useAuth()

const loading = ref(false)
const batches = ref<BatchRecord[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    COMPLETED: 'success',
    IN_PROGRESS: 'processing',
    PENDING: 'default',
    FAILED: 'error',
    PARTIAL_SUCCESS: 'warning'
  }
  return colorMap[status] || 'default'
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchUploadHistory = async () => {
  loading.value = true
  try {
    // Ensure user is authenticated
    await checkLoginStatus()
    const tokenValue = getTokenValue()

    if (!tokenValue) {
      message.error('Please login to view upload history')
      return
    }

    const response = await fetch(`${API_BASE_URL}/upload-tracking/my-uploads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        satoken: tokenValue,
      },
      credentials: 'include',
      body: JSON.stringify({
        current: currentPage.value,
        pageSize: pageSize.value
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch upload history: ${response.status}`)
    }

    const result = await response.json()
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to fetch upload history')
    }

    batches.value = result.data.records || []
    total.value = result.data.total || 0

  } catch (error: any) {
    console.error('Error fetching upload history:', error)
    message.error(error.message || 'Failed to load upload history')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number, newPageSize: number) => {
  currentPage.value = page
  pageSize.value = newPageSize
  fetchUploadHistory()
}

const handlePageSizeChange = (current: number, size: number) => {
  currentPage.value = 1 // Reset to first page when page size changes
  pageSize.value = size
  fetchUploadHistory()
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchUploadHistory()
})
</script>

<style scoped>
.upload-history-page-wrapper {
  min-height: calc(100vh - 58px);
  background-color: #ffffff;
  padding: 0;
  width: 100%;
}

.upload-history-container {
  min-height: calc(100vh - 58px);
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 120px 40px 60px 40px;
}

.back-button {
  position: absolute;
  top: 32px;
  left: 32px;
  background: transparent;
  border: none;
  color: #6b7280;
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
  color: #374151;
  transform: translateX(-4px);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #1f2937;
}

.subtitle {
  font-size: 17px;
  color: #6b7280;
  margin: 0;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  background: white;
  border-radius: 12px;
  border: 1px solid #000000;
  padding: 60px 20px;
  text-align: center;
}

.batch-list {
  display: grid;
  gap: 20px;
}

.batch-card {
  border-radius: 12px;
  border: 1px solid #000000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.batch-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.batch-info {
  flex: 1;
}

.batch-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.batch-title .icon {
  color: #4b5563;
  font-size: 20px;
}

.batch-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.batch-id {
  font-size: 13px;
  color: #8c8c8c;
  font-family: monospace;
}

.batch-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
}

.stat-value.success {
  color: #52c41a;
}

.stat-value.error {
  color: #ff4d4f;
}

.batch-details {
  display: grid;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.detail-icon {
  color: #4b5563;
  font-size: 16px;
}

.detail-label {
  color: #8c8c8c;
  min-width: 90px;
}

.detail-value {
  color: #262626;
  font-weight: 500;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .upload-history-container {
    padding: 100px 24px 40px 24px;
  }

  .back-button {
    top: 20px;
    left: 20px;
    font-size: 16px;
    padding: 10px 12px;
  }

  .batch-header {
    flex-direction: column;
  }

  .batch-stats {
    width: 100%;
    justify-content: space-around;
  }

  .header h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .upload-history-container {
    padding: 80px 16px 32px 16px;
  }

  .back-button {
    top: 16px;
    left: 16px;
    font-size: 15px;
  }

  .header h1 {
    font-size: 24px;
  }
}
</style>

