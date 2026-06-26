import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'

vi.mock('../lib/api', () => ({
  login: vi.fn(),
  saveAuth: vi.fn(),
}))

import { login, saveAuth } from '../lib/api'

describe('LoginPage', () => {
  it('renderiza los campos de email y contraseña', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })

  it('muestra errores de validación cuando los campos están vacíos', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument()
    })
  })

  it('muestra mensaje de error si el login falla', async () => {
    const mockedLogin = vi.mocked(login)
    mockedLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'))

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
    })
  })

  it('guarda auth y redirige tras login exitoso', async () => {
    const mockedLogin = vi.mocked(login)
    const authResponse = {
      access_token: 'token123',
      refresh_token: 'refresh123',
      expires_in: 3600,
      user: {
        id: '1',
        email: 'test@test.com',
        nombre: 'Test',
      },
    }
    mockedLogin.mockResolvedValueOnce(authResponse)

    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(saveAuth).toHaveBeenCalledWith(authResponse)
    })
  })
})
