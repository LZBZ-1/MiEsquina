-- Crear tabla jornadas
CREATE TABLE IF NOT EXISTS public.jornadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trabajador_id UUID NOT NULL REFERENCES public.trabajadores(id) ON DELETE CASCADE,
    interseccion TEXT NOT NULL,
    inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
    fin TIMESTAMPTZ,
    ingreso_estimado DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Comentarios
COMMENT ON TABLE public.jornadas IS 'Registro de jornadas laborales de los trabajadores';
COMMENT ON COLUMN public.jornadas.interseccion IS 'Ubicación donde el trabajador inicia su jornada';
COMMENT ON COLUMN public.jornadas.inicio IS 'Timestamp de inicio de jornada';
COMMENT ON COLUMN public.jornadas.fin IS 'Timestamp de fin de jornada (NULL mientras está activa)';
COMMENT ON COLUMN public.jornadas.ingreso_estimado IS 'Ingreso estimado de la jornada';

-- RLS
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow worker read own jornadas"
    ON public.jornadas
    FOR SELECT
    USING (auth.uid() = trabajador_id);

CREATE POLICY "Allow worker insert own jornadas"
    ON public.jornadas
    FOR INSERT
    WITH CHECK (auth.uid() = trabajador_id);

CREATE POLICY "Allow worker update own jornadas"
    ON public.jornadas
    FOR UPDATE
    USING (auth.uid() = trabajador_id)
    WITH CHECK (auth.uid() = trabajador_id);
