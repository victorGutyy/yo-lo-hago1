import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { RUTAS } from '../constants'

// ── Skeleton de carga ────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  )
}

// ── Badge de estado ──────────────────────────────────────────────
function BadgeEstado({ activa }) {
  return activa ? (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Activa
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      Inactiva
    </span>
  )
}

// ── Card de estadística ──────────────────────────────────────────
function StatCard({ icono, valor, etiqueta, proximamente = false }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center">
      <span className="text-3xl mb-2" role="img" aria-hidden="true">
        {icono}
      </span>
      <span
        className={`text-2xl font-extrabold mb-1 ${
          proximamente ? 'text-gray-300' : 'text-green-800'
        }`}
      >
        {valor}
      </span>
      <span className="text-xs text-gray-500 leading-snug">{etiqueta}</span>
      {proximamente && (
        <span className="mt-1.5 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
          Próximamente
        </span>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { usuario, cargando: cargandoAuth, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [tarjeta, setTarjeta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [cerrandoSesion, setCerrandoSesion] = useState(false)
  const [copiado, setCopiado] = useState(false)

  // ── Protección de ruta ───────────────────────────────────────
  useEffect(() => {
    if (!cargandoAuth && !usuario) navigate(RUTAS.LOGIN, { replace: true })
  }, [usuario, cargandoAuth, navigate])

  // ── Cargar datos del trabajador ──────────────────────────────
  useEffect(() => {
    if (!usuario) return

    const cargarDatos = async () => {
      setCargando(true)
      setError('')
      try {
        // Perfil del trabajador — maybeSingle() devuelve null sin error si no existe
        const { data: perfilData, error: perfilError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', usuario.id)
          .maybeSingle()

        if (perfilError) throw perfilError
        setPerfil(perfilData ?? null)

        // Tarjeta laboral del trabajador
        const { data: tarjetaData, error: tarjetaError } = await supabase
          .from('tarjetas')
          .select('*')
          .eq('user_id', usuario.id)
          .maybeSingle()

        if (tarjetaError) throw tarjetaError
        setTarjeta(tarjetaData ?? null)
      } catch (err) {
        console.error('Dashboard error:', err)
        setError('No se pudieron cargar los datos. Recargá la página.')
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [usuario])

  // ── Cerrar sesión ────────────────────────────────────────────
  const handleCerrarSesion = async () => {
    setCerrandoSesion(true)
    await cerrarSesion()
    navigate(RUTAS.HOME, { replace: true })
  }

  const copiarEnlacePerfil = () => {
    const enlace = `${window.location.origin}/trabajadores/${usuario.id}`
    navigator.clipboard.writeText(enlace).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  // ── Guardar aquí mientras el auth aún carga ──────────────────
  if (cargandoAuth) return null

  const nombre = perfil?.nombre_completo || usuario?.user_metadata?.nombre_completo || 'trabajador/a'
  const primerNombre = nombre.split(' ')[0]

  // ── Guard: perfil aún no existe ─────────────────────────────
  if (!cargando && !perfil) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Perfil no encontrado</h2>
          <p className="text-sm text-gray-500 mb-5">
            No encontramos tu perfil en la base de datos. Puede haber ocurrido
            un error durante el registro.
          </p>
          <a
            href="/registro"
            className="inline-block bg-green-800 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-900 transition-colors text-sm"
          >
            Volver al registro
          </a>
        </div>
      </main>
    )
  }

  // ── Pantalla de carga ────────────────────────────────────────
  if (cargando) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── ENCABEZADO ────────────────────────────────────────── */}
        <div
          className="rounded-2xl text-white p-6 sm:p-8 shadow-md"
          style={{ background: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-green-300 text-sm mb-1">Panel del trabajador</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Hola, {primerNombre} 👋
              </h1>
              <p className="text-green-200 text-sm mt-1">
                {perfil?.oficio || 'Completá tu tarjeta laboral para aparecer en el portal'}
              </p>
            </div>
            <button
              onClick={handleCerrarSesion}
              disabled={cerrandoSesion}
              className="self-start sm:self-center flex-shrink-0 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-white border-opacity-30 disabled:opacity-60"
            >
              {cerrandoSesion ? 'Saliendo...' : 'Cerrar sesión'}
            </button>
          </div>
        </div>

        {/* Error global */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── TARJETA LABORAL ───────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Mi tarjeta laboral</h2>

          {tarjeta ? (
            /* ── Tarjeta existente ────────────────────────────── */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Encabezado de la card */}
              <div className="flex items-start gap-4 p-5 sm:p-6 border-b border-gray-100">
                {/* Foto */}
                <div className="flex-shrink-0">
                  {tarjeta.foto_url ? (
                    <img
                      src={tarjeta.foto_url}
                      alt={nombre}
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-800 truncate">{nombre}</h3>
                    <BadgeEstado activa={tarjeta.activa ?? true} />
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    {Array.isArray(tarjeta.oficios)
                      ? tarjeta.oficios.join(', ')
                      : tarjeta.oficios}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    📍 {perfil?.municipio || '—'} &nbsp;·&nbsp;
                    ⏱ {tarjeta.disponibilidad || '—'} &nbsp;·&nbsp;
                    🔨 {tarjeta.anos_experiencia ?? 0} año{tarjeta.anos_experiencia !== 1 ? 's' : ''} de experiencia
                  </p>
                </div>
              </div>

              {/* Descripción */}
              {tarjeta.descripcion && (
                <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {tarjeta.descripcion}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 p-5 sm:p-6">
                <Link
                  to={`/trabajadores/${usuario.id}`}
                  className="flex-1 text-center bg-green-800 text-white font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-green-900 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  Ver mi tarjeta pública →
                </Link>
                <Link
                  to={RUTAS.CREAR_TARJETA}
                  className="flex-1 text-center border-2 border-gray-200 text-gray-600 font-semibold text-sm py-2.5 px-4 rounded-xl hover:border-green-700 hover:text-green-800 active:scale-95 transition-all duration-200"
                >
                  ✏️ Editar tarjeta
                </Link>
                <button
                  onClick={copiarEnlacePerfil}
                  className="flex-1 text-center border-2 border-green-700 text-green-700 font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-green-50 active:scale-95 transition-all duration-200"
                >
                  {copiado ? '✅ ¡Copiado!' : '🔗 Compartir mi perfil'}
                </button>
              </div>
            </div>
          ) : (
            /* ── Sin tarjeta — CTA ────────────────────────────── */
            <div className="bg-white rounded-2xl border-2 border-dashed border-green-200 p-8 text-center">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Aún no tenés tarjeta laboral
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-sm mx-auto">
                Creá tu tarjeta gratis para que contratantes de todo Colombia
                puedan encontrarte y contactarte por WhatsApp.
              </p>
              <Link
                to={RUTAS.CREAR_TARJETA}
                className="inline-block bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-200 shadow-md text-base"
              >
                Crear mi tarjeta laboral →
              </Link>
            </div>
          )}
        </section>

        {/* ── ESTADÍSTICAS ──────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Mis estadísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icono="👁️"
              valor="—"
              etiqueta="Vistas del perfil"
              proximamente
            />
            <StatCard
              icono="💬"
              valor="—"
              etiqueta="Contactos recibidos"
              proximamente
            />
            <StatCard
              icono="✅"
              valor="Activa"
              etiqueta="Estado de la cuenta"
              proximamente={false}
            />
          </div>
        </section>

        {/* ── PERFIL DE USUARIO ─────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Mi perfil</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">Nombre</span>
                <p className="text-gray-800 font-medium mt-0.5">{perfil?.nombre_completo || '—'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">Correo</span>
                <p className="text-gray-800 font-medium mt-0.5 truncate">
                  {perfil?.email || usuario?.email || '—'}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">WhatsApp</span>
                <p className="text-gray-800 font-medium mt-0.5">{perfil?.telefono || '—'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">Municipio</span>
                <p className="text-gray-800 font-medium mt-0.5">{perfil?.municipio || '—'}</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link
                to={RUTAS.CREAR_TARJETA}
                className="inline-flex items-center gap-1.5 text-sm text-green-700 font-semibold hover:text-green-900 hover:underline transition-colors"
              >
                ✏️ Actualizar mis datos
              </Link>
            </div>
          </div>
        </section>

        {/* ── ACCESOS RÁPIDOS ───────────────────────────────────── */}
        <section className="pb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Accesos rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icono: '🏠', texto: 'Inicio', ruta: RUTAS.HOME },
              { icono: '👥', texto: 'Trabajadores', ruta: RUTAS.TRABAJADORES },
              { icono: '❓', texto: 'Cómo funciona', ruta: RUTAS.COMO_FUNCIONA },
              { icono: '📋', texto: tarjeta ? 'Editar tarjeta' : 'Crear tarjeta', ruta: RUTAS.CREAR_TARJETA },
            ].map(({ icono, texto, ruta }) => (
              <Link
                key={texto}
                to={ruta}
                className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center hover:border-green-200 hover:shadow-md active:scale-95 transition-all duration-200"
              >
                <span className="text-2xl mb-1.5" aria-hidden="true">{icono}</span>
                <span className="text-xs font-medium text-gray-600">{texto}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
