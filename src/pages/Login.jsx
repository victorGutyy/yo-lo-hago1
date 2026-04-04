import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { RUTAS, APP_NAME } from '../constants'

// Traduce errores de Supabase al español
function traducirError(msg = '') {
  if (msg.includes('Invalid login credentials'))
    return 'Correo o contraseña incorrectos. Verificá tus datos e intentá de nuevo.'
  if (msg.includes('Email not confirmed'))
    return 'Tu correo aún no fue confirmado. Revisá tu bandeja de entrada.'
  if (msg.includes('User not found'))
    return 'No encontramos una cuenta con ese correo.'
  if (msg.includes('rate limit') || msg.includes('too many requests'))
    return 'Demasiados intentos. Esperá unos minutos antes de intentar de nuevo.'
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Error de conexión. Verificá tu internet e intentá de nuevo.'
  return 'Ocurrió un error inesperado. Intentá de nuevo.'
}

export default function Login() {
  const { usuario, cargando } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [recuperando, setRecuperando] = useState(false)
  const [mensajeRecuperacion, setMensajeRecuperacion] = useState('')

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (!cargando && usuario) navigate(RUTAS.DASHBOARD, { replace: true })
  }, [usuario, cargando, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  // ── Iniciar sesión ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email.trim()) { setError('El correo electrónico es obligatorio.'); return }
    if (!form.password) { setError('La contraseña es obligatoria.'); return }

    setEnviando(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      if (authError) throw authError
      // El hook useAuth detectará el cambio y navigate ocurrirá por el useEffect
    } catch (err) {
      setError(traducirError(err.message))
    } finally {
      setEnviando(false)
    }
  }

  // ── Recuperar contraseña ──────────────────────────────────────
  const handleRecuperarPassword = async () => {
    if (!form.email.trim()) {
      setError('Escribí tu correo arriba y luego hacé clic en "¿Olvidaste tu contraseña?".')
      return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('El correo no es válido.')
      return
    }

    setRecuperando(true)
    setError('')
    setMensajeRecuperacion('')

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        form.email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` }
      )

      if (resetError) throw resetError

      setMensajeRecuperacion(
        `Te enviamos un enlace de recuperación a ${form.email.trim()}. Revisá tu correo (y la carpeta de spam).`
      )
    } catch (err) {
      setError(traducirError(err.message))
    } finally {
      setRecuperando(false)
    }
  }

  // ── Carga inicial ─────────────────────────────────────────────
  if (cargando) return null

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <Link
            to={RUTAS.HOME}
            className="inline-block text-green-800 font-extrabold text-2xl tracking-tight hover:text-green-900 transition-colors mb-2"
          >
            {APP_NAME}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            Iniciá sesión
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Accedé a tu panel y gestioná tu tarjeta laboral
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  autoFocus
                  className="campo"
                />
              </div>

              {/* Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="password"
                  >
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={handleRecuperarPassword}
                    disabled={recuperando}
                    className="text-xs text-green-700 hover:text-green-900 hover:underline transition-colors disabled:opacity-60"
                  >
                    {recuperando ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  className="campo"
                />
              </div>
            </div>

            {/* Mensaje de recuperación exitosa */}
            {mensajeRecuperacion && (
              <div className="mt-4 flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                <span className="flex-shrink-0 mt-0.5">✅</span>
                <span>{mensajeRecuperacion}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Botón de ingreso */}
            <button
              type="submit"
              disabled={enviando}
              className="mt-6 w-full bg-green-800 text-white font-bold py-3 rounded-xl hover:bg-green-900 active:scale-95 transition-all duration-200 text-sm sm:text-base shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">¿No tenés cuenta?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Link a registro */}
          <Link
            to={RUTAS.REGISTRO}
            className="block w-full border-2 border-orange-600 text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-600 hover:text-white active:scale-95 transition-all duration-200 text-sm sm:text-base text-center"
          >
            Registrate gratis y publicá tu oficio
          </Link>
        </div>

        {/* Volver al inicio */}
        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to={RUTAS.HOME} className="hover:text-gray-600 hover:underline transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  )
}
