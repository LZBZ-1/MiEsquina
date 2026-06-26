import { Link } from 'react-router-dom'
import { Heart, QrCode } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Apoya a quienes{' '}
              <span className="text-brand-500">mantienen limpia</span> tu ciudad
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Conectamos conductores con limpiadores de parabrisas. Escanea un QR, dona
              de forma segura y ayuda a quienes trabajan en cada esquina.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/donar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
              >
                <Heart size={20} />
                Donar ahora
              </Link>
              <a
                href="#limpiadores"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-600 border-2 border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-colors"
              >
                <QrCode size={20} />
                Descargar QR
              </a>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <div className="absolute inset-0 rounded-3xl bg-brand-100 rotate-3" />
              <div className="absolute inset-0 rounded-3xl bg-brand-200 -rotate-3" />
              <div className="relative h-full w-full rounded-3xl bg-white border border-gray-100 shadow-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mx-auto h-24 w-24 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
                    <QrCode size={48} className="text-brand-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    Escanea para donar
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    S/ 5.00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
