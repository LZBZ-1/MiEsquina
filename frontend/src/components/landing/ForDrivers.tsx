import { Car, Shield, Clock, HeartHandshake } from 'lucide-react'

const benefits = [
  {
    icon: Car,
    title: 'Encuentra limpiadores cercanos',
    description: 'Localiza fácilmente a limpiadores en las esquinas de tu ciudad.',
  },
  {
    icon: Shield,
    title: 'Pagos seguros',
    description: 'Todas las transacciones se procesan de forma segura con Culqi.',
  },
  {
    icon: Clock,
    title: 'Rápido y sencillo',
    description: 'Escanea, dona y listo. En menos de un minuto has apoyado a alguien.',
  },
  {
    icon: HeartHandshake,
    title: 'Impacto directo',
    description: 'Tu donación llega directamente al limpiador, sin intermediarios.',
  },
]

export default function ForDrivers() {
  return (
    <section id="conductores" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Para conductores
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Convierte cada parabrisas limpio en una oportunidad de apoyar a quienes
              lo necesitan.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <b.icon size={20} className="text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl bg-brand-50 border border-brand-100 flex items-center justify-center">
              <div className="text-center p-8">
                <Car size={64} className="mx-auto text-brand-400 mb-4" />
                <p className="text-lg font-semibold text-brand-700">
                  Tu apoyo marca la diferencia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
