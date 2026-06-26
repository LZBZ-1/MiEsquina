const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  nombre: string
  email: string
  telefono: string
  password: string
  foto_url: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: {
    id: string
    email: string
    nombre: string
    telefono?: string
    foto_url?: string
    qr_code?: string
    created_at?: string
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || data.message || `Error ${res.status}`)
  }
  return res.json()
}

export async function login(body: LoginInput): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleResponse<AuthResponse>(res)
}

export async function register(body: RegisterInput): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleResponse<AuthResponse>(res)
}

export async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await handleResponse<{ url: string }>(res)
  return data.url
}
