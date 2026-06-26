import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 bg-brand-500">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Haz la diferencia hoy
        </h2>
        <p className="mt-4 text-lg text-brand-100">
          Cada donación, por pequeña que sea, es un paso hacia una ciudad más justa
          para quienes trabajan en nuestras calles.
        </p>
        <div className="mt-10">
          <Link
            to="/donar"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-bold text-brand-600 shadow-lg hover:bg-brand-50 transition-colors"
          >
            <Heart size={22} />
            Donar ahora
          </Link>
        </div>
      </div>
    </section>
  )
}
