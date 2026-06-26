-- Crear tabla donaciones
CREATE TABLE IF NOT EXISTS public.donaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trabajador_id UUID NOT NULL REFERENCES public.trabajadores(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Comentarios
COMMENT ON TABLE public.donaciones IS 'Registro de donaciones realizadas a los trabajadores';
COMMENT ON COLUMN public.donaciones.monto IS 'Monto donado en PEN';
COMMENT ON COLUMN public.donaciones.metodo_pago IS 'Método de pago utilizado';
COMMENT ON COLUMN public.donaciones.estado IS 'Estado de la donación: pendiente, exitoso, fallido';

-- RLS
ALTER TABLE public.donaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read donaciones"
    ON public.donaciones
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert donaciones"
    ON public.donaciones
    FOR INSERT
    WITH CHECK (true);
