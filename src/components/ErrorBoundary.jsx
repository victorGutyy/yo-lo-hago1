import { Component } from 'react'

// Atrapa errores de render en cualquier parte del árbol de componentes y
// muestra una pantalla clara en vez de dejar la página en blanco.
// Debe ser un componente de clase: React solo soporta error boundaries así.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Error no controlado:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center py-16 max-w-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Algo salió mal
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Ocurrió un error inesperado. Intentá recargar la página; si el
              problema sigue, escribinos a{' '}
              <a href="mailto:yolohago802@gmail.com" className="text-green-800 underline">
                yolohago802@gmail.com
              </a>
              .
            </p>
            <button
              onClick={() => window.location.assign('/')}
              className="inline-block bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-900 transition-colors text-sm"
            >
              ← Volver al inicio
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
