import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { RUTAS } from '../constants'

// ── Badge de estado del reporte ───────────────────────────────────
function BadgeEstado({ estado }) {
  const estilos = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    revisado: 'bg-green-100 text-green-800',
    descartado: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${estilos[estado] ?? estilos.pendiente}`}>
      {estado}
    </span>
  )
}

export default function Admin() {
  const { usuario, cargando: cargandoAuth } = useAuth()
  const navigate = useNavigate()

  const [esAdmin, setEsAdmin] = useState(null) // null = aún no se sabe
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(null) // id del reporte en acción

  // ── Protección de ruta: requiere sesión ─────────────────────────
  useEffect(() => {
    if (!cargandoAuth && !usuario) navigate(RUTAS.LOGIN, { replace: true })
  }, [usuario, cargandoAuth, navigate])

  // ── Verificar que sea admin + cargar reportes ───────────────────
  useEffect(() => {
    if (!usuario) return

    const cargar = async () => {
      setCargando(true)
      setError('')
      try {
        const { data: perfilData, error: perfilError } = await supabase
          .from('profiles')
          .select('es_admin')
          .eq('id', usuario.id)
          .maybeSingle()

        if (perfilError) throw perfilError
        if (!perfilData?.es_admin) {
          setEsAdmin(false)
          return
        }
        setEsAdmin(true)

        // La RLS ya restringe esta consulta solo a administradores
        const { data: reportesData, error: reportesError } = await supabase
          .from('reportes')
          .select('*, tarjetas(id, oficios, activa, profiles(nombre_completo, municipio))')
          .order('created_at', { ascending: false })

        if (reportesError) throw reportesError
        setReportes(reportesData ?? [])
      } catch (err) {
        console.error('Admin error:', err)
        setError('No se pudieron cargar los reportes. Recargá la página.')
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [usuario])

  // ── Acciones sobre un reporte ────────────────────────────────────
  const actualizarReporte = async (id, cambios) => {
    setProcesando(id)
    try {
      const { error: updError } = await supabase.from('reportes').update(cambios).eq('id', id)
      if (updError) throw updError
      setReportes((prev) => prev.map((r) => (r.id === id ? { ...r, ...cambios } : r)))
    } catch (err) {
      console.error('Actualizar reporte error:', err)
      setError('No se pudo actualizar el reporte. Intentá de nuevo.')
    } finally {
      setProcesando(null)
    }
  }

  const desactivarTarjeta = async (reporte) => {
    if (!reporte.tarjetas?.id) return
    setProcesando(reporte.id)
    try {
      const { error: tarjetaError } = await supabase
        .from('tarjetas')
        .update({ activa: false })
        .eq('id', reporte.tarjetas.id)
      if (tarjetaError) throw tarjetaError

      const { error: repError } = await supabase
        .from('reportes')
        .update({ estado: 'revisado' })
        .eq('id', reporte.id)
      if (repError) throw repError

      setReportes((prev) =>
        prev.map((r) =>
          r.id === reporte.id
            ? { ...r, estado: 'revisado', tarjetas: { ...r.tarjetas, activa: false } }
            : r
        )
      )
    } catch (err) {
      console.error('Desactivar tarjeta error:', err)
      setError('No se pudo desactivar la tarjeta. Intentá de nuevo.')
    } finally {
      setProcesando(null)
    }
  }

  // ── Estados de carga / acceso ────────────────────────────────────
  if (cargandoAuth || cargando || esAdmin === null) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (esAdmin === false) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Acceso restringido</h2>
          <p className="text-gray-500 text-sm mb-6">Esta sección es solo para administradores.</p>
          <Link
            to={RUTAS.HOME}
            className="inline-block bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-900 transition-colors text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  const pendientes = reportes.filter((r) => r.estado === 'pendiente')
  const resueltos = reportes.filter((r) => r.estado !== 'pendiente')

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Panel de administración</h1>
        <p className="text-sm text-gray-500 mb-8">Reportes de perfiles enviados por visitantes</p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
          Pendientes ({pendientes.length})
        </h2>

        {pendientes.length === 0 ? (
          <p className="text-sm text-gray-400 mb-8">No hay reportes pendientes. 🎉</p>
        ) : (
          <div className="space-y-3 mb-10">
            {pendientes.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {r.tarjetas?.profiles?.nombre_completo ?? 'Trabajador eliminado'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.tarjetas?.profiles?.municipio} · {(r.tarjetas?.oficios || []).join(', ')}
                    </p>
                  </div>
                  <BadgeEstado estado={r.estado} />
                </div>

                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Motivo:</span> {r.motivo}
                </p>
                {r.comentario && (
                  <p className="text-sm text-gray-600 mb-3">"{r.comentario}"</p>
                )}
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(r.created_at).toLocaleString('es-CO')}
                </p>

                <div className="flex flex-wrap gap-2">
                  {r.tarjetas?.activa && (
                    <button
                      onClick={() => desactivarTarjeta(r)}
                      disabled={procesando === r.id}
                      className="text-xs font-semibold bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
                    >
                      Desactivar tarjeta
                    </button>
                  )}
                  <button
                    onClick={() => actualizarReporte(r.id, { estado: 'revisado' })}
                    disabled={procesando === r.id}
                    className="text-xs font-semibold bg-green-800 text-white px-3 py-2 rounded-lg hover:bg-green-900 disabled:opacity-60"
                  >
                    Marcar revisado
                  </button>
                  <button
                    onClick={() => actualizarReporte(r.id, { estado: 'descartado' })}
                    disabled={procesando === r.id}
                    className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-60"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {resueltos.length > 0 && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
              Resueltos ({resueltos.length})
            </h2>
            <div className="space-y-2">
              {resueltos.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-3 opacity-70"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {r.tarjetas?.profiles?.nombre_completo ?? 'Trabajador eliminado'}
                    </p>
                    <p className="text-xs text-gray-500">{r.motivo}</p>
                  </div>
                  <BadgeEstado estado={r.estado} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
