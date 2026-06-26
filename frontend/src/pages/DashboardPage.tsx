import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, clearAuth, type UserProfile } from '../lib/api'
import QRDisplay from '../components/QRDisplay'
import JornadaTracker from '../components/JornadaTracker'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const u = getUser()
    if (!u) {
      navigate('/login')
      return
    }
    setUser(u)
  }, [navigate])

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.foto_url ? (
              <img
                src={user.foto_url}
                alt={user.nombre}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {user.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-800">{user.nombre}</h1>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {user.qr_code && (
            <QRDisplay
              qrUrl={user.qr_code}
              workerName={user.nombre}
              workerId={user.id}
            />
          )}
          <JornadaTracker />
        </div>
      </main>
    </div>
  )
}
