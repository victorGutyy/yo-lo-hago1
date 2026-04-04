import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { RUTAS, OFICIOS, DISPONIBILIDAD } from '../constants'

const MAX_DESC = 300
const MAX_REFS = 3

// ── Sección del formulario con encabezado ────────────────────────
function Seccion({ numero, titulo, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <span className="w-7 h-7 rounded-full bg-green-800 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
          {numero}
        </span>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{titulo}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}

export default function CreateCard() {
  const { usuario, cargando: cargandoAuth } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Estado del formulario
  const [foto, setFoto] = useState(null)          // File objeto
  const [fotoPreview, setFotoPreview] = useState(null) // URL de preview
  const [fotoUrlExistente, setFotoUrlExistente] = useState(null) // URL guardada en BD
  const [oficiosSeleccionados, setOficiosSeleccionados] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [anosExperiencia, setAnosExperiencia] = useState(0)
  const [disponibilidad, setDisponibilidad] = useState('')
  const [referencias, setReferencias] = useState([{ nombre: '', telefono: '' }])
  const [cedula, setCedula] = useState('')
  const [aceptaCedula, setAceptaCedula] = useState(false)

  // Estado UI
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [tarjetaId, setTarjetaId] = useState(null)

  // ── Protección de ruta ─────────────────────────────────────────
  useEffect(() => {
    if (!cargandoAuth && !usuario) navigate(RUTAS.LOGIN, { replace: true })
  }, [usuario, cargandoAuth, navigate])

  // ── Cargar tarjeta existente para edición ──────────────────────
  useEffect(() => {
    if (!usuario) return
    const cargarTarjeta = async () => {
      const { data } = await supabase
        .from('tarjetas')
        .select('*, referencias(*)')
        .eq('user_id', usuario.id)
        .maybeSingle()

      if (data) {
        setModoEdicion(true)
        setTarjetaId(data.id)
        setFotoUrlExistente(data.foto_url || null)
        setOficiosSeleccionados(data.oficios || [])
        setDescripcion(data.descripcion || '')
        setAnosExperiencia(data.anos_experiencia ?? 0)
        setDisponibilidad(data.disponibilidad || '')
        setCedula(data.cedula || '')
        setAceptaCedula(data.acepta_cedula || false)
        if (data.referencias?.length) {
          setReferencias(
            data.referencias.map((r) => ({ nombre: r.nombre, telefono: r.telefono }))
          )
        }
      }
    }
    cargarTarjeta()
  }, [usuario])

  // ── Foto: selección y preview ──────────────────────────────────
  const handleFoto = (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    if (archivo.size > 3 * 1024 * 1024) {
      setError('La foto no puede pesar más de 3 MB.')
      return
    }
    if (!archivo.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen (JPG, PNG, WebP).')
      return
    }
    setFoto(archivo)
    setFotoPreview(URL.createObjectURL(archivo))
    setError('')
  }

  const quitarFoto = () => {
    setFoto(null)
    setFotoPreview(null)
    setFotoUrlExistente(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Oficios: selección múltiple ────────────────────────────────
  const toggleOficio = (oficio) => {
    setOficiosSeleccionados((prev) =>
      prev.includes(oficio) ? prev.filter((o) => o !== oficio) : [...prev, oficio]
    )
    setError('')
  }

  // ── Referencias: gestión dinámica ──────────────────────────────
  const handleReferencia = (i, campo, valor) => {
    setReferencias((prev) =>
      prev.map((ref, idx) => (idx === i ? { ...ref, [campo]: valor } : ref))
    )
  }

  const agregarReferencia = () => {
    if (referencias.length < MAX_REFS)
      setReferencias((prev) => [...prev, { nombre: '', telefono: '' }])
  }

  const eliminarReferencia = (i) => {
    if (referencias.length > 1)
      setReferencias((prev) => prev.filter((_, idx) => idx !== i))
  }

  // ── Validación ─────────────────────────────────────────────────
  const validar = () => {
    if (oficiosSeleccionados.length === 0)
      return 'Seleccioná al menos un oficio.'
    if (descripcion.trim().length < 10)
      return 'La descripción debe tener al menos 10 caracteres.'
    if (descripcion.length > MAX_DESC)
      return `La descripción no puede superar ${MAX_DESC} caracteres.`
    if (!disponibilidad)
      return 'Seleccioná tu disponibilidad.'
    if (anosExperiencia < 0 || anosExperiencia > 50)
      return 'Los años de experiencia deben estar entre 0 y 50.'
    // Validar referencias que tengan datos parciales
    for (const ref of referencias) {
      if ((ref.nombre && !ref.telefono) || (!ref.nombre && ref.telefono))
        return 'Cada referencia debe tener nombre y teléfono, o dejá ambos vacíos.'
    }
    if (cedula && !aceptaCedula)
      return 'Debés aceptar la autorización para mostrar tu cédula.'
    return null
  }

  // ── Envío ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validar()
    if (err) { setError(err); window.scrollTo({ top: 0, behavior: 'smooth' }); return }

    setEnviando(true)
    setError('')

    try {
      // 1. Subir foto si hay una nueva
      let fotoUrl = fotoUrlExistente
      if (foto) {
        const fileExt = foto.name.split('.').pop()
        const filePath = `${usuario.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, foto, { upsert: true })

        if (uploadError) throw new Error('Error al subir la foto: ' + uploadError.message)

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)
        fotoUrl = urlData.publicUrl
      }

      // 2. Datos de la tarjeta
      const datosTarjeta = {
        user_id: usuario.id,
        foto_url: fotoUrl,
        oficios: oficiosSeleccionados,
        descripcion: descripcion.trim(),
        anos_experiencia: Number(anosExperiencia),
        disponibilidad,
        cedula: aceptaCedula ? cedula.trim() || null : null,
        acepta_cedula: aceptaCedula,
        activa: true,
      }

      let idTarjeta = tarjetaId

      if (modoEdicion && tarjetaId) {
        // Actualizar tarjeta existente
        const { error: updateError } = await supabase
          .from('tarjetas')
          .update({ ...datosTarjeta, updated_at: new Date().toISOString() })
          .eq('id', tarjetaId)
        if (updateError) throw updateError

        // Eliminar referencias anteriores y reinsertar
        await supabase.from('referencias').delete().eq('tarjeta_id', tarjetaId)
      } else {
        // Insertar nueva tarjeta
        const { data: nuevaTarjeta, error: insertError } = await supabase
          .from('tarjetas')
          .insert(datosTarjeta)
          .select('id')
          .single()
        if (insertError) throw insertError
        idTarjeta = nuevaTarjeta.id
      }

      // 3. Insertar referencias (solo las que tienen datos)
      const refsValidas = referencias.filter(
        (r) => r.nombre.trim() && r.telefono.trim()
      )
      if (refsValidas.length > 0) {
        const { error: refsError } = await supabase.from('referencias').insert(
          refsValidas.map((r) => ({
            tarjeta_id: idTarjeta,
            nombre_referencia: r.nombre.trim(),
            telefono_referencia: r.telefono.trim(),
          }))
        )
        if (refsError) throw refsError
      }

      setExito(true)
      setTimeout(() => navigate(RUTAS.DASHBOARD, { replace: true }), 2000)
    } catch (err) {
      console.log('Error completo:', JSON.stringify(err, null, 2))
      setError('Ocurrió un error al guardar. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  // ── Pantalla de éxito ──────────────────────────────────────────
  if (exito) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {modoEdicion ? '¡Tarjeta actualizada!' : '¡Tarjeta creada!'}
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Te estamos redirigiendo al panel...
          </p>
          <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </main>
    )
  }

  if (cargandoAuth) return null

  // ── Formulario principal ───────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-800">
            {modoEdicion ? 'Editar tarjeta laboral' : 'Crear tarjeta laboral'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tu tarjeta será visible para contratantes en toda Colombia
          </p>
        </div>

        {/* Error global */}
        {error && (
          <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── 1. FOTO DE PERFIL ──────────────────────────────── */}
          <Seccion numero="1" titulo="Foto de perfil">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Preview */}
              <div className="flex-shrink-0">
                {fotoPreview || fotoUrlExistente ? (
                  <div className="relative w-28 h-28">
                    <img
                      src={fotoPreview || fotoUrlExistente}
                      alt="Preview de foto"
                      className="w-28 h-28 rounded-full object-cover border-4 border-green-100 shadow"
                    />
                    <button
                      type="button"
                      onClick={quitarFoto}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                      aria-label="Quitar foto"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs text-center gap-1">
                    <span className="text-3xl">📷</span>
                    <span>Sin foto</span>
                  </div>
                )}
              </div>

              {/* Controles */}
              <div className="flex-1 text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFoto}
                  className="hidden"
                  id="foto-input"
                />
                <label
                  htmlFor="foto-input"
                  className="inline-block cursor-pointer bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-900 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  {fotoPreview || fotoUrlExistente ? 'Cambiar foto' : 'Seleccionar foto'}
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG o WebP · Máximo 3 MB · Opcional
                </p>
              </div>
            </div>
          </Seccion>

          {/* ── 2. OFICIOS ─────────────────────────────────────── */}
          <Seccion numero="2" titulo="Oficios que ofrecés *">
            <p className="text-xs text-gray-500 mb-4">
              Seleccioná uno o más oficios. Mínimo 1 requerido.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OFICIOS.map((oficio) => {
                const seleccionado = oficiosSeleccionados.includes(oficio)
                return (
                  <label
                    key={oficio}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                      seleccionado
                        ? 'bg-green-50 border-green-600 text-green-800'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      onChange={() => toggleOficio(oficio)}
                      className="w-4 h-4 accent-green-800 flex-shrink-0"
                    />
                    <span className="text-sm font-medium leading-snug">{oficio}</span>
                  </label>
                )
              })}
            </div>
            {oficiosSeleccionados.length > 0 && (
              <p className="mt-3 text-xs text-green-700 font-medium">
                ✓ {oficiosSeleccionados.length} oficio{oficiosSeleccionados.length !== 1 ? 's' : ''} seleccionado{oficiosSeleccionados.length !== 1 ? 's' : ''}
              </p>
            )}
          </Seccion>

          {/* ── 3. DESCRIPCIÓN ─────────────────────────────────── */}
          <Seccion numero="3" titulo="Descripción de tus servicios *">
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value.slice(0, MAX_DESC))}
              rows={5}
              placeholder="Ej: Plomero con 8 años de experiencia. Instalo, reparo y mantengo tuberías, grifos y sanitarios en residencias y locales. Trabajo en Medellín y municipios cercanos. Atención los 7 días."
              className="campo resize-none"
            />
            <div className="flex justify-between mt-1.5">
              <p className="text-xs text-gray-400">
                Descripción clara = más contactos. Mínimo 10 caracteres.
              </p>
              <span
                className={`text-xs font-medium ${
                  descripcion.length >= MAX_DESC
                    ? 'text-red-500'
                    : descripcion.length >= MAX_DESC * 0.8
                    ? 'text-orange-500'
                    : 'text-gray-400'
                }`}
              >
                {descripcion.length}/{MAX_DESC}
              </span>
            </div>
          </Seccion>

          {/* ── 4. EXPERIENCIA Y DISPONIBILIDAD ────────────────── */}
          <Seccion numero="4" titulo="Experiencia y disponibilidad">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Años de experiencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="anos">
                  Años de experiencia
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="anos"
                    type="number"
                    min={0}
                    max={50}
                    value={anosExperiencia}
                    onChange={(e) =>
                      setAnosExperiencia(
                        Math.min(50, Math.max(0, parseInt(e.target.value) || 0))
                      )
                    }
                    className="campo w-24 text-center text-lg font-bold"
                  />
                  <span className="text-sm text-gray-500">
                    año{anosExperiencia !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Disponibilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="disponibilidad">
                  Disponibilidad <span className="text-red-500">*</span>
                </label>
                <select
                  id="disponibilidad"
                  value={disponibilidad}
                  onChange={(e) => setDisponibilidad(e.target.value)}
                  className="campo bg-white"
                >
                  <option value="">— Seleccioná —</option>
                  {DISPONIBILIDAD.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Seccion>

          {/* ── 5. REFERENCIAS ─────────────────────────────────── */}
          <Seccion numero="5" titulo="Referencias personales (opcional)">
            <p className="text-xs text-gray-500 mb-4">
              Hasta {MAX_REFS} referencias. Dejá el campo vacío si no tenés.
            </p>
            <div className="space-y-3">
              {referencias.map((ref, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="w-6 h-6 bg-green-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={ref.nombre}
                    onChange={(e) => handleReferencia(i, 'nombre', e.target.value)}
                    placeholder="Nombre de la referencia"
                    className="campo flex-1"
                  />
                  <input
                    type="tel"
                    value={ref.telefono}
                    onChange={(e) => handleReferencia(i, 'telefono', e.target.value)}
                    placeholder="Teléfono"
                    className="campo sm:w-36"
                  />
                  {referencias.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarReferencia(i)}
                      className="flex-shrink-0 text-red-400 hover:text-red-600 text-sm font-bold px-2 transition-colors"
                      aria-label="Eliminar referencia"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {referencias.length < MAX_REFS && (
              <button
                type="button"
                onClick={agregarReferencia}
                className="mt-3 text-sm text-green-700 font-semibold hover:text-green-900 hover:underline transition-colors flex items-center gap-1"
              >
                + Agregar referencia
              </button>
            )}
          </Seccion>

          {/* ── 6. CÉDULA (OPCIONAL) ───────────────────────────── */}
          <Seccion numero="6" titulo="Número de cédula (opcional)">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm text-yellow-800">
              <p className="font-semibold mb-1">ℹ️ ¿Para qué sirve esto?</p>
              <p className="text-xs leading-relaxed">
                Los contratantes pueden verificar antecedentes en el portal
                oficial de la Policía Nacional. Si compartís tu cédula, la
                verificación es más rápida. Este dato es{' '}
                <strong>completamente opcional</strong>.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="cedula">
                Número de cédula
              </label>
              <input
                id="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="Solo números, sin puntos"
                className="campo max-w-xs"
                disabled={!aceptaCedula}
              />
            </div>

            <div className="flex items-start gap-3 mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
              <input
                id="acepta-cedula"
                type="checkbox"
                checked={aceptaCedula}
                onChange={(e) => {
                  setAceptaCedula(e.target.checked)
                  if (!e.target.checked) setCedula('')
                }}
                className="mt-0.5 w-4 h-4 accent-green-800 flex-shrink-0 cursor-pointer"
              />
              <label
                htmlFor="acepta-cedula"
                className="text-xs text-gray-600 leading-relaxed cursor-pointer"
              >
                Autorizo mostrar mi número de cédula en mi tarjeta laboral para
                facilitar la verificación de antecedentes por parte de los
                contratantes. Entiendo que este dato es público y que puedo
                quitarlo en cualquier momento.
              </label>
            </div>
          </Seccion>

          {/* ── BOTÓN GUARDAR ──────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate(RUTAS.DASHBOARD)}
              className="sm:w-auto flex-shrink-0 border-2 border-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-gray-400 active:scale-95 transition-all duration-200 text-sm"
            >
              ← Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {enviando ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : modoEdicion ? (
                '💾 Guardar cambios'
              ) : (
                '🚀 Publicar mi tarjeta laboral'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
