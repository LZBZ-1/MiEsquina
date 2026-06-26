import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../Hero'

describe('Hero', () => {
  it('renders headline and subtitle', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    )
    expect(screen.getByText(/Apoya a quienes/)).toBeInTheDocument()
    expect(screen.getByText(/mantienen limpia/)).toBeInTheDocument()
    expect(
      screen.getByText(/Conectamos conductores con limpiadores/)
    ).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    )
    expect(screen.getByText('Donar ahora')).toBeInTheDocument()
    expect(screen.getByText('Descargar QR')).toBeInTheDocument()
  })
})
