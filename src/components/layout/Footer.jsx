import { Link } from 'react-router-dom'
import { APP_NAME, RUTAS } from '../../constants'
import logo from '../../assets/logo.png'

export default function Footer() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="bg-green-800 text-white mt-auto">
      <div className="contenedor py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1 — Marca */}
          <div>
            <div className="bg-white rounded-xl p-2 inline-block mb-2">
          <img
            src={logo}
            alt="Yo Lo Hago"
            className="h-12 w-auto"
          />
        </div>
            <p className="text-sm text-green-200 leading-relaxed">
              Conectamos personas que necesitan un servicio con trabajadores
              calificados de su comunidad.
            </p>
          </div>

          {/* Columna 2 — Navegación */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-400 mb-3">
              Navegar
            </h3>
            <ul className="space-y-2 text-sm text-green-200">
              <li>
                <Link to={RUTAS.HOME} className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to={RUTAS.COMO_FUNCIONA} className="hover:text-white transition-colors">
                  ¿Cómo funciona?
                </Link>
              </li>
              <li>
                <Link to={RUTAS.TRABAJADORES} className="hover:text-white transition-colors">
                  Trabajadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 — Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-400 mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-green-200">
              <li>
                <Link
                  to={`${RUTAS.COMO_FUNCIONA}#habeas-data`}
                  className="hover:text-white transition-colors"
                >
                  Habeas Data
                </Link>
              </li>
              <li>
                <Link to={RUTAS.REGISTRO} className="hover:text-white transition-colors">
                  Registrarme como trabajador
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisora y copyright */}
        <div className="border-t border-green-700 mt-8 pt-6 text-center text-xs text-green-300">
          © {anioActual} {APP_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
