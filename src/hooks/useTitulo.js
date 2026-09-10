import { useEffect } from 'react'

// Actualiza el título de la pestaña del navegador por página.
// No afecta las vistas previas al compartir en WhatsApp/Facebook (esas
// leen las etiquetas Open Graph estáticas de index.html, no el DOM).
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · YO LO HAGO` : 'YO LO HAGO — Trabajadores de oficios en Calarcá, Quindío'
  }, [titulo])
}
