import { Pencil, FileWarning, ArrowLeft, ChevronRight, Download, TriangleAlert, Bell, Car, Clock, Forklift, BookText, Eye, X, Edit, Delete } from "lucide-react";
import { Form, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { useAuth } from "../../../context/AuthContext.jsx";

import { Pagination } from "../../../components/ui/Pagination";
import { TableSkeleton } from "../../../components/ui/SkeletonTable.jsx";
import { convertirFecha } from "../../../utils/Fecha.js";
import Modal from ".././../../components/ui/Modal.jsx";
import { FormularioDetalle } from ".././../../components/ui/ModalViewFomr.jsx";

import { getPaginatedUsers } from "../../../utils/Pagination.js";
import { useForm, FormProvider } from "react-hook-form";
import { InputTextArea } from "../../../components/ui/InputTextArea.jsx";

//Toatify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const GestionDocuementos = () => {
    const methods = useForm();
    const { user } = useAuth();
    const { markPreoperaconalFaltantes, getFormularioPreById, registerNewNotify, getALLFormsRespondidosHoy, getInfoFomrsPreoperacionalesFaltantes, deletePreoperacionalById } = useAdmin(); // Función para obtener usuarios
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpen, setIsOpen] = useState(false); //Modal1
    const [open, setOpen] = useState(false);
    const [numFoms, setNumForms] = useState(0);
    const [formId, setFomtId] = useState([]);
    const [totalFaltantes, setTotalFaltantes] = useState(0);
    const [markButton, setMarkButton] = useState(false);
    const [idUser, setIdUser] = useState(null);
    const [forms, setFomrs] = useState([]);

    const limit = 10; // Número de usuarios por página
    // 🔹 Función para obtener usuarios
    const getForms = async () => {
        setLoading(true);
        try {
            const docsResponse = await getALLFormsRespondidosHoy();

            if (docsResponse.status == 200 && docsResponse.data.success) {
                const data = docsResponse?.data.data;
                const dataReverse = data.reverse()
                const num = data.length;
                setNumForms(num);
                setTotalPages(Math.ceil(num / limit));
                const currentDocs = getPaginatedUsers(dataReverse, currentPage, limit);
                setFomrs(currentDocs);

            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const getIndoFomrPreoperacional = async () => {
        const resInfo = await getInfoFomrsPreoperacionalesFaltantes();

        if (resInfo.data.success) {
            const numFaltantes = Array.isArray(resInfo.data.data) ? resInfo.data.data.length : 0;
            setTotalFaltantes(numFaltantes);
        } else {
            setTotalFaltantes(0); // Si no es success, también asigna 0
        }
    };

    useEffect(() => {
        getIndoFomrPreoperacional();

    }, [])


    useEffect(() => {
        getForms();

    }, [currentPage]);


    const generateNewNotify = async (id_user) => {
        if (!id_user) {
            return alert("Eror")
        }
        setIdUser(id_user)
        setIsOpen(true)


    }

    const viewFomCompleto = async (id_form) => {
        if (!id_form) {
            return alert("Error");

        }
        const response = await getFormularioPreById(id_form);
        if (response.status == 200) {
            setOpen(true);
        }
        setFomtId(response.data.data)


    }

    const onSubmit = async (data) => {
        const loadingUpToast = toast.loading("Cargando... 👤");
        const tipoNotificacion = "formulario_preoperacional";

        const newData = { ...data, tipoNotificacion, idUsuario: idUser, enviadoA: 'usuario' }

        const res = await registerNewNotify(newData);

        if (res.status === 200 && res.data.success) {
            toast.update(loadingUpToast, {
                render: "Notificación enviada 🔔",
                type: "success",
                isLoading: false,
                autoClose: 500,
                onClose: () => {
                    setIdUser(null);
                    setIsOpen(false);

                }
            });

        }
        else {
            toast.update(loadingUpToast, {
                render: "Error",
                type: "error",
                isLoading: false,
                autoClose: 500,
                onClose: () => {
                    setIdUser(null);
                    setIsOpen(false);
                }
            });

        }
        console.log(res)
    };


    const funMarkPreoperacional = async () => {
        setMarkButton(true)
        const loadingMarkToast = toast.loading("Cargando... 🚗");
        const res = await markPreoperaconalFaltantes();
        if (res.data.success) {


            toast.update(loadingMarkToast, {
                render: "Formularios Marcados ",
                type: "success",
                isLoading: false,
                autoClose: 1000,
                onClose: () => {
                    setMarkButton(false);
                    getForms();
                }
            });

        }
        else {
            toast.update(loadingMarkToast, {
                render: res.data.message,
                type: "error",
                isLoading: false,
                autoClose: 1000,
                onClose: () => {
                    setMarkButton(false)
                }
            });
        }


    }

    const funDeletePreopercaional = async (id_form) => {
        const loadingDeleteToast = toast.loading("Cargando... ");
        const res = await deletePreoperacionalById(id_form);
        if (res.status == 200 && res.data.success) {

            toast.update(loadingDeleteToast, {
                render: `${res.data.message}`,
                type: "success",
                isLoading: false,
                autoClose: 500,
                onClose: () => {
                    getForms();

                }
            });


        }
        else {
            toast.update(loadingDeleteToast, {
                render: "Error al Eliminar el Preoperacional",
                type: "error",
                isLoading: false,
                autoClose: 4000,

            });

        }

        console.log(res)

    }


    return (
        <div className="p-6">
            <ToastContainer position="top-center" />

            {/* Encabezado */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>/Pesv</span>
                <ChevronRight className="h-4 w-4" />
                <span >Gestión Pesv</span>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mt-5">Gestión de Pesv</h1>

                <button
                    disabled={markButton}
                    onClick={funMarkPreoperacional}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${markButton
                        ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-50'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-600 hover:text-white hover:scale-105'
                        }`}
                >
                    Marcar Faltantes como No Contestados
                </button>




            </div>



            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Formularios Contestados</h3>
                        <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{numFoms}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">El dia de Hoy</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Formularios Pendientes por Contestar
                        </h3>
                        <BookText className="h-5 w-5 text-gray-400 " />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {totalFaltantes ?? 0}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Basado en el número de vehículos registrados Activos
                        </span>


                    </div>
                </div>


            </div>

            {/* Contenedor de Tabla */}
            <div className="w-full p-5 border rounded-xl mb-10 mt-5">
                <div className="bg-white rounded-xl overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="px-6 py-4 text-sm font-bold ">Usuario</th>
                                <th className="px-6 py-4 text-sm font-bold ">Formulario</th>
                                <th className="px-6 py-4 text-sm font-bold ">Estado</th>
                                <th className="px-6 py-4 text-sm font-bold ">Fecha</th>
                                <th className="px-6 py-4 text-sm font-bold ">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <TableSkeleton />
                            ) : forms.length > 0 ? (
                                forms.map((form, index) => (
                                    <tr
                                        key={form._id}
                                        className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-primaryHover  transition-colors`}
                                    >
                                        <td className="px-6 text-sm py-4 text-gray-700">
                                            {form.idUsuario?.name && form.idUsuario?.lastName
                                                ? `${form.idUsuario.name} ${form.idUsuario.lastName}`
                                                : "Usuario desconocido"}
                                        </td>

                                        <td className="px-6 text-sm py-4  text-gray-700">{form.formularioId?.nombreFormulario || 'Formulario'}</td>

                                        <td className="px-6 text-sm py-4 text-gray-700 flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full 
                                                    ${form.estadoFormulario === "en_revision"
                                                        ? "bg-orange-500"
                                                        : form.estadoFormulario === "no_aplica"
                                                            ? "bg-yellow-500"
                                                            : form.estadoFormulario === "no_reporta"
                                                                ? "bg-red-500"
                                                                : form.estadoFormulario === "revisado_corregido" ? "bg-green-500"
                                                                    : "bg-primary"
                                                    }`}
                                            ></span>
                                            {form.estadoFormulario === "en_revision" //Se completo pero tiene errores
                                                ? "En Revision"
                                                : form.estadoFormulario === "no_aplica"
                                                    ? "No Aplica"
                                                    : form.estadoFormulario === "no_reporta" // No se contesto no se reporto
                                                        ? "No Reporta"
                                                        : form.estadoFormulario === "revisado_corregido" ? "Revisado y Corregido"
                                                            : "Operativo"
                                            }
                                        </td>




                                        <td className="px-6 text-sm py-4 text-gray-700">{convertirFecha(form.fechaRespuesta)}</td>



                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    className="rounded p-1 "
                                                    onClick={() => {
                                                        viewFomCompleto(form._id);
                                                    }}
                                                    title="Ver"
                                                >
                                                    <Eye className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </button>





                                                <button
                                                    disabled={form.estadoFormulario === "completado"}

                                                    onClick={() => {
                                                        generateNewNotify(form.idUsuario?._id)
                                                    }}

                                                    className="rounded p-1 "
                                                    title="Notificar"

                                                >
                                                    <Bell
                                                        className={`h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black 
                                                        ${form.estadoFormulario === "completado" ? "opacity-50 cursor-not-allowed hover:scale-100 hover:text-gray-600" : ""}`}
                                                    />
                                                </button>

                                                <Link
                                                    to={user.roleId === "679195b408226e1ef20d8192" ? `edit/${form._id}` : "#"}
                                                    onClick={(e) => {
                                                        console.log(user)
                                                        if (user.roleId !== "679195b408226e1ef20d8192") {
                                                            e.preventDefault(); // Evitar que se navegue si el rol no es el correcto
                                                        }
                                                    }}
                                                    className="rounded p-1"
                                                    title="Editar"
                                                >
                                                    <Edit
                                                 
                                                        className={`h-5 w-5
                                                        ${user.roleId === "679195b408226e1ef20d8192" ? "text-gray-600 hover:scale-110 cursor-pointer opacity-100" : "text-gray-400 cursor-not-allowed opacity-50"}
                                                        transition-all`}
                                                    />
                                                </Link>
                                                <button
                                                    onClick={async () => {
                                                        funDeletePreopercaional(form._id);
                                                    }}
                                                    disabled={user.roleId !== "679195b408226e1ef20d8192"}
                                                    className="rounded p-1"
                                                    title="Eliminar"
                                                >
                                                    <Delete
                                                        className={`h-5 w-5
                                                        ${user.roleId === "679195b408226e1ef20d8192" ? "text-gray-600 hover:scale-110 cursor-pointer opacity-100" : "text-gray-400 cursor-not-allowed opacity-50"}
                                                        transition-all`}
                                                    />
                                                </button>


                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No hay Formularios aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="divide-y divide-gray-200 my-5 ">

                    <div className="">
                        <h2 className="text-2xl font-bold my-3">Enviar Notificación</h2>

                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex gap-2">
                                    <Bell className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                    <p className="text-sm font-bold">Tipo: </p>
                                    <p className="text-sm">Formulario en Pre-operacional</p>

                                </div>
                                <div>
                                    <InputTextArea
                                        name="detalle"
                                        label="Detalle"
                                        icon={Bell}
                                        minLength={6}
                                        maxLength={120}
                                        required
                                    />
                                </div>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </form>

                        </FormProvider>

                    </div>
                </div>
            </Modal>

            <FormularioDetalle open={open} setOpen={setOpen} formData={formId} />
        </div>

    )

}

export default GestionDocuementos;