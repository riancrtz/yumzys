const BASE = import.meta.env.VITE_API_BASE_URL || ''

// Held in memory only. Never saved to disk, never baked into the build.
// Cleared automatically on page refresh, which is fine, the login form asks
// again.
let credentials = null

export function setCredentials(username, password) {
  credentials = { username, password }
}

export function clearCredentials() {
  credentials = null
}

async function request(path, options) {
  const headers = { 'Content-Type': 'application/json' }
  if (credentials) {
    headers.Authorization = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
  }

  const response = await fetch(`${BASE}${path}`, { headers, ...options })

  if (response.status === 401) {
    clearCredentials()
    const error = new Error('Login required')
    error.isAuthError = true
    throw error
  }

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      message = `${response.status} ${response.statusText}`
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listPlaces = () => request('/api/places')
export const getPlace = (id) => request(`/api/places/${id}`)
export const createPlace = (input) => request('/api/places', { method: 'POST', body: JSON.stringify(input) })
export const updatePlace = (id, input) => request(`/api/places/${id}`, { method: 'PUT', body: JSON.stringify(input) })
export const deletePlace = (id) => request(`/api/places/${id}`, { method: 'DELETE' })