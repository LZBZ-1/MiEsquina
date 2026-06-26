import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const navLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Conductores', href: '#conductores' },
  { label: 'Limpiadores', href: '#limpiadores' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ME</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MiEsquina</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Crear cuenta
            </Link>
            <Link
              to="/donar"
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Donar ahora
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-300',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="block text-base font-medium text-gray-600 hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block text-base font-medium text-gray-600 hover:text-brand-600"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Crear cuenta
          </Link>
          <Link
            to="/donar"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Donar ahora
          </Link>
        </div>
      </div>
    </nav>
  )
}
