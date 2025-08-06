import React, { useEffect, useState } from 'react';
import { useAdmin } from "../../../context/AdminContext";
import { useParams, Link, useNavigate } from "react-router-dom";

//Toatify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionPesvEdit = () => {
    const [formState, setFormState] = useState("no_reporta");
    const [respuestas, setRespuestas] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const { getPreoperacionalById, updatePreoperacionalById } = useAdmin();

    const loadPreoperacional = async () => {
        try {
            const res = await getPreoperacionalById(id);
            if (res.status !== 200) {
                alert("Error al cargar la información");
                return;
            }

            const data = res.data.data;
            setFormState(data.estadoFormulario ?? "no_reporta");

            const respuestasDelBack = Array.isArray(data.respuestas) ? data.respuestas : [];

            // Convertimos el array de respuestas con estructura adecuada
            const respuestasFormateadas = respuestasDelBack.map((item) => ({
                idPregunta: item.idPregunta._id,
                texto: item.idPregunta.preguntaTexto,
                respuesta: typeof item.respuesta === "boolean" ? item.respuesta : null,
            }));

            setRespuestas(respuestasFormateadas);
        } catch (error) {
            console.error("Error al obtener el formulario:", error);
        }
    };

    useEffect(() => {
        loadPreoperacional();
    }, []);

    const handleFormStateChange = (e) => {
        setFormState(e.target.value);
    };

    const handleRespuestaChange = (idPregunta, valorBoolean) => {
        setRespuestas((prev) =>
            prev.map((r) =>
                r.idPregunta === idPregunta ? { ...r, respuesta: valorBoolean } : r
            )
        );
    };

    const handleGuardar = async () => {
        const respuestasAEnviar = respuestas
            .filter((r) => r.respuesta !== null)
            .map((r) => ({
                idPregunta: r.idPregunta,
                respuesta: r.respuesta,
            }));

        const payload = {
            estadoFormulario: formState,
            respuestas: respuestasAEnviar,
        };
        console.log("Payload para enviar al backend:", payload);

        const loadingUdateToast = toast.loading("Cargando... 🚗");


        const res = await updatePreoperacionalById(id, payload);
        if (res.status == 200 && res.data.success) {
            toast.update(loadingUdateToast, {
                render: `${res.data.message}`,
                type: "success",
                isLoading: false,
                autoClose: 300,
                onClose: () => {
                    navigate('/admin/configuracion/gestion-pesv');
                }
            });


        }
        else {

            toast.update(loadingUdateToast, {
                render: "Error al cargar usuario ❌",
                type: "error",
                isLoading: false,
                autoClose: 4000,
                onClose: () => {
                    navigate('/admin/gestion-usuarios/edicion/');
                }
            });
        }
        console.log(res)

        // Aquí iría tu POST/PUT
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-6">
            <ToastContainer position="top-center" />
            <h2 className="text-xl font-bold mb-4">Editar Formulario Preoperacional</h2>

            <div className="space-y-4">
                <label className="block font-medium" htmlFor="estadoFormulario">
                    Estado del Formulario
                </label>
                <select
                    id="estadoFormulario"
                    value={formState}
                    onChange={handleFormStateChange}
                    className="w-full border rounded p-2"
                >
                    <option value="operativo">Operativo</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="no_aplica">No Aplica</option>
                    <option value="no_reporta">No Reporta</option>
                    <option value="revisado_corregido">Revisado Corregido</option>
                </select>
            </div>

            {/* Preguntas */}
            <div className="space-y-6 mt-6 border-t pt-6">
                {respuestas.length === 0 ? (
                    <p className="text-gray-500 italic text-center">No hay preguntas cargadas</p>
                ) : (
                    respuestas.map((item) => (
                        <div key={item.idPregunta} className="border p-4 rounded space-y-2">
                            <p className="font-medium">{item.texto}</p>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={`respuesta-${item.idPregunta}`}
                                        value="true"
                                        checked={item.respuesta === true}
                                        onChange={() => handleRespuestaChange(item.idPregunta, true)}
                                    />
                                    <span className="text-green-600">Buen estado</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={`respuesta-${item.idPregunta}`}
                                        value="false"
                                        checked={item.respuesta === false}
                                        onChange={() => handleRespuestaChange(item.idPregunta, false)}
                                    />
                                    <span className="text-red-600">Mal estado</span>
                                </label>
                            </div>
                            {item.respuesta === null && (
                                <p className="text-yellow-600 text-sm italic">Esta pregunta no ha sido respondida.</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-2 mt-6 border-t pt-4">
                <Link
                    to={`/admin/configuracion/gestion-pesv`}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                    Cancelar
                </Link>
                <button
                    type="button"
                    onClick={handleGuardar}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default GestionPesvEdit;
