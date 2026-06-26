# Configuración de Supabase

## Variables de Entorno Requeridas

Asegúrate de configurar estas variables tanto en tu archivo `.env` local como en Railway:

```env
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_ANON_KEY=<tu-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
SUPABASE_JWT_SECRET=<tu-jwt-secret>
```

> **Nota:** Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` ni `SUPABASE_JWT_SECRET` en el frontend.

## Migraciones

Ejecuta las migraciones en orden en el **SQL Editor** de Supabase:

### 1. Crear tabla `trabajadores`

Ejecuta el contenido de `migrations/001_create_trabajadores.sql`.

**Estructura de la tabla:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `UUID` | Identificador único (PK) |
| `nombre` | `TEXT` | Nombre completo del trabajador |
| `foto_url` | `TEXT` | URL pública de la foto en Storage |
| `telefono` | `TEXT` | Número de contacto |
| `qr_code` | `TEXT` | Código o identificador del QR |
| `created_at` | `TIMESTAMPTZ` | Fecha de creación |

### 2. Configurar RLS Policies en la tabla

Ejecuta el contenido de `migrations/002_rls_policies.sql`.

### 3. Crear bucket de Storage para fotos

Ejecuta el contenido de `migrations/003_storage_bucket.sql`.

Esto creará un bucket público llamado `trabajadores-fotos` con políticas RLS para lectura pública y escritura solo para usuarios autenticados.

## Políticas RLS Configuradas

### Tabla `trabajadores`

| Operación | Acceso |
|-----------|--------|
| `SELECT` | Público (sin autenticación) |
| `INSERT` | Solo usuarios autenticados |
| `UPDATE` | Solo usuarios autenticados |
| `DELETE` | Solo usuarios autenticados |

### Bucket `trabajadores-fotos`

| Operación | Acceso |
|-----------|--------|
| `SELECT` (descargar/ver) | Público |
| `INSERT` (subir) | Solo usuarios autenticados |
| `UPDATE` | Solo usuarios autenticados |
| `DELETE` | Solo usuarios autenticados |

## Flujo de imágenes

1. El frontend o backend sube la imagen al bucket `trabajadores-fotos` usando el cliente de Supabase.
2. Supabase devuelve la ruta del archivo.
3. Se construye la URL pública: `https://<tu-proyecto>.supabase.co/storage/v1/object/public/trabajadores-fotos/<ruta>`.
4. Se guarda esa URL en el campo `foto_url` de la tabla `trabajadores`.

## Verificación

1. Intenta hacer `SELECT` en `trabajadores` sin autenticar (debería funcionar).
2. Intenta hacer `INSERT` sin autenticar (debería fallar).
3. Sube una imagen al bucket `trabajadores-fotos` como usuario autenticado.
4. Accede a la URL pública de la imagen sin autenticar (debería funcionar).

## Documentación Adicional

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
