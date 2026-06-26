import { ScanLine, Wallet, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: ScanLine,
    title: 'Escanea el QR',
    description:
      'Cuando un limpiador atienda tu vehículo, escanea el código QR que lleva consigo.',
  },
  {
    icon: Wallet,
    title: 'Elige el monto',
    description:
      'Selecciona cuánto deseas donar. Desde S/ 1 hasta el monto que quieras aportar.',
  },
  {
    icon: CheckCircle,
    title: 'Confirma el pago',
    description:
      'Paga de forma segura con Culqi en segundos. El limpiador recibe tu apoyo directamente.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tres pasos simples para apoyar a quienes mantienen limpias nuestras calles.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
                <step.icon size={28} className="text-brand-500" />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:mb-4 md:flex md:justify-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
