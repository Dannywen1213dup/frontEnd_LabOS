/**
 * Shared API configuration utility
 * Uses relative path /api which is routed by nginx to the backend
 */

/**
 * Get the API base URL
 * Uses relative path since nginx routes /api to the backend
 */
export const getApiBaseUrl = (): string => {
  return '/api'
}

/**
 * API base URL - relative path routed by nginx
 */
export const API_BASE_URL = '/api'

