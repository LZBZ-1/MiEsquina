import { Mail, MapPin } from 'lucide-react'

const footerLinks = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Inicio', href: '#hero' },
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Donar', href: '/donar' },
    ],
  },
  {
    title: 'Para ti',
    links: [
      { label: 'Soy conductor', href: '#conductores' },
      { label: 'Soy limpiador', href: '#limpiadores' },
      { label: 'Registrarme', href: '/auth/register' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ME</span>
              </div>
              <span className="text-xl font-bold text-white">MiEsquina</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Conectamos conductores con limpiadores de parabrisas para crear un
              ecosistema de apoyo mutuo en cada esquina de la ciudad.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MiEsquina. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Mail size={14} />
              hola@miesquina.pe
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              Lima, Perú
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
