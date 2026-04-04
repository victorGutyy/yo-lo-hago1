import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import { OFICIOS, MUNICIPIOS } from '../constants'
import WorkerCard from '../components/cards/WorkerCard'

// Skeleton de tarjeta en carga
function WorkerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-gray-200 rounded-full w-20" />
        <div className="h-5 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="h-9 bg-gray-200 rounded-xl mt-2" />
    </div>
  )
}

export default function Workers() {
  const [tarjetas, setTarjetas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [filtroOficio, setFiltroOficio] = useState('')
  const [filtroMunicipio, setFiltroMunicipio] = useState('')

  // ── Cargar tarjetas activas con datos del perfil ─────────────
  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      setError('')
      try {
        const { data, error: dbError } = await supabase
          .from('tarjetas')
          .select('*, profiles(nombre_completo, telefono, municipio, foto_url)')
          .eq('activa', true)
          .order('created_at', { ascending: false })

        if (dbError) throw dbError
        setTarjetas(data ?? [])
      } catch (err) {
        console.error('Workers error:', err)
        setError('No se pudo cargar el listado. Intentá recargar la página.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  // ── Filtrado en el cliente ────────────────────────────────────
  const resultados = useMemo(() => {
    return tarjetas.filter((t) => {
      const oficios = Array.isArray(t.oficios) ? t.oficios : []
      const municipio = t.profiles?.municipio ?? ''

      const pasaOficio = !filtroOficio || oficios.includes(filtroOficio)
      const pasaMunicipio = !filtroMunicipio || municipio === filtroMunicipio
      return pasaOficio && pasaMunicipio
    })
  }, [tarjetas, filtroOficio, filtroMunicipio])

  const limpiarFiltros = () => {
    setFiltroOficio('')
    setFiltroMunicipio('')
  }

  const hayFiltros = filtroOficio || filtroMunicipio

  return (
    <main>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section
        className="relative text-white py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)' }}
      >
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 drop-shadow">
            Trabajadores disponibles
          </h1>
          <p className="text-green-100 text-sm sm:text-base max-w-xl mx-auto">
            Encontrá al profesional que necesitás, contactalo directo por
            WhatsApp y acordá el trabajo sin intermediarios.
          </p>
        </div>
      </section>

      {/* ── FILTROS ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Select oficio */}
          <select
            value={filtroOficio}
            onChange={(e) => setFiltroOficio(e.target.value)}
            className="campo flex-1 bg-white text-sm"
          >
            <option value="">Todos los oficios</option>
            {OFICIOS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          {/* Select municipio */}
          <select
            value={filtroMunicipio}
            onChange={(e) => setFiltroMunicipio(e.target.value)}
            className="campo flex-1 bg-white text-sm"
          >
            <option value="">Todos los municipios</option>
            {MUNICIPIOS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Botón limpiar */}
          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="flex-shrink-0 border-2 border-gray-300 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:border-red-300 hover:text-red-600 active:scale-95 transition-all duration-200"
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {/* ── CONTENIDO ────────────────────────────────────────────── */}
      <section className="py-8 px-4 bg-gray-50 min-h-[50vh]">
        <div className="max-w-5xl mx-auto">

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Contador de resultados */}
          {!cargando && !error && (
            <p className="text-sm text-gray-500 mb-5">
              {resultados.length === 0
                ? 'No se encontraron trabajadores'
                : `Mostrando ${resultados.length} trabajador${resultados.length !== 1 ? 'es' : ''}`}
              {hayFiltros && (
                <span className="ml-1 text-green-700 font-medium">
                  con los filtros aplicados
                </span>
              )}
            </p>
          )}

          {/* Skeletons de carga */}
          {cargando && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <WorkerCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Grid de tarjetas */}
          {!cargando && resultados.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resultados.map((tarjeta) => (
                <WorkerCard key={tarjeta.id} tarjeta={tarjeta} />
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {!cargando && resultados.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                No se encontraron trabajadores
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                {hayFiltros
                  ? 'Intentá con otros filtros o limpiá la búsqueda.'
                  : 'Aún no hay trabajadores registrados. ¡Sé el primero!'}
              </p>
              {hayFiltros ? (
                <button
                  onClick={limpiarFiltros}
                  className="inline-block border-2 border-green-800 text-green-800 font-semibold px-6 py-2.5 rounded-xl hover:bg-green-800 hover:text-white transition-all duration-200 text-sm"
                >
                  Limpiar filtros
                </button>
              ) : (
                <a
                  href="/registro"
                  className="inline-block bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-colors text-sm shadow"
                >
                  Registrate gratis →
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
