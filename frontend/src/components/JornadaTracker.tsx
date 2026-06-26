import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Play, Square, Clock, MapPin } from 'lucide-react'
import { iniciarJornada, finalizarJornada, getJornadaActiva, type Jornada } from '../lib/api'

const schema = z.object({
  interseccion: z.string().min(1, 'Ingresa la intersección'),
})

type JornadaFormData = z.infer<typeof schema>

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function JornadaTracker() {
  const [jornada, setJornada] = useState<Jornada | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JornadaFormData>({
    resolver: zodResolver(schema),
  })

  // Cargar jornada activa al montar
  useEffect(() => {
    let mounted = true
    getJornadaActiva().then((data) => {
      if (mounted && data) {
        setJornada(data)
      }
    }).catch(() => {
      // no hay jornada activa, es normal
    })
    return () => {
      mounted = false
    }
  }, [])

  // Cronómetro
  useEffect(() => {
    if (jornada && !jornada.fin) {
      const start = new Date(jornada.inicio).getTime()
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - start)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setElapsed(0)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [jornada])

  const onIniciar = async (data: JornadaFormData) => {
    setError(null)
    setLoading(true)
    try {
      const nueva = await iniciarJornada(data.interseccion)
      setJornada(nueva)
      reset()
    } catch (err: any) {
      setError(err.message || 'Error al iniciar jornada')
    } finally {
      setLoading(false)
    }
  }

  const onFinalizar = async () => {
    setError(null)
    setLoading(true)
    try {
      const finalizada = await finalizarJornada()
      setJornada(finalizada)
    } catch (err: any) {
      setError(err.message || 'Error al finalizar jornada')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Jornada laboral</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {jornada && !jornada.fin ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-blue-600" />
            <span>{jornada.interseccion}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-blue-600" />
            <span>Inicio: {new Date(jornada.inicio).toLocaleTimeString()}</span>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Tiempo transcurrido</p>
            <p className="text-3xl font-mono font-bold text-blue-800 mt-1">{formatElapsed(elapsed)}</p>
          </div>

          <button
            onClick={onFinalizar}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Square size={18} />
            {loading ? 'Finalizando...' : 'Finalizar jornada'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onIniciar)} className="space-y-4">
          <div>
            <label htmlFor="interseccion" className="block text-sm font-medium text-gray-700 mb-1">
              Intersección
            </label>
            <input
              id="interseccion"
              type="text"
              {...register('interseccion')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Ej: Av. Arequipa con Javier Prado"
            />
            {errors.interseccion && (
              <p className="mt-1 text-sm text-red-600">{errors.interseccion.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Play size={18} />
            {loading ? 'Iniciando...' : 'Iniciar jornada'}
          </button>
        </form>
      )}
    </div>
  )
}
