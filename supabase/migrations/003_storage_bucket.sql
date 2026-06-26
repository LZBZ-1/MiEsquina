-- Crear bucket público para fotos de trabajadores
INSERT INTO storage.buckets (id, name, public)
VALUES ('trabajadores-fotos', 'trabajadores-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Política: lectura pública para cualquiera
CREATE POLICY "Allow public read on trabajadores-fotos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'trabajadores-fotos');

-- Política: inserción solo para usuarios autenticados
CREATE POLICY "Allow authenticated upload on trabajadores-fotos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trabajadores-fotos');

-- Política: actualización solo para usuarios autenticados
CREATE POLICY "Allow authenticated update on trabajadores-fotos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'trabajadores-fotos')
WITH CHECK (bucket_id = 'trabajadores-fotos');

-- Política: eliminación solo para usuarios autenticados
CREATE POLICY "Allow authenticated delete on trabajadores-fotos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'trabajadores-fotos');
