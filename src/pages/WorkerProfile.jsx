import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { RUTAS } from '../constants'

// ── Componentes de apoyo ─────────────────────────────────────────

function Avatar({ nombre, fotoUrl }) {
  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={nombre}
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg"
      />
    )
  }
  return (
    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-green-100 border-4 border-white shadow-lg flex items-center justify-center text-green-800 font-extrabold text-4xl sm:text-5xl">
      {nombre?.charAt(0).toUpperCase() ?? '?'}
    </div>
  )
}

function Estrellas({ valor, interactivo = false, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={interactivo ? 'button' : undefined}
          onClick={interactivo ? () => onChange(n) : undefined}
          className={`text-2xl leading-none transition-transform ${
            interactivo ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } ${n <= valor ? 'text-yellow-400' : 'text-gray-200'}`}
          aria-label={interactivo ? `${n} estrella${n !== 1 ? 's' : ''}` : undefined}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// Formato WhatsApp: quita espacios/guiones, agrega código 57
function urlWhatsApp(telefono) {
  const limpio = telefono.replace(/[\s\-().+]/g, '')
  const numero = limpio.startsWith('57') ? limpio : `57${limpio}`
  return `https://wa.me/${numero}`
}

// ── Página principal ─────────────────────────────────────────────
export default function WorkerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [tarjeta, setTarjeta] = useState(null)
  const [referencias, setReferencias] = useState([])
  const [valoraciones, setValoraciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Formulario de valoración
  const [formVal, setFormVal] = useState({ nombre: '', comentario: '', estrellas: 0 })
  const [enviandoVal, setEnviandoVal] = useState(false)
  const [errorVal, setErrorVal] = useState('')
  const [exitoVal, setExitoVal] = useState(false)

  // ── Cargar datos ───────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    const cargar = async () => {
      setCargando(true)
      setError('')
      try {
        // Tarjeta con perfil
        const { data: tarjetaData, error: tarjetaError } = await supabase
          .from('tarjetas')
          .select('*, profiles(*)')
          .eq('user_id', id)
          .maybeSingle()

        if (tarjetaError) throw tarjetaError
        if (!tarjetaData) { setError('not_found'); setCargando(false); return }
        setTarjeta(tarjetaData)

        // Referencias
        const { data: refsData } = await supabase
          .from('referencias')
          .select('nombre_referencia, telefono_referencia')
          .eq('tarjeta_id', tarjetaData.id)

        setReferencias(refsData ?? [])

        // Valoraciones
        const { data: valsData } = await supabase
          .from('valoraciones')
          .select('*')
          .eq('tarjeta_id', tarjetaData.id)
          .order('created_at', { ascending: false })

        setValoraciones(valsData ?? [])
      } catch (err) {
        console.error('WorkerProfile error:', err)
        setError('general')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  // ── Enviar valoración ──────────────────────────────────────────
  const handleValoracion = async (e) => {
    e.preventDefault()
    if (!formVal.nombre.trim()) { setErrorVal('Escribí tu nombre.'); return }
    if (!formVal.comentario.trim()) { setErrorVal('Escribí un comentario.'); return }
    if (formVal.estrellas === 0) { setErrorVal('Seleccioná una calificación.'); return }

    setEnviandoVal(true)
    setErrorVal('')
    try {
      const { data: nueva, error: valError } = await supabase
        .from('valoraciones')
        .insert({
          tarjeta_id: tarjeta.id,
          nombre_revisor: formVal.nombre.trim(),
          comentario: formVal.comentario.trim(),
          estrellas: formVal.estrellas,
        })
        .select('*')
        .single()

      if (valError) throw valError
      setValoraciones((prev) => [nueva, ...prev])
      setFormVal({ nombre: '', comentario: '', estrellas: 0 })
      setExitoVal(true)
      setTimeout(() => setExitoVal(false), 3000)
    } catch (err) {
      console.error('Valoración error:', err)
      setErrorVal('No se pudo guardar la valoración. Intentá de nuevo.')
    } finally {
      setEnviandoVal(false)
    }
  }

  // ── Estados de carga / error ───────────────────────────────────
  if (cargando) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-5 animate-pulse">
          <div className="bg-green-800 rounded-2xl h-48" />
          <div className="bg-white rounded-2xl h-32" />
          <div className="bg-white rounded-2xl h-24" />
        </div>
      </main>
    )
  }

  if (error === 'not_found') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Perfil no encontrado</h2>
          <p className="text-gray-500 text-sm mb-6">
            Este trabajador no existe o su tarjeta fue desactivada.
          </p>
          <Link
            to={RUTAS.TRABAJADORES}
            className="inline-block bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-900 transition-colors text-sm"
          >
            ← Ver todos los trabajadores
          </Link>
        </div>
      </main>
    )
  }

  if (error === 'general') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar el perfil</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-900 transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      </main>
    )
  }

  const perfil = tarjeta.profiles ?? {}
  const nombre = perfil.nombre_completo ?? 'Sin nombre'
  const municipio = perfil.municipio ?? '—'
  const telefono = perfil.telefono ?? ''
  const fotoUrl = tarjeta.foto_url || perfil.foto_url || null
  const oficios = Array.isArray(tarjeta.oficios) ? tarjeta.oficios : []

  const promedioEstrellas = valoraciones.length
    ? Math.round(valoraciones.reduce((acc, v) => acc + v.estrellas, 0) / valoraciones.length)
    : 0

  return (
    <main className="min-h-screen bg-gray-50 pb-16 relative">

      {/* ── CABECERA ──────────────────────────────────────────────── */}
      <section
        className="relative text-white pt-20 pb-16 px-4 overflow-hidden"
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
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link
            to={RUTAS.TRABAJADORES}
            className="inline-flex items-center gap-1 text-green-200 hover:text-white text-sm mb-6 transition-colors"
          >
            ← Volver al listado
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <Avatar nombre={nombre} fotoUrl={fotoUrl} />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow">{nombre}</h1>
              <p className="text-white text-sm mt-1 flex items-center justify-center sm:justify-start gap-1">
                <span>📍</span> {municipio}
              </p>
              {valoraciones.length > 0 && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <Estrellas valor={promedioEstrellas} />
                  <span className="text-green-200 text-xs">
                    ({valoraciones.length} valoración{valoraciones.length !== 1 ? 'es' : ''})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 space-y-5">

        {/* ── DATOS CLAVE + WHATSAPP ─────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 -mt-12 relative z-10 mx-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-green-800">
                {tarjeta.anos_experiencia ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                año{tarjeta.anos_experiencia !== 1 ? 's' : ''} de experiencia
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-green-800">
                {oficios.length}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                oficio{oficios.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <p className="text-sm font-bold text-green-800 leading-snug">
                {tarjeta.disponibilidad ?? '—'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">disponibilidad</p>
            </div>
          </div>

          {/* Botón WhatsApp */}
          {telefono && (
            <a
              href={urlWhatsApp(telefono)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-800 text-white font-bold py-3.5 rounded-xl hover:bg-green-900 active:scale-95 transition-all duration-200 shadow text-base"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar por WhatsApp
            </a>
          )}
        </div>

        {/* ── OFICIOS ───────────────────────────────────────────────── */}
        {oficios.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-bold text-green-800 mb-3">Oficios</h2>
            <div className="flex flex-wrap gap-2">
              {oficios.map((o) => (
                <span
                  key={o}
                  className="bg-green-50 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full border border-green-100"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── DESCRIPCIÓN ───────────────────────────────────────────── */}
        {tarjeta.descripcion && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-bold text-green-800 mb-3">Acerca de mis servicios</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {tarjeta.descripcion}
            </p>
          </div>
        )}

        {/* ── REFERENCIAS ───────────────────────────────────────────── */}
        {referencias.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-bold text-green-800 mb-4">
              Referencias personales
            </h2>
            <div className="space-y-3">
              {referencias.map((ref, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {ref.nombre_referencia}
                    </p>
                    <p className="text-xs text-gray-500">{ref.telefono_referencia}</p>
                  </div>
                  <a
                    href={`tel:${ref.telefono_referencia}`}
                    className="flex-shrink-0 text-green-700 hover:text-green-900 text-lg"
                    aria-label={`Llamar a ${ref.nombre_referencia}`}
                  >
                    📞
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CÉDULA / VERIFICACIÓN ─────────────────────────────────── */}
        {tarjeta.acepta_cedula && tarjeta.cedula && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-bold text-green-800 mb-3">
              Verificación de antecedentes
            </h2>
            <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-4 mb-4">
              <p className="text-sm text-gray-700 mb-1">
                Cédula de ciudadanía:{' '}
                <strong className="text-gray-900 font-mono">{tarjeta.cedula}</strong>
              </p>
              <p className="text-xs text-gray-500">
                Autorizado por el trabajador para verificación de antecedentes.
              </p>
            </div>
            <a
              href="https://antecedentes.policia.gov.co:7005/WebJudicial/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-900 transition-colors"
            >
              Consultar en Policía Nacional ↗
            </a>
          </div>
        )}

        {/* ── VALORACIONES ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h2 className="text-base font-bold text-green-800 mb-1">Valoraciones</h2>
          <p className="text-xs text-gray-400 mb-5">
            {valoraciones.length === 0
              ? 'Aún no hay valoraciones. ¡Sé el primero!'
              : `${valoraciones.length} valoración${valoraciones.length !== 1 ? 'es' : ''}`}
          </p>

          {/* Lista de valoraciones */}
          {valoraciones.length > 0 && (
            <div className="space-y-4 mb-6">
              {valoraciones.map((v) => (
                <div key={v.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-800">{v.nombre_revisor}</p>
                    <Estrellas valor={v.estrellas} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.comentario}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(v.created_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Formulario nueva valoración */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">
              Dejá tu valoración
            </h3>

            {exitoVal && (
              <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                ✅ ¡Gracias por tu valoración!
              </div>
            )}

            <form onSubmit={handleValoracion} className="space-y-4">
              {/* Calificación */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Calificación <span className="text-red-500">*</span>
                </label>
                <Estrellas
                  valor={formVal.estrellas}
                  interactivo
                  onChange={(n) => setFormVal((p) => ({ ...p, estrellas: n }))}
                />
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="val-nombre">
                  Tu nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="val-nombre"
                  type="text"
                  value={formVal.nombre}
                  onChange={(e) => setFormVal((p) => ({ ...p, nombre: e.target.value }))}
                  placeholder="¿Cómo te llamás?"
                  className="campo"
                />
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="val-comentario">
                  Comentario <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="val-comentario"
                  value={formVal.comentario}
                  onChange={(e) => setFormVal((p) => ({ ...p, comentario: e.target.value }))}
                  rows={3}
                  placeholder="¿Cómo fue tu experiencia con este trabajador?"
                  className="campo resize-none"
                />
              </div>

              {errorVal && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errorVal}
                </p>
              )}

              <button
                type="submit"
                disabled={enviandoVal}
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-200 shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {enviandoVal ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar valoración'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
