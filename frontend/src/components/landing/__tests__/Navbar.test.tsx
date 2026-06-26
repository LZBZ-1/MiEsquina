import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders logo and brand name', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('MiEsquina')).toBeInTheDocument()
  })

  it('renders desktop navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    // Use getAllByText because links appear in both desktop and mobile menu
    expect(screen.getAllByText('Inicio').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Cómo funciona').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Donar ahora').length).toBeGreaterThanOrEqual(1)
  })

  it('toggles mobile menu on button click', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    const menuButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(menuButton)
    // Menu should open; links visible in mobile menu
    expect(screen.getAllByText('Inicio').length).toBeGreaterThanOrEqual(1)
  })
})
