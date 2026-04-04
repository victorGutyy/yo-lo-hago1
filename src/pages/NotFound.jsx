// Página 404
import { Link } from 'react-router-dom'
import { RUTAS } from '../constants'

export default function NotFound() {
  return (
    <main className="contenedor py-24 text-center">
      <h1 className="text-6xl font-bold text-green-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
      <Link to={RUTAS.HOME} className="btn-primario">
        Volver al inicio
      </Link>
    </main>
  )
}
