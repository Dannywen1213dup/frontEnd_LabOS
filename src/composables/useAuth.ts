import { ref, computed } from 'vue'
import { API_BASE_URL } from './useApiConfig'

export interface LoginUser {
  id: number
  userName: string
  userAvatar: string
  userProfile: string
  userRole: string
  createTime: string
  updateTime: string
}

const currentUser = ref<LoginUser | null>(null)
const isLoading = ref(false)

export const useAuth = () => {
  /**
   * Check if user is logged in
   */
  const isLoggedIn = computed(() => currentUser.value !== null)

  /**
   * Get current user
   */
  const getUser = () => currentUser.value

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<LoginUser> => {
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Login failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || `Login failed: ${response.status}`
        } catch {
          errorMessage = `Login failed: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      if (result.code !== 0) {
        throw new Error(result.message || 'Login failed')
      }

      // Extract userProfile from AuthTokenResponse
      const userProfile = result.data?.userProfile
      if (!userProfile) {
        throw new Error('Invalid response format: userProfile not found')
      }

      currentUser.value = userProfile
      return userProfile
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    isLoading.value = true
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      currentUser.value = null
      isLoading.value = false
      // Clear any cookies
      document.cookie.split(';').forEach((c) => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
      })
    }
  }

  /**
   * Check current login status
   */
  const checkLoginStatus = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/get/login`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.code === 0 && result.data) {
          currentUser.value = result.data
        } else {
          currentUser.value = null
        }
      } else {
        currentUser.value = null
      }
    } catch (error) {
      console.error('Check login status error:', error)
      currentUser.value = null
    }
  }

  return {
    currentUser,
    isLoading,
    isLoggedIn,
    getUser,
    login,
    logout,
    checkLoginStatus,
  }
}

