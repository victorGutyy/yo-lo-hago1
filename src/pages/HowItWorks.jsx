// Página: ¿Cómo funciona? + Verificación de antecedentes + Habeas Data
// Ley 1581 de 2012 — Colombia

const PASOS = [
  {
    numero: '01',
    titulo: 'El trabajador se registra gratis',
    descripcion:
      'Crea su cuenta y completa su tarjeta laboral con nombre, foto, especialidad, ciudad y número de WhatsApp.',
    icono: '📝',
  },
  {
    numero: '02',
    titulo: 'La tarjeta queda visible para todos',
    descripcion:
      'El perfil aparece en el portal público. Cualquier persona puede buscarlo por ciudad u oficio sin registrarse.',
    icono: '👁️',
  },
  {
    numero: '03',
    titulo: 'El contratante contacta por WhatsApp',
    descripcion:
      'Al encontrar al trabajador ideal, le escribe directamente por WhatsApp. Sin intermediarios ni espera.',
    icono: '💬',
  },
  {
    numero: '04',
    titulo: 'Acuerdan el trabajo directamente',
    descripcion:
      'Negocian precio y condiciones entre ellos. YO LO HAGO no cobra comisión ni interviene en el acuerdo.',
    icono: '🤝',
  },
]

const DERECHOS = [
  'Conocer, actualizar y rectificar sus datos personales.',
  'Solicitar prueba de la autorización otorgada al responsable del tratamiento.',
  'Ser informado sobre el uso que se ha dado a sus datos.',
  'Presentar quejas ante la Superintendencia de Industria y Comercio.',
  'Revocar la autorización y/o solicitar la supresión de sus datos.',
  'Acceder de forma gratuita a sus datos personales tratados.',
]

// Flecha decorativa entre pasos (solo escritorio)
function Flecha() {
  return (
    <div className="hidden lg:flex flex-shrink-0 items-center justify-center w-10 pt-16 text-green-300 select-none">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <main>
      {/* ── HERO con gradiente diagonal + patrón de puntos ─────── */}
      <section
        className="relative text-white py-20 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
        }}
      >
        {/* Patrón de puntos superpuesto */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
            backgroundSize: '26px 26px',
          }}
        />
        {/* Acento decorativo esquina derecha */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, #fdd835, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block bg-yellow-400 text-green-900 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 shadow">
            Plataforma gratuita
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5 drop-shadow">
            ¿Cómo funciona{' '}
            <span className="text-yellow-400">YO LO HAGO</span>?
          </h1>
          <p className="text-green-100 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Conectamos trabajadores del oficio con personas que necesitan un
            servicio — de forma <strong className="text-white">directa</strong>,{' '}
            <strong className="text-white">gratuita</strong> y{' '}
            <strong className="text-white">sin comisiones</strong>.
          </p>
        </div>
      </section>

      {/* ── 4 PASOS con conectores ────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-2">
            4 pasos simples
          </h2>
          <p className="text-gray-500 text-center text-sm mb-12">
            Del registro al contacto — todo sin costo y sin intermediarios
          </p>

          {/* Escritorio: fila con flechas conectoras */}
          <div className="hidden lg:flex items-start">
            {PASOS.map((paso, i) => (
              <div key={paso.numero} className="flex items-start flex-1">
                <div className="flex-1 bg-white rounded-2xl border-l-4 border-green-700 shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <span className="text-5xl font-extrabold text-green-100 leading-none mb-1 select-none">
                    {paso.numero}
                  </span>
                  <span className="text-3xl mb-3" role="img" aria-hidden="true">
                    {paso.icono}
                  </span>
                  <h3 className="text-sm font-bold text-green-800 mb-2 leading-snug">
                    {paso.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {paso.descripcion}
                  </p>
                </div>
                {i < PASOS.length - 1 && <Flecha />}
              </div>
            ))}
          </div>

          {/* Móvil / tablet: grid con línea vertical conectora */}
          <div className="lg:hidden space-y-4">
            {PASOS.map((paso, i) => (
              <div key={paso.numero} className="flex gap-4">
                {/* Línea de tiempo izquierda */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center text-sm font-extrabold flex-shrink-0 shadow">
                    {paso.numero}
                  </div>
                  {i < PASOS.length - 1 && (
                    <div className="w-0.5 flex-1 bg-green-200 my-1" />
                  )}
                </div>
                {/* Card */}
                <div className="flex-1 bg-white rounded-2xl border-l-4 border-green-700 shadow-md p-5 mb-2 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {paso.icono}
                    </span>
                    <h3 className="text-sm font-bold text-green-800 leading-snug">
                      {paso.titulo}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {paso.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="/registro"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-200 shadow-md"
            >
              Crear mi tarjeta laboral gratis →
            </a>
          </div>
        </div>
      </section>

      {/* ── VERIFICACIÓN DE ANTECEDENTES ─────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl" role="img" aria-label="escudo">🛡️</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
              Verificación de antecedentes
            </h2>
          </div>

          <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-6 mb-5 shadow-sm">
            <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
              Para mayor seguridad, recomendamos a los contratantes verificar
              los antecedentes judiciales del trabajador antes de contratar.
              Colombia cuenta con el servicio oficial de la{' '}
              <strong>Policía Nacional</strong> para consultar certificados de
              antecedentes de forma gratuita.
            </p>
            <a
              href="https://antecedentes.policia.gov.co:7005/WebJudicial/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-900 active:scale-95 transition-all duration-200 shadow"
            >
              Consultar antecedentes — Policía Nacional
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-yellow-900 font-semibold mb-1">
              ⚠️ Aviso importante
            </p>
            <p className="text-sm text-yellow-800 leading-relaxed">
              <strong>YO LO HAGO NO almacena, procesa ni gestiona información
              judicial</strong> de ningún trabajador. El enlace anterior dirige
              al sitio oficial del Estado colombiano. La plataforma no se
              responsabiliza por el contenido ni la disponibilidad de ese
              servicio externo.
            </p>
          </div>
        </div>
      </section>

      {/* ── POLÍTICA DE PRIVACIDAD Y HABEAS DATA ─────────────────── */}
      <section id="habeas-data" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="inline-block bg-green-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
              Ley 1581 de 2012 — Colombia
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">
              Política de Privacidad y Habeas Data
            </h2>
            <p className="text-gray-500 text-sm">
              Última actualización: abril de 2026
            </p>
          </div>

          <div className="space-y-5">
            {/* Card reutilizable — aplicada manualmente a cada sección */}

            {/* 1. Responsable */}
            <div className="bg-white rounded-2xl border-l-4 border-green-700 shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                Responsable del tratamiento
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>YO LO HAGO</strong> es la plataforma responsable del
                tratamiento de los datos personales recolectados a través de
                este sitio web. Para ejercer sus derechos como titular puede
                escribirnos al correo indicado al final de esta política.
              </p>
            </div>

            {/* 2. Datos que recopilamos */}
            <div className="bg-white rounded-2xl border-l-4 border-green-700 shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                Datos que recopilamos
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Recopilamos únicamente los datos necesarios para publicar la
                tarjeta laboral:
              </p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {[
                  'Nombre completo',
                  'Número de cédula de ciudadanía (verificación interna)',
                  'Fotografía de perfil',
                  'Ciudad o municipio de residencia',
                  'Oficio o especialidad',
                  'Número de WhatsApp para contacto',
                  'Descripción libre de servicios',
                ].map((dato) => (
                  <li key={dato} className="flex items-start gap-2">
                    <span className="text-green-700 font-bold mt-0.5">✓</span>
                    {dato}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Finalidad */}
            <div className="bg-white rounded-2xl border-l-4 border-green-700 shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                Finalidad del tratamiento
              </h3>
              <ul className="text-sm text-gray-600 space-y-1.5 mb-3">
                {[
                  'Publicar la tarjeta laboral del trabajador en el portal.',
                  'Facilitar el contacto directo entre trabajador y contratante.',
                  'Mejorar los servicios de la plataforma.',
                  'Cumplir con obligaciones legales aplicables.',
                ].map((fin) => (
                  <li key={fin} className="flex items-start gap-2">
                    <span className="text-green-700 font-bold mt-0.5">✓</span>
                    {fin}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 italic">
                YO LO HAGO <strong>no vende, cede ni transfiere</strong> datos
                personales a terceros con fines comerciales.
              </p>
            </div>

            {/* 4. Derechos del titular */}
            <div className="bg-white rounded-2xl border-l-4 border-green-700 shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">4</span>
                Derechos del titular — Art. 8, Ley 1581 de 2012
              </h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {DERECHOS.map((derecho) => (
                  <li key={derecho} className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-0.5">→</span>
                    {derecho}
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Manejo de la cédula */}
            <div className="bg-white rounded-2xl border-l-4 border-orange-400 shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-orange-500 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">5</span>
                Manejo de la cédula de ciudadanía
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-900 leading-relaxed">
                El número de cédula se recopila únicamente para validar la
                identidad del trabajador.{' '}
                <strong>
                  Este dato NO se muestra públicamente en la tarjeta laboral
                </strong>{' '}
                ni es visible para los contratantes. Su tratamiento sigue la
                Ley 1581 de 2012 y el Decreto 1377 de 2013.
              </div>
            </div>

            {/* 6. Vigencia */}
            <div className="bg-white rounded-2xl border-l-4 border-green-700 shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">6</span>
                Vigencia de los datos
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Los datos permanecerán en la base de datos mientras el
                trabajador mantenga su cuenta activa. El titular puede
                solicitar la eliminación en cualquier momento; la plataforma
                desactivará la tarjeta y eliminará los datos en un plazo no
                mayor a <strong>15 días hábiles</strong>.
              </p>
            </div>

            {/* 7. Contacto */}
            <div
              className="rounded-2xl p-6 text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
              }}
            >
              <h3 className="text-base font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span className="bg-yellow-400 text-green-900 text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">7</span>
                Contacto para ejercer derechos
              </h3>
              <p className="text-green-100 text-sm leading-relaxed mb-4">
                Para ejercer sus derechos como titular, solicitar corrección,
                supresión o revocar su autorización, escríbanos a:
              </p>
              <a
                href="mailto:privacidad@yolohago.co"
                className="inline-block bg-yellow-400 text-green-900 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-300 active:scale-95 transition-all duration-200 shadow"
              >
                privacidad@yolohago.co
              </a>
              <p className="text-green-300 text-xs mt-4">
                Tiempo de respuesta: máximo 10 días hábiles — Ley 1581 de 2012.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
