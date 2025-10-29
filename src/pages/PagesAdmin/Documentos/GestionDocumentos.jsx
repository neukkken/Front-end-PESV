import { ChevronRight, Bell, Car, User, Shield, File, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { convertirFecha } from "../../../utils/Fecha.js";
import Modal from "../../../components/ui/Modal.jsx";
import { useForm, FormProvider } from "react-hook-form";
import { InputTextArea } from "../../../components/ui/InputTextArea.jsx";
import { InputFile } from "../../../components/ui/InputFile.jsx";
import { InputDateField } from "../../../components/ui/InputDateField.jsx";
import { ToastContainer, toast } from "react-toastify";
import { handleDownload } from "../../../utils/DownloadPdf.js";
import { SkeletonDocsInfo } from "../../../components/ui/SkeletorDocs.jsx";
import { diasPermitidos } from "../../../utils/DiasPermitidosEx.js";
import { InputTextField } from "../../../components/ui/InputTextField.jsx";
import "react-toastify/dist/ReactToastify.css";

const GestionDocumentos = () => {
    const methods = useForm();
    const methodsUpdate = useForm();
    const [originalData, setOriginalData] = useState(null);
    const { setValue } = methodsUpdate;
    const { getDocuemntsPorExpirarYExpirados, registerNewNotify, getVehicleDocuemntById, getUserDocuemntById, updateVehicleDoc, updateUserDoc } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicules] = useState([]);
    const [totalProxVencer, setTotalProxVencer] = useState(0);
    const [totalProxVencerUser, setTotalProxVencerUser] = useState(0);
    const { min, max } = diasPermitidos(1); // Calcula el rango de fechas permitido
    const [documentNotify, setDocumentNotify] = useState('');
    const limit = 5;
    const [searchTerm, setSearchTerm] = useState("")
    const [modalUserinfo, setModalUserInfo] = useState(false);
    const [modalVehicleinfo, setModalVehicleinfo] = useState(false);
    const [selected, setSelected] = useState(null)
    const [activeTab, setActiveTab] = useState("vehicles");
    const [modalUpdate, setModalUpdate] = useState(false);

    // Filtrar vehículos o usuarios según el término de búsqueda
    const filteredItems =
        activeTab === "vehicles"
            ? vehicles.filter((vehicle) =>
                (vehicle.plate || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${vehicle.make || ""} ${vehicle.model || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (vehicle.owner || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
            : users.filter((user) =>
                (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.documentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
            );
    // Obtener la clase de color según el estado
    const getStatusClass = (status) => {
        switch (status) {
            case "valid":
                return "bg-green-500 text-white"; // Documentos válidos (más de 60 días)
            case "warning":
                return "bg-yellow-500 text-black"; // Documentos próximos a vencer (31-60 días)
            case "urgent":
                return "bg-orange-600 text-white"; // Documentos urgentes (30 días o menos)
            case "expired":
                return "bg-red-500 text-white"; // Documentos vencidos
            default:
                return "bg-gray-500 text-white"; // Estado desconocido
        }
    };

    // Obtener el texto del estado
    const getStatusText = (status) => {
        switch (status) {
            case "valid":
                return "Vigente";        // Aún válido
            case "warning":
                return "Por vencer";     // Faltan hasta 30 días para expirar
            case "urgent":
                return "Vence pronto";   // Faltan menos de 7 días para expirar
            case "expired":
                return "Vencido";        // Ya no es válido
            default:
                return "Desconocido";
        }
    };

    const getDocuemnts = async () => {
        setLoading(true);
        try {
            const docsResponse = await getDocuemntsPorExpirarYExpirados();

            if (docsResponse.status === 200 && docsResponse.data.success) {
                const data = docsResponse.data.data;
                const { users, vehicles } = data;
                const totalVehicleDocuments = vehicles.reduce((acc, vehicle) => acc + vehicle.documents.length, 0);
                const totalUserDocuments = users.reduce((acc, vehicle) => acc + vehicle.documents.length, 0);

                setTotalProxVencer(totalVehicleDocuments || 0)
                setTotalProxVencerUser(totalUserDocuments || 0)

                setUsers(users)
                setVehicules(vehicles)

            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDocuemnts();
    }, [originalData])

    const generateNewNotify = async (doc) => {
        setIsOpen(true);
        setDocumentNotify(doc.idUsuario);
    }

    // Open vehicle document details dialog
    const openUserDetails = (det) => {
        setSelected(det)
        setModalUserInfo(true)
    }

    const getVehiculoDocId = async () => {
    }

    const openVehicleDetails = async (detail) => {
        setSelected(detail)
        setModalVehicleinfo(true)

    }
    const [selectedFileName, setSelectedFileName] = useState(""); // Estado para el nombre del archivo

    const onSubmit = async (data) => {
        console.log(data)
        const loadingUpToast = toast.loading("Cargando... 👤");
        const tipoNotificacion = "vencimiento_documentacion";
        //Se pude enviar idDoc o directamnte idUsuario

        function obtenerFechaExpiracionDias(dias = 7) {
            const fechaActual = new Date();
            fechaActual.setDate(fechaActual.getDate() + dias);
            return fechaActual;
        }

        // Ejemplo de uso:
        const fechaExpiracion = obtenerFechaExpiracionDias(); // Suma 7 días por defecto
        console.log(fechaExpiracion);

        const newData = { ...data, tipoNotificacion, idUsuario: documentNotify, enviadoA: 'usuario', fechaExpiracion: obtenerFechaExpiracionDias() }

        const res = await registerNewNotify(newData);
        if (res.status === 200 && res.data.success) {
            toast.update(loadingUpToast, {
                render: "Notificación enviada 🔔",
                type: "success",
                isLoading: false,
                autoClose: 500,
                onClose: () => {
                    setDocumentNotify(" ");
                    setIsOpen(false);
                    methods.reset()
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
                    setDocumentNotify(" ");
                    setIsOpen(false);
                    methods.reset()
                }
            });
        }
    };

    const onSubmitForm2 = async (data) => {
        if (!originalData) return;

        const formData = new FormData();
        let hasChanges = false;

        // Si el usuario seleccionó un nuevo archivo, lo agregamos
        if (data.file?.length > 0 && data.file[0].name !== selectedFileName) {
            formData.append("file", data.file[0]);
            hasChanges = true;
        }

        // Comparar los demás campos y agregarlos si hay cambios
        Object.keys(data).forEach((key) => {
            if (key !== "file" && data[key] !== originalData[key]) {
                formData.append(key, data[key]);
                hasChanges = true;
            }
        });

        // Si no hay cambios, mostrar mensaje y detener la ejecución
        if (!hasChanges) {
            toast.info("No has realizado cambios", { autoClose: 500 });
            return;
        }

        const loadingUpToast = toast.loading("Actualizando... 👤");

        try {
            let updateDoc;

            if (typeUpdate === "docVehicle") {
                updateDoc = await updateVehicleDoc(originalData.id, formData);
            } else {
                updateDoc = await updateUserDoc(originalData.id, formData);
            }

            // Verificar si la actualización fue exitosa
            if (updateDoc?.data?.success) {
                toast.update(loadingUpToast, {
                    render: updateDoc.data.data.message || "Documento actualizado correctamente ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 500,
                    onClose: () => {
                        setModalUpdate(false);
                        setOriginalData(null);
                        setModalUserInfo(false)

                        // Solo cerrar setModalVehicleinfo si se está actualizando un vehículo
                        if (typeUpdate === "docVehicle") {
                            setModalVehicleinfo(false);
                        }
                    },
                });
            } else {
                throw new Error(updateDoc?.data?.message || "Error en la actualización");
            }
        } catch (error) {
            console.error("Error en la actualización:", error);
            toast.update(loadingUpToast, {
                render: "Error al actualizar el documento ❌",
                type: "error",
                isLoading: false,
                autoClose: 1000,
            });
        }
    };

    const callUpdateVehiculeDoc = async (id_doc) => {
        setTypeUpdate("docVehicle");
        const resDoc = await getVehicleDocuemntById(id_doc);
        if (resDoc.data?.success) {
            const doc = resDoc.data.data;
            const formattedDate = doc.fechaExpiracion
                ? new Date(doc.fechaExpiracion).toISOString().split("T")[0]
                : "";

            const docData = {
                id: doc._id,
                fechaExpiracion: formattedDate,
                numeroDocumento: doc.numeroDocumento
            };

            setOriginalData(docData);
            Object.keys(docData).forEach((key) => setValue(key, docData[key]));

            // Guardar el nombre del archivo en el estado para validar cambios
            setSelectedFileName(doc.name || "");

            setModalUpdate(true);
        }
    };

    const [typeUpdate, setTypeUpdate] = useState("");

    const callUpdateUserDoc = async (id_doc) => {
        setTypeUpdate("docUsuario");
        const resDoc = await getUserDocuemntById(id_doc);
        if (resDoc.data?.success) {

            const doc = resDoc.data.data;
            const formattedDate = doc.fechaExpiracion
                ? new Date(doc.fechaExpiracion).toISOString().split("T")[0]
                : "";

            const docData = {
                id: doc._id,
                fechaExpiracion: formattedDate,
                numeroDocumento: doc.numeroDocumento
            };

            setOriginalData(docData);
            Object.keys(docData).forEach((key) => setValue(key, docData[key]));

            // Guardar el nombre del archivo en el estado para validar cambios
            setSelectedFileName(doc.name || "");

            setModalUpdate(true);
        }
    };

    return (
        <div className="p-6">
            <ToastContainer position="top-center" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>/Pesv</span>
                <ChevronRight className="h-4 w-4" />
                <span>Documentos</span>
            </div>
            <div className="flex flex-col">
                <h1 className="text-3xl font-semibold mt-5">Gestión de Documentos</h1>
                <p className="text-sm text-gray-700">Administre y verifique los documentos proximos a vencer de usuarios y vehículos</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentos de Vehículos Próximos a Vencer</h3>
                        <Car className="h-5 w-5 text-yellow-400 dark:text-gray-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalProxVencer}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">En los próximos 60 días</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentos de Usuarios Próximos a Vencer</h3>
                        <User className="h-5 w-5 text-yellow-400 " />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalProxVencerUser}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">En los próximos 60 días</span>
                    </div>
                </div>
            </div>


            <div className="flex mb-6 border rounded-lg overflow-hidden mt-5">
                <button
                    className={`flex-1  px-4 flex justify-center items-center ${activeTab === "vehicles" ? "bg-primaryHover text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    onClick={() => setActiveTab("vehicles")}
                >
                    <Car className="w-5 h-5" />
                    Vehículos
                </button>
                <button
                    className={`flex-1 py-3 px-4 flex justify-center items-center ${activeTab === "users" ? "bg-primaryHover text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    onClick={() => setActiveTab("users")}
                >
                    <User className="w-5 h-5" />
                    Usuarios
                </button>
            </div>


            {/* Lista de elementos */}
            <div className="space-y-4">
                {loading ? (
                    <SkeletonDocsInfo />
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id || item.idUsuario} className="border rounded-lg overflow-hidden bg-white">
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    {/* Sección de información con icono y texto */}
                                    <div className="flex items-center space-x-3">
                                        <Shield />
                                        <div>
                                            <h3 className="text-lg font-bold">
                                                {activeTab === "vehicles" ? item.plate : item.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {activeTab === "vehicles"
                                                    ? `${item.make} ${item.model} (${item.year})`
                                                    : item.documentId}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Estado con estilos dinámicos */}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item.status)}`}>
                                        {getStatusText(item.status)}
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <p className="text-gray-600">
                                        {activeTab === "vehicles" ? `Propietario: ${item.owner}` : `Email: ${item.email}`}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                activeTab === "vehicles"
                                                    ? openVehicleDetails(item)
                                                    : openUserDetails(item);
                                            }}
                                            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            disabled={!item.idUsuario}
                                            onClick={() => item.idUsuario && generateNewNotify(item)}
                                            className={`px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 
                                            ${!item.idUsuario ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            Notificar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-white rounded-lg border">
                        <p className="text-gray-500">
                            No se encontraron documetos de {activeTab === "vehicles" ? "vehículos" : "usuarios"} proximos a vencer
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de notifica */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="divide-y divide-gray-200 my-5 ">
                    <div className="">
                        <h2 className="text-2xl font-bold my-3">Enviar Notificación</h2>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex gap-2">
                                    <Bell className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                    <p className="text-sm font-bold">Tipo: </p>
                                    <p className="text-sm">Vencimiento Documentación ${documentNotify}</p>

                                </div>
                                <div>
                                    <InputTextArea
                                        name="detalle"
                                        label="Detalle"
                                        icon={Bell}
                                        minLength={6}
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

            {/* <Modal isOpen={info} onClose={() => setInfo(false)}> */}
            <Modal isOpen={modalVehicleinfo} onClose={() => setModalVehicleinfo(false)}>
                <div className="max-w-3xl">
                    {selected && (
                        <>
                            {/* Encabezado del modal */}
                            <div className="p-6 border-b">
                                <h1 className="text-xl font-bold">
                                    Documentos del Vehículo: {selected.plate}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selected.make} {selected.model} ({selected.year}) • Propietario: {selected.owner}
                                </p>
                            </div>

                            {/* Contenido del modal */}
                            <div className="w-full mt-4">
                                <div className="mt-2 h-[300px] overflow-y-auto p-4">
                                    <div className="grid gap-6">
                                        {selected.documents.map((doc) => (
                                            <div key={doc.id} className="p-4 border rounded-md">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-bold">{doc.name.nombre}</h5>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(doc.status)}`}
                                                    >
                                                        {getStatusText(doc.status)}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 mb-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Número de documento:</span>
                                                        <span className="text-gray-900">{doc.numeroDocumento}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Fecha de vencimiento:</span>
                                                        <span className="text-gray-900">{convertirFecha(doc.fechaExpiracion)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Días restantes:</span>
                                                        <span className="text-gray-900">{doc.daysRemaining} días</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <div
                                                        onClick={() => {
                                                            handleDownload(doc.ruta, doc.name.nombre || "PesvDocuemt")
                                                        }}
                                                        className="cursor-progress px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-blue-100"
                                                    >
                                                        Descargar Documento
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            callUpdateVehiculeDoc(doc.id)
                                                        }}
                                                        className="px-3 py-1.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 ">
                                                        Actualizar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pie del modal */}
                            <div className="mt-4 p-6 border-t flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50"
                                    onClick={() => setModalVehicleinfo(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>


            <Modal isOpen={modalUserinfo} onClose={() => setModalUserInfo(false)}>
                <div className="max-w-3xl">
                    {selected && (
                        <>
                            {/* Encabezado del modal */}
                            <div className="p-6 border-b">
                                <h1 className="text-xl font-bold">Documentos de {selected.name}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Cédula: {selected.documentId} • Correo: {selected.email}
                                </p>
                            </div>

                            {/* Contenido del modal */}
                            <div className="w-full mt-4">
                                <div className="mt-2 h-[300px] overflow-y-auto p-4">
                                    <div className="grid gap-6">
                                        {selected.documents.map((doc) => (
                                            <div key={doc.id} className="p-4 border rounded-md">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-bold">{doc.name.nombre}</h5>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(doc.status)}`}
                                                    >
                                                        {getStatusText(doc.status)}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 mb-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Número de documento:</span>
                                                        <span className="text-gray-900">{doc.numeroDocumento}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Fecha de vencimiento:</span>
                                                        <span className="text-gray-900">{convertirFecha(doc.fechaExpiracion)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Días restantes:</span>
                                                        <span className="text-gray-900">{doc.daysRemaining}días</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleDownload(doc.ruta, doc.name?.nombre || "Documento")}
                                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-blue-100"
                                                    >
                                                        Descargar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            callUpdateUserDoc(doc.id)


                                                        }}
                                                        className="px-3 py-1.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-800">

                                                        Actualizar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pie del modal */}
                            <div className="mt-4 p-6 border-t flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50"
                                    onClick={() => setModalUserInfo(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>


            <Modal isOpen={modalUpdate} onClose={() => setModalUpdate(false)}>
                <div className="p-6 w-full rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Actualizar Documento</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Actualice la información y el archivo del documento
                    </p>

                    <FormProvider {...methodsUpdate}>
                        <form onSubmit={methodsUpdate.handleSubmit(onSubmitForm2)}>
                            {/* Fecha de vencimiento */}
                            <div className="mb-4">
                                <InputDateField
                                    name="fechaExpiracion"
                                    label="Fecha de Expiracion"
                                    icon={Calendar}
                                    required
                                />
                            </div>

                            <div className="mb-5">
                                <InputTextField
                                    name="numeroDocumento"
                                    label="Numero de Documento"
                                    icon={File}
                                    required
                                />

                            </div>

                            {/* Subida de archivo */}
                            <div className="mb-4">
                                <label className="text-sm font-medium">Archivo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer">
                                    <InputFile
                                        icon={Car}
                                        name="file"
                                    />

                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end mt-6 space-x-2">
                                <button
                                    onClick={() => setModalUpdate(false)}
                                    className="px-3 py-1.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </Modal>
        </div>
    );
};
export default GestionDocumentos;