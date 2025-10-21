// Small fetch wrapper for API calls
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch (e) { data = text }

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'API error')
    err.status = res.status
    err.response = data
    throw err
  }
  return data
}

export async function loginApi(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

export async function signupApi(payload) {
  return apiFetch('/auth/signup', { method: 'POST', body: payload })
}

export default { apiFetch, loginApi, signupApi }
