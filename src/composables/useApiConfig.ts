/**
 * Shared API configuration utility
 * API base URL configuration
 *
 * NOTE:
 * - If your backend is hosted under https://ai4labos.com/api, set base URL to that.
 * - All frontend API calls should be built as `${API_BASE_URL}/...`
 */

/**
 * Get the API base URL
 */
export const getApiBaseUrl = (): string => {
  return 'https://ai4labos.com/api'
}

/**
 * API base URL
 */
export const API_BASE_URL = 'https://ai4labos.com/api'


