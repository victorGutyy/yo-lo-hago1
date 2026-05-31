import { Link } from 'react-router-dom'

// Avatar con inicial cuando no hay foto
function Avatar({ nombre, fotoUrl, size = 'md' }) {
  const sizeClasses = size === 'lg'
    ? 'w-20 h-20 text-2xl'
    : 'w-14 h-14 text-lg'

  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={nombre}
        className={`${sizeClasses} rounded-full object-cover border-2 border-green-100 flex-shrink-0`}
      />
    )
  }
  return (
    <div
      className={`${sizeClasses} rounded-full bg-green-100 text-green-800 font-extrabold flex items-center justify-center flex-shrink-0 border-2 border-green-200`}
    >
      {nombre?.charAt(0).toUpperCase() ?? '?'}
    </div>
  )
}

export default function WorkerCard({ tarjeta }) {
  const perfil = tarjeta.profiles ?? {}
  const nombre = perfil.nombre_completo ?? 'Sin nombre'
  const municipio = perfil.municipio ?? '—'
  const telefono = perfil.telefono ?? ''
  const fotoUrl = tarjeta.foto_url || perfil.foto_url || null
  const oficios = Array.isArray(tarjeta.oficios) ? tarjeta.oficios : []
  const colorDisponibilidad = {
    'Inmediata': 'bg-green-100 text-green-800',
    'Por días': 'bg-yellow-100 text-yellow-800',
    'Fines de semana': 'bg-blue-100 text-blue-800',
    'Semanal': 'bg-orange-100 text-orange-800',
    'Mensual': 'bg-gray-100 text-gray-700',
    'Tiempo completo (lunes a viernes)': 'bg-green-100 text-green-800',
  }
  const colorClase = colorDisponibilidad[tarjeta.disponibilidad] || 'bg-gray-100 text-gray-700'

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Cabecera */}
      <div className="p-5 flex items-start gap-3">
        <Avatar nombre={nombre} fotoUrl={fotoUrl} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm leading-snug truncate">
            {nombre}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <span aria-hidden="true">📍</span>
            <span className="truncate">{municipio}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {tarjeta.anos_experiencia > 0
              ? `${tarjeta.anos_experiencia} año${tarjeta.anos_experiencia !== 1 ? 's' : ''} de experiencia`
              : 'Experiencia no especificada'}
          </p>
        </div>
      </div>

      {/* Oficios */}
      {oficios.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {oficios.slice(0, 3).map((o) => (
            <span
              key={o}
              className="bg-green-50 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-100"
            >
              {o}
            </span>
          ))}
          {oficios.length > 3 && (
            <span className="text-xs text-gray-400 px-1 py-0.5">
              +{oficios.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* Disponibilidad */}
      {tarjeta.disponibilidad && (
        <div className="px-5 pb-4">
          <span className={colorClase + ' text-xs font-semibold px-2 py-1 rounded-full'}>
            ⏱ {tarjeta.disponibilidad}
          </span>
        </div>
      )}

      {/* Acción */}
      <div className="mt-auto px-5 pb-5">
        <Link
          to={`/trabajadores/${tarjeta.user_id}`}
          className="block w-full text-center bg-green-800 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green-900 active:scale-95 transition-all duration-200"
        >
          Ver perfil completo →
        </Link>
      </div>
    </article>
  )
}
