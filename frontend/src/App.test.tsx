import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DonarPage from './pages/DonarPage'

describe('LandingPage', () => {
  it('renders headline and CTA buttons', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/Apoya a quienes/)).toBeInTheDocument()
    expect(screen.getAllByText('Donar ahora').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Descargar QR')).toBeInTheDocument()
  })
})

describe('DonarPage', () => {
  it('renders donate form', () => {
    render(
      <MemoryRouter initialEntries={['/donar']}>
        <DonarPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Donar ahora')).toBeInTheDocument()
    expect(screen.getByText('Confirmar donación')).toBeInTheDocument()
  })
})
