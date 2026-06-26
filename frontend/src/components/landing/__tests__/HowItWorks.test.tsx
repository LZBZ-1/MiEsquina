import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HowItWorks from '../HowItWorks'

describe('HowItWorks', () => {
  it('renders section title', () => {
    render(<HowItWorks />)
    expect(screen.getByText('¿Cómo funciona?')).toBeInTheDocument()
  })

  it('renders 3 steps', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Escanea el QR')).toBeInTheDocument()
    expect(screen.getByText('Elige el monto')).toBeInTheDocument()
    expect(screen.getByText('Confirma el pago')).toBeInTheDocument()
  })

  it('renders step numbers', () => {
    render(<HowItWorks />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
