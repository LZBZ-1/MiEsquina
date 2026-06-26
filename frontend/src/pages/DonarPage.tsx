import { useParams } from 'react-router-dom'
import { QrCode, Heart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DonarPage() {
  const { id } = useParams<{ id?: string }>()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600"
          >
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
              <QrCode size={32} className="text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Donar ahora</h1>
            <p className="mt-2 text-gray-600">
              {id
                ? `Estás apoyando al limpiador ${id.slice(0, 8)}...`
                : 'Escanea un QR o selecciona un limpiador para donar.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto (PEN)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[3, 5, 10].map((m) => (
                  <button
                    key={m}
                    className="rounded-xl border-2 border-gray-100 py-3 text-lg font-semibold text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                  >
                    S/ {m}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full rounded-xl bg-brand-500 py-3.5 text-base font-semibold text-white hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
              <Heart size={18} />
              Confirmar donación
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
