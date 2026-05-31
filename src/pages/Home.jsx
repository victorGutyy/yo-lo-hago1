// Página de inicio — Landing principal de YO LO HAGO
import { Link } from 'react-router-dom'
import { RUTAS } from '../constants'
import logo from '../assets/logo.png'

const OFICIOS = [
  { icono: '🔨', nombre: 'Construcción', descripcion: 'Albañiles, maestros de obra' },
  { icono: '🎨', nombre: 'Pintura', descripcion: 'Pintura interior y exterior' },
  { icono: '⚡', nombre: 'Electricidad', descripcion: 'Instalaciones y reparaciones' },
  { icono: '🔧', nombre: 'Plomería', descripcion: 'Tuberías, sanitarios, griferías' },
  { icono: '🌿', nombre: 'Jardinería', descripcion: 'Jardines, poda, zonas verdes' },
  { icono: '🧹', nombre: 'Aseo', descripcion: 'Limpieza de hogar y oficinas' },
]

const STATS = [
  { valor: '+500', etiqueta: 'Trabajadores registrados' },
  { valor: '32',   etiqueta: 'Municipios activos' },
  { valor: '+1.2K', etiqueta: 'Servicios conectados' },
]

export default function Home() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, #14532d 0%, #166534 60%, #15803d 100%)',
          minHeight: '520px',
        }}
      >
        {/* Patrón de puntos */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.10) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Acento circular decorativo */}
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, #fdd835, transparent 65%)' }}
        />
        <div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, #ff6f00, transparent 65%)' }}
        />

        {/* Logo semitransparente de fondo */}
        <img
          src={logo}
          alt=""
          className="absolute inset-0 w-[600px] h-[600px] object-contain mx-auto my-auto left-0 right-0 top-0 bottom-0 opacity-10 pointer-events-none select-none"
        />

        {/* Contenido */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <span className="inline-block bg-yellow-400 text-green-900 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow">
            100% gratuito · Sin comisiones
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-md">
            Encuentra al profesional
            <br />
            <span className="text-yellow-400">que necesitas</span> en tu municipio
          </h1>

          <p className="text-green-100 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Plomeros, electricistas, pintores, jardineros y más oficios — todos
            en un solo portal. Contacto directo por WhatsApp, sin intermediarios.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={RUTAS.TRABAJADORES}
              className="bg-white text-green-800 font-bold px-8 py-3.5 rounded-xl hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base"
            >
              Ver trabajadores →
            </Link>
            <Link
              to={RUTAS.REGISTRO}
              className="bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base"
            >
              Registra tu oficio gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ── OFICIOS ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-3">
            Oficios disponibles
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10">
            Encuentra expertos en los trabajos que más necesitas
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {OFICIOS.map((oficio) => (
              <Link
                key={oficio.nombre}
                to={RUTAS.TRABAJADORES}
                className="group bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center hover:bg-green-50 hover:border-green-200 hover:shadow-md active:scale-95 transition-all duration-200"
              >
                <span
                  className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200"
                  role="img"
                  aria-hidden="true"
                >
                  {oficio.icono}
                </span>
                <span className="text-sm font-bold text-green-800 mb-1">
                  {oficio.nombre}
                </span>
                <span className="text-xs text-gray-400 leading-snug">
                  {oficio.descripcion}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-white"
        style={{
          background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-green-200 text-center mb-12 uppercase tracking-wide">
            YO LO HAGO en números
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STATS.map((stat) => (
              <div key={stat.etiqueta} className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-yellow-400 mb-2 drop-shadow">
                  {stat.valor}
                </div>
                <div className="text-green-200 text-sm sm:text-base font-medium">
                  {stat.etiqueta}
                </div>
                {/* Línea decorativa */}
                <div className="w-10 h-0.5 bg-yellow-400 mx-auto mt-3 opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA (preview) ───────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
            Directo. Gratis. Sin comisiones.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            El trabajador publica su perfil, el contratante lo encuentra y le
            escribe por WhatsApp. YO LO HAGO no se lleva nada del trato.
          </p>
          <Link
            to={RUTAS.COMO_FUNCIONA}
            className="inline-block border-2 border-green-800 text-green-800 font-bold px-7 py-3 rounded-xl hover:bg-green-800 hover:text-white active:scale-95 transition-all duration-200 text-sm sm:text-base"
          >
            Ver cómo funciona →
          </Link>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <section
        className="relative py-16 px-4 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)' }}
      >
        {/* Patrón de puntos naranja */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.10) 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 drop-shadow">
            ¿Tienes un oficio? Publícalo hoy.
          </h2>
          <p className="text-orange-100 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Crea tu tarjeta laboral en minutos y empieza a recibir contactos de
            personas que necesitan tu trabajo — gratis, sin comisiones.
          </p>
          <Link
            to={RUTAS.REGISTRO}
            className="inline-block bg-white text-orange-700 font-extrabold px-10 py-4 rounded-xl hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-xl text-base sm:text-lg"
          >
            Registra tu oficio gratis →
          </Link>
          <p className="text-orange-200 text-xs mt-4">
            Sin tarjeta de crédito · Sin contratos · Cancela cuando quieras
          </p>
        </div>
      </section>
    </main>
  )
}
