<template>
  <section id="leaderboard" class="section-container">
    <div v-reveal class="section-content">
      <div class="title-row">
        <h2 class="section-title">Leaderboard</h2>
        <div class="view-switcher">
          <a-button
            :type="activeBoard === 'llm' ? 'primary' : 'default'"
            size="large"
            class="switch-btn left"
            @click="setBoard('llm')"
          >
            LLM Leaderboard
          </a-button>
          <a-button
            :type="activeBoard === 'contributors' ? 'primary' : 'default'"
            size="large"
            class="switch-btn right"
            @click="setBoard('contributors')"
          >
            Data Contributor Board
          </a-button>
        </div>
      </div>
      <p class="section-lead">
        <span v-if="activeBoard === 'llm'">Latest evaluations on LSV. Click headers to sort; search by model or team.</span>
        <span v-else>Data contributors to the LabOS benchmark. Click headers to sort; search by institution or labs.</span>
      </p>

      <div class="tools">
        <a-input-search
          v-model:value="searchQuery"
          :placeholder="activeBoard === 'llm' ? 'Search model or team…' : 'Search institution or labs…'"
          class="search-input"
          @search="handleSearch"
        />
      </div>

      <div class="table-container">
        <a-table
          :key="activeBoard"
          :columns="activeBoard === 'llm' ? columnsLlm : columnsContrib"
          :data-source="activeBoard === 'llm' ? filteredLlmData : filteredContributorData"
          :pagination="false"
          :scroll="{ x: activeBoard === 'llm' ? 1200 : 1400 }"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'score' && typeof record.score === 'number'">
              <span class="score-value">{{ record.score.toFixed(2) }}</span>
            </template>
            <template v-else-if="column.key === 'paper' && record.paper">
              <a :href="record.paper" target="_blank" rel="noopener noreferrer" class="link-cell">
                📄 Paper
              </a>
            </template>
            <template v-else-if="column.key === 'github' && record.github">
              <a :href="record.github" target="_blank" rel="noopener noreferrer" class="link-cell">
                🔗 Code
              </a>
            </template>
            <template v-else-if="column.key === 'evaluationDetails' && record.evaluationDetails">
              <div class="eval-details">
                <div>Protocol: {{ record.evaluationDetails.protocolAlignment?.toFixed(1) || 'N/A' }}</div>
                <div>Issues: {{ record.evaluationDetails.issueIdentification?.toFixed(1) || 'N/A' }}</div>
              </div>
            </template>
            <template v-else-if="column.key === 'website' && record.website">
              <a :href="record.website" target="_blank" rel="noopener noreferrer" class="link-cell">
                🌐 Website
              </a>
            </template>
            <template v-else-if="column.key === 'contact' && record.contact">
              <a :href="`mailto:${record.contact}`" class="link-cell">
                ✉️ {{ record.contact }}
              </a>
            </template>
          </template>
        </a-table>
      </div>

      <p class="note-text">
        Scores follow a 0–5 human‑expert rubric for protocol alignment and issue identification, 
        per the paper.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TableProps } from 'ant-design-vue'
import { vReveal } from '@/directives/reveal'

interface LeaderboardEntry {
  key: string
  rank: number
  model: string
  team: string
  score: number
  date: string
  paper?: string | null
  github?: string | null
  parameters?: string
  evaluationDetails?: {
    protocolAlignment?: number
    issueIdentification?: number
  }
}

interface ContributorEntry {
  key: string
  rank: number
  institution: string
  labs: string[]
  labCount: number
  protocolsCount?: number
  datasetsCount?: number
  contact?: string
  contributionDate?: string
  website?: string
  location?: string
}

type ActiveBoard = 'llm' | 'contributors'

const searchQuery = ref('')
const leaderboardData = ref<LeaderboardEntry[]>([])
const contributorData = ref<ContributorEntry[]>([])
const sortKey = ref<string>('rank')
const sortOrder = ref<'ascend' | 'descend'>('ascend')
const activeBoard = ref<ActiveBoard>('llm')

const setBoard = (board: ActiveBoard) => {
  // Reset sort state when switching boards
  sortKey.value = 'rank'
  sortOrder.value = 'ascend'
  // Clear search when switching
  searchQuery.value = ''
  activeBoard.value = board
}

const columnsLlm = computed<TableProps['columns']>(() => [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.rank - b.rank,
    width: 80,
    fixed: 'left' as const
  },
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.model.localeCompare(b.model),
    width: 180
  },
  {
    title: 'Team',
    dataIndex: 'team',
    key: 'team',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.team.localeCompare(b.team),
    width: 160
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.score - b.score,
    width: 100
  },
  {
    title: 'Parameters',
    dataIndex: 'parameters',
    key: 'parameters',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => {
      const aVal = a.parameters || 'Unknown'
      const bVal = b.parameters || 'Unknown'
      return aVal.localeCompare(bVal)
    },
    width: 120
  },
  {
    title: 'Evaluation Details',
    dataIndex: 'evaluationDetails',
    key: 'evaluationDetails',
    width: 160
  },
  {
    title: 'Paper',
    dataIndex: 'paper',
    key: 'paper',
    width: 100
  },
  {
    title: 'Code',
    dataIndex: 'github',
    key: 'github',
    width: 100
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => 
      new Date(a.date).getTime() - new Date(b.date).getTime(),
    width: 120
  }
])

const columnsContrib = computed<TableProps['columns']>(() => [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    sorter: (a: ContributorEntry, b: ContributorEntry) => a.rank - b.rank,
    width: 80,
    fixed: 'left' as const
  },
  {
    title: 'Institution',
    dataIndex: 'institution',
    key: 'institution',
    sorter: (a: ContributorEntry, b: ContributorEntry) => a.institution.localeCompare(b.institution),
    width: 180
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    sorter: (a: ContributorEntry, b: ContributorEntry) => (a.location || '').localeCompare(b.location || ''),
    width: 160
  },
  {
    title: 'Labs',
    dataIndex: 'labs',
    key: 'labs',
    customRender: ({ text }: any) => Array.isArray(text) ? text.join(', ') : text,
    sorter: (a: ContributorEntry, b: ContributorEntry) => (a.labs?.length || 0) - (b.labs?.length || 0),
    width: 200
  },
  {
    title: 'Lab Count',
    dataIndex: 'labCount',
    key: 'labCount',
    sorter: (a: ContributorEntry, b: ContributorEntry) => a.labCount - b.labCount,
    width: 100
  },
  {
    title: 'Protocols',
    dataIndex: 'protocolsCount',
    key: 'protocolsCount',
    sorter: (a: ContributorEntry, b: ContributorEntry) => (a.protocolsCount || 0) - (b.protocolsCount || 0),
    width: 100
  },
  {
    title: 'Datasets',
    dataIndex: 'datasetsCount',
    key: 'datasetsCount',
    sorter: (a: ContributorEntry, b: ContributorEntry) => (a.datasetsCount || 0) - (b.datasetsCount || 0),
    width: 100
  },
  {
    title: 'Contribution Date',
    dataIndex: 'contributionDate',
    key: 'contributionDate',
    sorter: (a: ContributorEntry, b: ContributorEntry) => 
      new Date(a.contributionDate || '').getTime() - new Date(b.contributionDate || '').getTime(),
    width: 140
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
    width: 180
  },
  {
    title: 'Website',
    dataIndex: 'website',
    key: 'website',
    width: 100
  }
])

const filteredLlmData = computed(() => {
  if (!searchQuery.value) {
    return leaderboardData.value
  }
  const query = searchQuery.value.toLowerCase()
  return leaderboardData.value.filter(item => 
    item.model.toLowerCase().includes(query) || 
    item.team.toLowerCase().includes(query)
  )
})

const filteredContributorData = computed(() => {
  if (!searchQuery.value) {
    return contributorData.value
  }
  const query = searchQuery.value.toLowerCase()
  return contributorData.value.filter(item =>
    item.institution.toLowerCase().includes(query) ||
    item.labs.join(', ').toLowerCase().includes(query)
  )
})

const handleSearch = () => {
  // 搜索功能已通过 computed 属性实现
}

const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter: any) => {
  if (sorter.columnKey) {
    sortKey.value = sorter.columnKey
    sortOrder.value = sorter.order || 'ascend'
  }
}

const loadLeaderboardData = async () => {
  try {
    const response = await fetch('/leaderboard.json', { cache: 'no-store' })
    const data = await response.json()
    leaderboardData.value = data.map((item: any, index: number) => ({
      key: `${index}`,
      ...item
    }))
  } catch (error) {
    // 使用 fallback 数据
    leaderboardData.value = [
      {
        key: '0',
        rank: 1,
        model: 'LabOS VLM-235B',
        team: 'Stanford–Princeton',
        score: 4.21,
        date: '2025-10-29'
      },
      {
        key: '1',
        rank: 2,
        model: 'Gemini 2.5 Pro',
        team: 'Google DeepMind',
        score: 2.86,
        date: '2025-10-25'
      },
      {
        key: '2',
        rank: 3,
        model: 'GPT-4o',
        team: 'OpenAI',
        score: 2.02,
        date: '2025-10-24'
      }
    ]
  }
}

const loadContributorData = async () => {
  try {
    const response = await fetch('/contributors.json', { cache: 'no-store' })
    const data = await response.json()
    // Sort by total contributions (protocols + datasets) descending, then by lab count
    const sorted = data
      .map((item: any) => ({
        ...item,
        totalContributions: (item.protocolsCount || 0) + (item.datasetsCount || 0)
      }))
      .sort((a: any, b: any) => {
        if (b.totalContributions !== a.totalContributions) {
          return b.totalContributions - a.totalContributions
        }
        return b.labCount - a.labCount
      })
    contributorData.value = sorted.map((item: any, index: number) => ({
      key: `${index}`,
      rank: index + 1,
      ...item
    }))
  } catch (error) {
    // Fallback to static data
    const source = [
      { institution: 'Stanford', labs: ['CongLab', 'WuLab', 'SLab'] },
      { institution: 'Princeton', labs: ['WangLab', 'WuLab', 'DLab'] },
      { institution: 'Oregon State University', labs: ['LLab'] },
      { institution: 'University of Washington', labs: ['SLab'] }
    ]
    contributorData.value = source.map((item, index) => ({
      key: `${index}`,
      rank: index + 1,
      institution: item.institution,
      labs: item.labs,
      labCount: item.labs.length
    }))
  }
}

onMounted(() => {
  loadLeaderboardData()
  loadContributorData()
})
</script>

<style scoped>
.section-container {
  padding: 72px 0;
  background: #f7f9ff;
}

.section-content {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 34px;
  margin: 0 0 18px;
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-switcher {
    width: 100%;
    justify-content: stretch;
    margin-bottom: 20px; /* 增加按钮和描述文字之间的距离 */
  }
  
  .switch-btn {
    flex: 1;
    font-size: 13px;
    padding: 8px 12px;
  }
  
  .section-lead {
    margin-top: 0; /* 移除负边距，增加间距 */
    margin-bottom: 24px;
  }
}

.view-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-btn.left {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.switch-btn.right {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.section-lead {
  font-size: 18px;
  color: #6b7280;
  margin-top: -6px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.tools {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.search-input {
  min-width: 260px;
  max-width: 400px;
  width: 100%;
}

@media (max-width: 768px) {
  .search-input {
    min-width: 100%;
    max-width: 100%;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .section-lead {
    font-size: 16px;
  }
}

.table-container {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
}

.table-container :deep(.ant-table) {
  font-family: inherit;
}

.table-container :deep(.ant-table-thead > tr > th) {
  background: #f8fafc;
  font-weight: 700;
  color: #111827;
  border-bottom: 1px solid #f1f5f9;
}

.table-container :deep(.ant-table-tbody > tr:nth-child(even)) {
  background: #fafafa;
}

.table-container :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f1f5f9;
}

.score-value {
  font-weight: 600;
  color: #4f46e5;
}

.link-cell {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.link-cell:hover {
  color: #6366f1;
  text-decoration: underline;
}

.eval-details {
  font-size: 12px;
  line-height: 1.5;
  color: #6b7280;
}

.eval-details div {
  margin: 2px 0;
}

.note-text {
  font-size: 14px;
  margin-top: 8px;
  color: #6b7280;
  line-height: 1.6;
}

/* 滚动动画 */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.on {
  opacity: 1;
  transform: none;
}
</style>

