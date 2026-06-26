import { Link } from 'react-router-dom'
import { UserPlus, TrendingUp, QrCode, Banknote } from 'lucide-react'

const benefits = [
  {
    icon: UserPlus,
    title: 'Regístrate gratis',
    description: 'Crea tu perfil en minutos con tu nombre, foto y datos de contacto.',
  },
  {
    icon: QrCode,
    title: 'Recibe tu QR único',
    description: 'Generamos automáticamente un código QR vinculado a tu perfil.',
  },
  {
    icon: TrendingUp,
    title: 'Aumenta tus ingresos',
    description: 'Recibe donaciones directas de conductores que valoran tu trabajo.',
  },
  {
    icon: Banknote,
    title: 'Sin comisiones ocultas',
    description: 'Solo aplica la comisión de la pasarela de pago. Todo transparente.',
  },
]

export default function ForCleaners() {
  return (
    <section id="limpiadores" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl bg-brand-500 flex items-center justify-center">
              <div className="text-center p-8 text-white">
                <QrCode size={64} className="mx-auto mb-4 text-brand-100" />
                <p className="text-lg font-semibold">Tu QR, tu ingreso</p>
                <p className="mt-2 text-sm text-brand-100">
                  Cada escaneo es una oportunidad
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Para limpiadores
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Únete a MiEsquina y comienza a recibir donaciones digitales de forma
              sencilla y segura.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                    <b.icon size={20} className="text-brand-600" />
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

            <div className="mt-10">
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
              >
                <UserPlus size={20} />
                Regístrate gratis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
