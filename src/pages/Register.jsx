import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { RUTAS, MUNICIPIOS, OFICIOS } from '../constants'

// Traduce errores de Supabase al español
function traducirError(msg = '') {
  if (msg.includes('already registered') || msg.includes('User already registered'))
    return 'Este correo ya tiene una cuenta registrada. ¿Querés iniciar sesión?'
  if (msg.includes('Invalid email'))
    return 'El correo electrónico no es válido.'
  if (msg.includes('Password should be'))
    return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('rate limit'))
    return 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.'
  return 'Ocurrió un error inesperado. Intentá de nuevo.'
}

// Indicador visual de los pasos
function IndicadorPasos({ pasoActual }) {
  const pasos = ['Tus datos', 'Tu oficio']
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {pasos.map((nombre, i) => {
        const num = i + 1
        const activo = pasoActual === num
        const completado = pasoActual > num
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold border-2 transition-all duration-300 ${
                  completado
                    ? 'bg-green-800 border-green-800 text-white'
                    : activo
                    ? 'bg-white border-green-800 text-green-800'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {completado ? '✓' : num}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  activo ? 'text-green-800' : completado ? 'text-green-700' : 'text-gray-400'
                }`}
              >
                {nombre}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-1 mb-4 transition-colors duration-300 ${
                  pasoActual > num ? 'bg-green-800' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Register() {
  const { usuario, cargando } = useAuth()
  const navigate = useNavigate()

  const [paso, setPaso] = useState(1)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [exitoso, setExitoso] = useState(false)
  const [confirmacionPendiente, setConfirmacionPendiente] = useState(false)

  const [form, setForm] = useState({
    // Paso 1
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
    telefono: '',
    aceptaTerminos: false,
    // Paso 2
    municipio: '',
    oficio: '',
    descripcion: '',
  })

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (!cargando && usuario) navigate(RUTAS.DASHBOARD, { replace: true })
  }, [usuario, cargando, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) setError('')
  }

  // ── Validación del paso 1 ────────────────────────────────────
  const validarPaso1 = () => {
    if (!form.nombre.trim()) return 'El nombre completo es obligatorio.'
    if (form.nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.'
    if (!form.email.trim()) return 'El correo electrónico es obligatorio.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'El correo electrónico no es válido.'
    if (form.password.length < 6) return 'La contraseña debe tener mínimo 6 caracteres.'
    if (form.password !== form.confirmar) return 'Las contraseñas no coinciden.'
    if (!form.telefono.trim()) return 'El número de WhatsApp es obligatorio.'
    if (!/^[0-9+\s\-]{7,15}$/.test(form.telefono.trim()))
      return 'El número de WhatsApp no parece válido.'
    if (!form.aceptaTerminos)
      return 'Debés aceptar la política de privacidad para continuar.'
    return null
  }

  const avanzarPaso2 = () => {
    const err = validarPaso1()
    if (err) { setError(err); return }
    setError('')
    setPaso(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Envío final del formulario ───────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.municipio) { setError('Seleccioná tu municipio.'); return }
    if (!form.oficio) { setError('Seleccioná tu oficio principal.'); return }
    if (form.descripcion.trim().length < 10)
      { setError('La descripción debe tener al menos 10 caracteres.'); return }

    setEnviando(true)
    setError('')

    try {
      // 1. Registrar usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            nombre_completo: form.nombre.trim(),
            telefono: form.telefono.trim(),
          },
        },
      })

      if (authError) throw authError

      // 2. Insertar perfil en la tabla profiles
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          nombre_completo: form.nombre.trim(),
          email: form.email.trim().toLowerCase(),
          telefono: form.telefono.trim(),
          municipio: form.municipio,
          oficio: form.oficio,
          descripcion: form.descripcion.trim(),
        })

        // Si falla (p.ej. por confirmación de email pendiente), se creará luego
        if (profileError) {
          console.warn('Perfil: se intentará crear al confirmar el correo.', profileError.message)
        }
      }

      // 3. Determinar resultado
      if (data.session) {
        // Sin confirmación de email — sesión activa de inmediato
        setExitoso(true)
        setTimeout(() => navigate(RUTAS.DASHBOARD, { replace: true }), 1800)
      } else {
        // Con confirmación de email habilitada
        setConfirmacionPendiente(true)
      }
    } catch (err) {
      setError(traducirError(err.message))
    } finally {
      setEnviando(false)
    }
  }

  // ── Pantalla de carga inicial ────────────────────────────────
  if (cargando) return null

  // ── Pantalla de éxito (con sesión) ──────────────────────────
  if (exitoso) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">¡Registro exitoso!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Tu cuenta fue creada. Te estamos redirigiendo al panel...
          </p>
          <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </main>
    )
  }

  // ── Pantalla de confirmación de email pendiente ──────────────
  if (confirmacionPendiente) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Revisá tu correo
          </h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Te enviamos un enlace de confirmación a{' '}
            <strong className="text-gray-800">{form.email}</strong>. Hacé clic
            en el enlace para activar tu cuenta.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            ¿No lo ves? Revisá la carpeta de spam.
          </p>
          <Link
            to={RUTAS.LOGIN}
            className="inline-block bg-green-800 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-900 transition-colors text-sm"
          >
            Ir a Iniciar sesión
          </Link>
        </div>
      </main>
    )
  }

  // ── Formulario principal ─────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-800">
            Crear mi cuenta
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Publicá tu oficio gratis y empezá a recibir contactos
          </p>
        </div>

        {/* Indicador de pasos */}
        <IndicadorPasos pasoActual={paso} />

        {/* Tarjeta del formulario */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Barra de progreso */}
          <div className="h-1.5 bg-gray-100">
            <div
              className="h-full bg-green-700 transition-all duration-500"
              style={{ width: paso === 1 ? '50%' : '100%' }}
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* ── PASO 1 ──────────────────────────────────────── */}
            {paso === 1 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-5">
                  Tus datos personales
                </h2>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Carlos Andrés Ramírez"
                      autoComplete="name"
                      className="campo"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                      autoComplete="email"
                      className="campo"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                        Contraseña <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        className="campo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmar">
                        Confirmar <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="confirmar"
                        name="confirmar"
                        type="password"
                        value={form.confirmar}
                        onChange={handleChange}
                        placeholder="Repetí la contraseña"
                        autoComplete="new-password"
                        className={`campo ${
                          form.confirmar && form.confirmar !== form.password
                            ? 'border-red-400 focus:ring-red-400'
                            : ''
                        }`}
                      />
                      {form.confirmar && form.confirmar !== form.password && (
                        <p className="text-xs text-red-500 mt-1">No coinciden</p>
                      )}
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="telefono">
                      Número de WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="Ej: 310 123 4567"
                      autoComplete="tel"
                      className="campo"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Este número se mostrará en tu tarjeta laboral para que te contacten.
                    </p>
                  </div>

                  {/* Checkbox política de privacidad */}
                  <div
                    className={`flex items-start gap-3 p-4 rounded-xl border ${
                      error && !form.aceptaTerminos
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <input
                      id="aceptaTerminos"
                      name="aceptaTerminos"
                      type="checkbox"
                      checked={form.aceptaTerminos}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 accent-green-800 flex-shrink-0 cursor-pointer"
                    />
                    <label
                      htmlFor="aceptaTerminos"
                      className="text-xs text-gray-600 leading-relaxed cursor-pointer"
                    >
                      He leído y acepto la{' '}
                      <Link
                        to={`${RUTAS.COMO_FUNCIONA}#habeas-data`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-800 font-semibold underline hover:text-green-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Política de Privacidad y el tratamiento de mis datos personales
                      </Link>{' '}
                      según la Ley 1581 de 2012.{' '}
                      <span className="text-red-500 font-semibold">*</span>
                    </label>
                  </div>
                </div>

                {/* Error paso 1 */}
                {error && (
                  <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    <span className="flex-shrink-0 mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Botón avanzar */}
                <button
                  type="button"
                  onClick={avanzarPaso2}
                  className="mt-6 w-full bg-green-800 text-white font-bold py-3 rounded-xl hover:bg-green-900 active:scale-95 transition-all duration-200 text-sm sm:text-base shadow"
                >
                  Continuar al paso 2 →
                </button>
              </div>
            )}

            {/* ── PASO 2 ──────────────────────────────────────── */}
            {paso === 2 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-800 mb-5">
                  Tu oficio y ubicación
                </h2>

                <div className="space-y-4">
                  {/* Municipio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="municipio">
                      Municipio donde trabajás <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="municipio"
                      name="municipio"
                      value={form.municipio}
                      onChange={handleChange}
                      className="campo bg-white"
                    >
                      <option value="">— Seleccioná tu municipio —</option>
                      {MUNICIPIOS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Oficio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="oficio">
                      Oficio principal <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="oficio"
                      name="oficio"
                      value={form.oficio}
                      onChange={handleChange}
                      className="campo bg-white"
                    >
                      <option value="">— Seleccioná tu oficio —</option>
                      {OFICIOS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion">
                      Descripción de tus servicios <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Ej: Plomero con 8 años de experiencia. Instalo, reparo y mantengo tuberías, grifos y sanitarios en residencias y empresas. Trabajo en Medellín y municipios cercanos."
                      className="campo resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        Mínimo 10 caracteres. Sé específico para atraer más clientes.
                      </p>
                      <span
                        className={`text-xs ${
                          form.descripcion.length < 10 ? 'text-gray-400' : 'text-green-700'
                        }`}
                      >
                        {form.descripcion.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error paso 2 */}
                {error && (
                  <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    <span className="flex-shrink-0 mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Botones */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => { setPaso(1); setError('') }}
                    className="sm:w-auto flex-shrink-0 border-2 border-gray-300 text-gray-600 font-semibold px-5 py-3 rounded-xl hover:border-gray-400 hover:text-gray-800 active:scale-95 transition-all duration-200 text-sm"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-200 text-sm sm:text-base shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {enviando ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear mi cuenta gratis'
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                  Al registrarte, tu tarjeta laboral será visible públicamente
                  en el portal.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Link a login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link
            to={RUTAS.LOGIN}
            className="text-green-800 font-semibold hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
