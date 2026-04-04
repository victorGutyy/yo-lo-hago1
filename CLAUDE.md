# REGLAS DE CLAUDE CODE — YO LO HAGO

## Seguridad
- NUNCA commitear .env.local ni .env
- NUNCA exponer SUPABASE_SERVICE_ROLE_KEY en el frontend
- Usar siempre VITE_SUPABASE_ANON_KEY para el cliente

## Stack
- React 18 + Vite + Tailwind CSS v3
- Supabase para auth, base de datos y storage
- React Router v6 para navegación
- NO usamos shadcn/ui en esta fase

## Convenciones
- Componentes en PascalCase
- Funciones utilitarias en camelCase
- Todos los textos de UI en español colombiano
- Comentarios en español

## Colores del proyecto
- Verde principal: #2E7D32
- Naranja acento: #FF6F00
- Amarillo destaque: #FDD835
- Fondo: #F9FAFB
- Texto: #1A1A1A

## Base de datos
- Nunca hacer queries sin RLS activado en Supabase
- Usar siempre el cliente de src/lib/supabaseClient.js

## Orden del MVP
1. Configuración base (App.jsx, enrutador, estilos)
2. HowItWorks.jsx — página cómo funciona + Habeas Data
3. Navbar.jsx y Footer.jsx
4. Register.jsx y Login.jsx con Supabase Auth
5. CreateCard.jsx — formulario tarjeta laboral
6. Workers.jsx — listado público
7. WorkerProfile.jsx — perfil individual
8. Dashboard.jsx — panel del trabajador
9. Home.jsx — landing page final