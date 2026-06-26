import { useState, useCallback } from 'react'
import { Download, Share2, Check } from 'lucide-react'

interface QRDisplayProps {
  qrUrl: string
  workerName: string
  workerId: string
}

export default function QRDisplay({ qrUrl, workerName, workerId }: QRDisplayProps) {
  const [copied, setCopied] = useState(false)
  const donateUrl = `${window.location.origin}/donar/${workerId}`

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qr-${workerName.replace(/\s+/g, '-').toLowerCase()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      // fallback: abrir imagen en nueva pestaña
      window.open(qrUrl, '_blank')
    }
  }, [qrUrl, workerName])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Donar a ${workerName}`,
          text: `Apoya a ${workerName} a través de MiEsquina`,
          url: donateUrl,
        })
      } catch {
        // usuario canceló
      }
    } else {
      await navigator.clipboard.writeText(donateUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [donateUrl, workerName])

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Tu código QR</h2>

      <div className="flex flex-col items-center">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <img
            src={qrUrl}
            alt={`QR de ${workerName}`}
            className="w-48 h-48 object-contain"
          />
        </div>

        <p className="text-sm text-gray-500 mb-4 text-center">
          Escanea este código para donar directamente
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={18} />
            Descargar PNG
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            {copied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
            {copied ? 'URL copiada' : 'Compartir URL'}
          </button>
        </div>
      </div>
    </div>
  )
}
