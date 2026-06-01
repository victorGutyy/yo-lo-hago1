import { Link } from 'react-router-dom'
import { APP_NAME, RUTAS } from '../../constants'
import logo from '../../assets/logo.png'

export default function Footer() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="bg-green-800 text-white mt-auto">
      <div className="contenedor py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

          {/* Columna 4 — Contacto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-400 mb-3">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-green-200">
              <li>
                <a
                  href="mailto:yolohago802@gmail.com"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  📧 yolohago802@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61590420396146"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                  Síguenos en Facebook
                </a>
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
