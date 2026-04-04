// Página: ¿Cómo funciona? + Verificación de antecedentes + Habeas Data
// Ley 1581 de 2012 — Colombia

const PASOS = [
  {
    numero: '01',
    titulo: 'El trabajador se registra gratis',
    descripcion:
      'Cualquier persona que ofrezca un oficio crea su cuenta y completa su tarjeta laboral con nombre, foto, especialidad, ciudad y número de WhatsApp.',
    icono: '📝',
  },
  {
    numero: '02',
    titulo: 'La tarjeta queda visible para todos',
    descripcion:
      'El perfil del trabajador aparece en el portal público. Cualquier persona puede buscarlo por ciudad u oficio, sin necesidad de registrarse.',
    icono: '👁️',
  },
  {
    numero: '03',
    titulo: 'El contratante contacta por WhatsApp',
    descripcion:
      'Al encontrar al trabajador ideal, el contratante le escribe directamente por WhatsApp. Sin intermediarios, sin formularios, sin espera.',
    icono: '💬',
  },
  {
    numero: '04',
    titulo: 'Acuerdan el trabajo directamente',
    descripcion:
      'El trabajador y el contratante negocian precio y condiciones entre ellos. YO LO HAGO no cobra comisión ni interviene en el acuerdo.',
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

export default function HowItWorks() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-green-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-yellow-400 text-green-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Plataforma gratuita
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            ¿Cómo funciona <span className="text-yellow-400">YO LO HAGO</span>?
          </h1>
          <p className="text-green-100 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Conectamos trabajadores del oficio con personas que necesitan un
            servicio — de forma directa, gratuita y sin comisiones.
          </p>
        </div>
      </section>

      {/* ── 4 PASOS ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-12">
            4 pasos simples
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PASOS.map((paso) => (
              <div
                key={paso.numero}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                {/* Número */}
                <span className="text-4xl font-extrabold text-green-100 leading-none mb-2 select-none">
                  {paso.numero}
                </span>
                {/* Ícono */}
                <span className="text-3xl mb-3" role="img" aria-hidden="true">
                  {paso.icono}
                </span>
                {/* Título */}
                <h3 className="text-base font-bold text-green-800 mb-2">
                  {paso.titulo}
                </h3>
                {/* Descripción */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {paso.descripcion}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="/registro"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-200 shadow"
            >
              Crear mi tarjeta laboral gratis
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

          <div className="bg-green-50 border-l-4 border-green-800 rounded-r-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
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
              className="inline-flex items-center gap-2 bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-900 transition-colors"
            >
              Consultar antecedentes — Policía Nacional
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Aviso de responsabilidad */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5">
            <p className="text-sm text-yellow-900 font-medium mb-1">
              ⚠️ Aviso importante
            </p>
            <p className="text-sm text-yellow-800 leading-relaxed">
              <strong>YO LO HAGO NO almacena, procesa ni gestiona
              información judicial</strong> de ningún trabajador. El enlace
              anterior dirige al sitio oficial del Estado colombiano. La
              plataforma no se responsabiliza por el contenido ni la
              disponibilidad de ese servicio externo.
            </p>
          </div>
        </div>
      </section>

      {/* ── POLÍTICA DE PRIVACIDAD Y HABEAS DATA ─────────────────── */}
      <section id="habeas-data" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {/* Encabezado */}
          <div className="mb-10">
            <span className="inline-block bg-green-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Ley 1581 de 2012 — Colombia
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3">
              Política de Privacidad y Habeas Data
            </h2>
            <p className="text-gray-600 text-sm">
              Última actualización: abril de 2026
            </p>
          </div>

          <div className="space-y-8">
            {/* 1. Responsable del tratamiento */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</span>
                Responsable del tratamiento
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>YO LO HAGO</strong> es la plataforma responsable del
                tratamiento de los datos personales recolectados a través de
                este sitio web. Para ejercer sus derechos como titular puede
                escribirnos al correo de contacto indicado al final de esta
                política.
              </p>
            </div>

            {/* 2. Datos que recopilamos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">2</span>
                Datos que recopilamos
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Recopilamos únicamente los datos necesarios para publicar la
                tarjeta laboral del trabajador:
              </p>
              <ul className="text-sm text-gray-700 space-y-1.5 list-none">
                {[
                  'Nombre completo',
                  'Número de cédula de ciudadanía (solo para verificación interna)',
                  'Fotografía de perfil',
                  'Ciudad o municipio de residencia',
                  'Oficio o especialidad',
                  'Número de WhatsApp para contacto',
                  'Descripción libre de servicios',
                ].map((dato) => (
                  <li key={dato} className="flex items-start gap-2">
                    <span className="text-green-700 mt-0.5">✓</span>
                    {dato}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Finalidad del tratamiento */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">3</span>
                Finalidad del tratamiento
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Los datos personales serán utilizados exclusivamente para:
              </p>
              <ul className="text-sm text-gray-700 space-y-1.5 list-none">
                {[
                  'Publicar la tarjeta laboral del trabajador en el portal.',
                  'Facilitar el contacto directo entre trabajador y contratante.',
                  'Mejorar los servicios de la plataforma.',
                  'Cumplir con obligaciones legales aplicables.',
                ].map((fin) => (
                  <li key={fin} className="flex items-start gap-2">
                    <span className="text-green-700 mt-0.5">✓</span>
                    {fin}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-3 italic">
                YO LO HAGO <strong>no vende, cede ni transfiere</strong> datos
                personales a terceros con fines comerciales.
              </p>
            </div>

            {/* 4. Derechos del titular */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">4</span>
                Derechos del titular (Art. 8, Ley 1581 de 2012)
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Como titular de sus datos personales, usted tiene derecho a:
              </p>
              <ul className="text-sm text-gray-700 space-y-1.5 list-none">
                {DERECHOS.map((derecho) => (
                  <li key={derecho} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5 font-bold">→</span>
                    {derecho}
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Manejo de la cédula */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">5</span>
                Manejo de la cédula de ciudadanía
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-900 leading-relaxed">
                El número de cédula se recopila únicamente para validar la
                identidad del trabajador registrado.{' '}
                <strong>
                  Este dato NO se muestra públicamente en la tarjeta laboral
                </strong>{' '}
                ni es visible para los contratantes. Su tratamiento se realiza
                conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
              </div>
            </div>

            {/* 6. Vigencia de los datos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">6</span>
                Vigencia de los datos
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Los datos permanecerán en la base de datos de YO LO HAGO
                mientras el trabajador mantenga su cuenta activa. El titular
                puede solicitar en cualquier momento la eliminación de su
                información, lo que resultará en la desactivación permanente
                de su tarjeta laboral y la eliminación de sus datos del
                sistema en un plazo no mayor a <strong>15 días hábiles</strong>.
              </p>
            </div>

            {/* 7. Contacto */}
            <div className="bg-green-800 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span className="bg-yellow-400 text-green-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">7</span>
                Contacto para ejercer derechos
              </h3>
              <p className="text-green-100 text-sm leading-relaxed mb-4">
                Para ejercer sus derechos como titular de datos personales,
                solicitar corrección, supresión o revocar su autorización,
                escríbanos a:
              </p>
              <a
                href="mailto:privacidad@yolohago.co"
                className="inline-block bg-yellow-400 text-green-900 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors"
              >
                privacidad@yolohago.co
              </a>
              <p className="text-green-300 text-xs mt-4">
                Tiempo de respuesta: máximo 10 días hábiles según lo
                establecido en la Ley 1581 de 2012.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
