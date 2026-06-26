import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'

vi.mock('../lib/api', () => ({
  register: vi.fn(),
  uploadPhoto: vi.fn(),
}))

import { register, uploadPhoto } from '../lib/api'

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza todos los campos del formulario', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/foto de perfil/i)).toBeInTheDocument()
  })

  it('muestra errores de validación cuando los campos están vacíos', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument()
      expect(screen.getByText(/confirma tu contraseña/i)).toBeInTheDocument()
      expect(screen.getByText(/la foto es obligatoria/i)).toBeInTheDocument()
    })
  })

  it('muestra error cuando las contraseñas no coinciden', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password456')
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    })
  })

  it('muestra preview de foto al seleccionar archivo', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    const file = new File(['dummy'], 'photo.png', { type: 'image/png' })
    const input = screen.getByLabelText(/foto de perfil/i)
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByAltText(/preview/i)).toBeInTheDocument()
    })
  })

  it('registra usuario y guarda token', async () => {
    const mockedUpload = vi.mocked(uploadPhoto)
    mockedUpload.mockResolvedValueOnce('https://example.com/photo.png')

    const mockedRegister = vi.mocked(register)
    mockedRegister.mockResolvedValueOnce({
      access_token: 'token123',
      refresh_token: 'refresh123',
      expires_in: 3600,
      user: {
        id: '1',
        email: 'test@test.com',
        nombre: 'Test',
      },
    })

    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/nombre completo/i), 'Test User')
    await user.type(screen.getByLabelText(/email/i), 'test@test.com')
    await user.type(screen.getByLabelText(/teléfono/i), '999999999')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123')

    const file = new File(['dummy'], 'photo.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText(/foto de perfil/i), file)

    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toBe('token123')
    })
  })
})
