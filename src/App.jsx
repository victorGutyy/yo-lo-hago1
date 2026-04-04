import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RUTAS } from './constants'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Workers from './pages/Workers'
import WorkerProfile from './pages/WorkerProfile'
import CreateCard from './pages/CreateCard'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      {/* Layout principal: Navbar arriba, contenido flexible, Footer abajo */}
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path={RUTAS.HOME} element={<Home />} />
            <Route path={RUTAS.COMO_FUNCIONA} element={<HowItWorks />} />
            <Route path={RUTAS.TRABAJADORES} element={<Workers />} />
            <Route path={RUTAS.PERFIL_TRABAJADOR} element={<WorkerProfile />} />
            <Route path={RUTAS.CREAR_TARJETA} element={<CreateCard />} />
            <Route path={RUTAS.DASHBOARD} element={<Dashboard />} />
            <Route path={RUTAS.LOGIN} element={<Login />} />
            <Route path={RUTAS.REGISTRO} element={<Register />} />
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
