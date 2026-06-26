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

export interface UserProfile {
  id: string
  email: string
  nombre: string
  telefono?: string
  foto_url?: string
  qr_code?: string
  created_at?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: UserProfile
}

export interface Jornada {
  id: string
  trabajador_id: string
  interseccion: string
  inicio: string
  fin?: string
  ingreso_estimado?: number
  created_at?: string
}

function getToken(): string | null {
  return localStorage.getItem('access_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
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

export async function getMe(): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: authHeaders(),
  })
  return handleResponse<UserProfile>(res)
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

export async function iniciarJornada(interseccion: string): Promise<Jornada> {
  const res = await fetch(`${API_URL}/api/jornadas/iniciar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ interseccion }),
  })
  return handleResponse<Jornada>(res)
}

export async function finalizarJornada(): Promise<Jornada> {
  const res = await fetch(`${API_URL}/api/jornadas/finalizar`, {
    method: 'POST',
    headers: authHeaders(),
  })
  return handleResponse<Jornada>(res)
}

export async function getJornadaActiva(): Promise<Jornada | null> {
  const res = await fetch(`${API_URL}/api/jornadas/activa`, {
    headers: authHeaders(),
  })
  if (res.status === 404) return null
  return handleResponse<Jornada>(res)
}

// Auth helpers
export function saveAuth(auth: AuthResponse) {
  localStorage.setItem('access_token', auth.access_token)
  localStorage.setItem('refresh_token', auth.refresh_token)
  localStorage.setItem('user', JSON.stringify(auth.user))
}

export function getUser(): UserProfile | null {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

export function clearAuth() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}
