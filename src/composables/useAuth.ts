import { ref, computed } from 'vue'
import { API_BASE_URL } from './useApiConfig'

export interface LoginUser {
  id: number
  userName: string
  userAvatar: string
  userProfile: string
  userRole: string
  email: string
  createTime: string
  updateTime: string
}

interface AuthTokenPayload {
  tokenName: string
  tokenValue: string
}

const TOKEN_STORAGE_KEY = 'labos_satoken'

const readStoredToken = (): AuthTokenPayload | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthTokenPayload) : null
  } catch {
    return null
  }
}

const persistToken = (token: AuthTokenPayload | null) => {
  if (typeof window === 'undefined') {
    return
  }
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token))
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

const currentUser = ref<LoginUser | null>(null)
const isLoading = ref(false)
const authToken = ref<AuthTokenPayload | null>(readStoredToken())

const setAuthToken = (token: AuthTokenPayload | null) => {
  authToken.value = token
  persistToken(token)
}

const getTokenValue = () => authToken.value?.tokenValue

const fetchUserInfoByToken = async (tokenValue: string): Promise<LoginUser> => {
  const response = await fetch(`${API_BASE_URL}/auth/user-info`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      satoken: tokenValue,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  const result = await response.json()
  if (result.code !== 0 || !result.data) {
    throw new Error(result.message || 'Failed to fetch user info')
  }

  currentUser.value = result.data
  return result.data
}

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

      const tokenValue = result.data?.tokenValue
      const tokenName = result.data?.tokenName || 'satoken'
      if (!tokenValue) {
        throw new Error('Token not found in response')
      }

      setAuthToken({ tokenName, tokenValue })
      currentUser.value = userProfile

      try {
        const latestProfile = await fetchUserInfoByToken(tokenValue)
        return latestProfile
      } catch (infoError) {
        console.warn('Failed to refresh user info after login', infoError)
      return userProfile
      }
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
      const headers: Record<string, string> = {}
      const tokenValue = getTokenValue()
      if (tokenValue) {
        headers.satoken = tokenValue
      }
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers,
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      currentUser.value = null
      isLoading.value = false
      setAuthToken(null)
      // Clear any cookies
      if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach((c) => {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
      })
      }
    }
  }

  /**
   * Check current login status
   */
  const checkLoginStatus = async (): Promise<void> => {
    const tokenValue = getTokenValue()
    if (!tokenValue) {
          currentUser.value = null
      return
    }

    try {
      await fetchUserInfoByToken(tokenValue)
    } catch (error) {
      console.error('Check login status error:', error)
      setAuthToken(null)
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
    getTokenValue,
  }
}

