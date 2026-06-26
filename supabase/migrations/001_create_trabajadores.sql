-- Crear tabla trabajadores
CREATE TABLE IF NOT EXISTS public.trabajadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    foto_url TEXT,
    telefono TEXT,
    qr_code TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Comentarios de documentación
COMMENT ON TABLE public.trabajadores IS 'Tabla de trabajadores registrados en la plataforma';
COMMENT ON COLUMN public.trabajadores.id IS 'Identificador único UUID';
COMMENT ON COLUMN public.trabajadores.nombre IS 'Nombre completo del trabajador';
COMMENT ON COLUMN public.trabajadores.foto_url IS 'URL pública de la foto almacenada en Supabase Storage (bucket trabajadores-fotos)';
COMMENT ON COLUMN public.trabajadores.telefono IS 'Número de teléfono de contacto';
COMMENT ON COLUMN public.trabajadores.qr_code IS 'Código o identificador del QR asociado al trabajador';
COMMENT ON COLUMN public.trabajadores.created_at IS 'Fecha y hora de creación del registro';
