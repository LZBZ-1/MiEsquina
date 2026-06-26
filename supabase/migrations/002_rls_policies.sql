-- Habilitar Row Level Security en la tabla
ALTER TABLE public.trabajadores ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede leer (SELECT)
CREATE POLICY "Allow public read access"
    ON public.trabajadores
    FOR SELECT
    USING (true);

-- Política: solo usuarios autenticados pueden insertar
CREATE POLICY "Allow authenticated insert"
    ON public.trabajadores
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Política: solo usuarios autenticados pueden actualizar sus propios registros
CREATE POLICY "Allow authenticated update own"
    ON public.trabajadores
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Política: solo usuarios autenticados pueden eliminar
CREATE POLICY "Allow authenticated delete"
    ON public.trabajadores
    FOR DELETE
    USING (auth.role() = 'authenticated');
