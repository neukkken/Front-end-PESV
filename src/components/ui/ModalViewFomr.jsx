import { X, AlertTriangle, CheckCircle, AlertTriangleIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export const FormularioDetalle = ({ open, setOpen, formData }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalles de la Respuesta del Formulario</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="overflow-y-auto p-4 max-h-[calc(90vh-8rem)]">
              <div className="space-y-6">
                {/* Información del Usuario */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>
                  <p>Nombre: {formData?.idUsuario?.name} {formData?.idUsuario?.lastName}</p>
                  <p>Email: {formData?.idUsuario?.email}</p>
                  <p>Número de Documento: {formData?.idUsuario?.numeroDocumento}</p>
                </section>

                {/* Información del Formulario */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Información del Formulario</h3>
                  <p>Nombre del Formulario: {formData?.formularioId?.nombreFormulario}</p>
                  <p className="flex items-center">
                    Estado: {formData?.estadoFormulario === "en_revision"
                      ? "En Revision"
                      : formData?.estadoFormulario === "no_aplica"
                        ? "No aplica"
                        : formData?.estadoFormulario === "no_reporta"
                          ? "No Reporta"
                          : "Operativo"}

                    {formData?.estadoFormulario === "en_revision" ? (
                      <AlertTriangle className="text-orange-500 ml-2" size={20} />
                    ) : formData?.estadoFormulario === "no_aplica" ? (
                      <AlertTriangle className="text-yellow-500 ml-2" size={20} />
                    ) : formData?.estadoFormulario === "no_reporta" ? (
                      <AlertTriangle className="text-red-500 ml-2" size={20} />
                    ) : formData?.estadoFormulario === "revisado_corregido" ? (
                      <CheckCircle className="text-green-500 ml-2" size={20} />
                    ) : (
                      <CheckCircle className="text-primary ml-2" size={20} />
                    )}
                  </p>

                  <p>Fecha de Respuesta: {formData?.fechaRespuesta ? new Date(formData.fechaRespuesta).toLocaleString() : "N/A"}</p>
                </section>

                {/* Respuestas */}

                <section>
                  <h3 className="text-lg font-semibold mb-2">Respuestas</h3>
                  {formData?.respuestas?.map((respuesta, index) => (
                    <div key={respuesta._id} className="mb-4 p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-start">
                        <p className="font-medium flex-grow">
                          {index + 1}. {respuesta.idPregunta?.preguntaTexto}
                        </p>
                        {respuesta.idPregunta?.determinancia && (
                          <AlertTriangle className="text-yellow-500 ml-2" size={20} />
                        )}
                      </div>
                      <p className="mt-1">Respuesta: {respuesta.respuesta ? "Buen estado" : "Mal estado"}</p>

                      {respuesta.idPregunta?.determinancia && (
                        <p className="text-sm text-yellow-600 mt-1">Esta pregunta es determinante</p>
                      )}
                    </div>
                  ))}
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t  border-gray-200 p-4 text-right">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
