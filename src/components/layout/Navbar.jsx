import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { APP_NAME, RUTAS } from '../../constants'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  const handleCerrarSesion = async () => {
    await cerrarSesion()
    navigate(RUTAS.HOME)
  }

  const claseEnlace = ({ isActive }) =>
    isActive
      ? 'text-yellow-400 font-semibold border-b-2 border-yellow-400 pb-0.5'
      : 'text-white hover:text-yellow-400 transition-colors'

  return (
    <header className="bg-green-800 shadow-md">
      <nav className="contenedor flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to={RUTAS.HOME}
          className="text-white text-xl font-bold tracking-wide hover:text-yellow-400 transition-colors"
        >
          {APP_NAME}
        </Link>

        {/* Menú escritorio */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li>
            <NavLink to={RUTAS.COMO_FUNCIONA} className={claseEnlace}>
              ¿Cómo funciona?
            </NavLink>
          </li>
          <li>
            <NavLink to={RUTAS.TRABAJADORES} className={claseEnlace}>
              Trabajadores
            </NavLink>
          </li>

          {usuario ? (
            <>
              <li>
                <NavLink to={RUTAS.DASHBOARD} className={claseEnlace}>
                  Mi panel
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleCerrarSesion}
                  className="bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to={RUTAS.LOGIN} className={claseEnlace}>
                  Ingresar
                </NavLink>
              </li>
              <li>
                <Link
                  to={RUTAS.REGISTRO}
                  className="bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Botón hamburguesa móvil */}
        <button
          className="md:hidden text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <div className="md:hidden bg-green-900 px-4 py-4">
          <ul className="flex flex-col gap-4 text-sm">
            <li>
              <NavLink
                to={RUTAS.COMO_FUNCIONA}
                className={claseEnlace}
                onClick={() => setMenuAbierto(false)}
              >
                ¿Cómo funciona?
              </NavLink>
            </li>
            <li>
              <NavLink
                to={RUTAS.TRABAJADORES}
                className={claseEnlace}
                onClick={() => setMenuAbierto(false)}
              >
                Trabajadores
              </NavLink>
            </li>

            {usuario ? (
              <>
                <li>
                  <NavLink
                    to={RUTAS.DASHBOARD}
                    className={claseEnlace}
                    onClick={() => setMenuAbierto(false)}
                  >
                    Mi panel
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setMenuAbierto(false)
                      handleCerrarSesion()
                    }}
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to={RUTAS.LOGIN}
                    className={claseEnlace}
                    onClick={() => setMenuAbierto(false)}
                  >
                    Ingresar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={RUTAS.REGISTRO}
                    className={claseEnlace}
                    onClick={() => setMenuAbierto(false)}
                  >
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
