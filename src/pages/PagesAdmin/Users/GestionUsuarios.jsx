import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { TableSkeleton } from "../../../components/ui/SkeletonTable";
import { Pencil, Eye, Car, RefreshCcwIcon, Search, X, ChevronDown, ChevronRight, RefreshCw, UserCog, Plus, File, Download, Calendar, User, FileText, UserCheck, UserX, Bell, History } from "lucide-react";
import { Pagination } from "../../../components/ui/Pagination";
import { getPaginatedUsers } from "../../../utils/Pagination.js";
import { Link } from "react-router-dom";
import Modal from "../../../components/ui/Modal.jsx";
import { SoftLoader } from "../../../components/ui/LoaderSot.jsx";
import { convertirFecha } from "../../../utils/Fecha.js";
import { handleDownload } from "../../../utils/DownloadPdf.js";
import { ModalDocumentsRegister } from "../../../components/ModalDocumentRegister.jsx";
import { VehicleCard } from "../../../components/ui/CardVehicule.jsx";

const GestionUsuarios = () => {
    const { getAllUsers, getUserById, getDocsUserById, downloadDocsAssetId, getUserVehicules, getNotifyByIdUser } = useAdmin();
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('user');
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [idUser, setIdUser] = useState(null);
    const [userVehiculos, setUserVehiculos] = useState([]);
    const [modalRegisterDocument, setModalRegisterDocument] = useState(false);

    const [infoHistoryNotify, setInfoHistoryNotify] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [documents, setDocuments] = useState([]);
    const limit = 10; // Número de usuarios por página

    // Filters
    const [textoFilter, setTextoFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');

    // 🔹 Cargar usuarios desde sessionStorage o desde API
    const fetchUsers = () => {
        setLoading(true);

        const getUsers = async () => {
            setLoading(true);
            try {
                const res = await getAllUsers();
                setTotalPages(Math.ceil(res.length / limit));
                setUsers(getPaginatedUsers(res, currentPage, limit));
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        getUsers()
    };

    useEffect(() => {
        fetchUsers(); // Llamamos a la función para obtener usuarios cuando cambia la página
    }, [currentPage]);

    // 🔹 Refrescar lista de usuarios
    const handleRefresh = async () => {
        setLoading(true);
        sessionStorage.removeItem("users"); // Eliminar caché de sessionStorage
        fetchUsers(); // Volver a obtener los usuarios desde la API
    };

    // 🔹 Obtener información de usuario para el modal
    const getUserInfoModal = async (id_user) => {
        setIsOpen(true);
        setLoadingModal(true);
        setModalContent("user");

        try {
            const response = await getUserById(id_user);
            if (response.status === 200) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error("Error al obtener usuario:", error);
        } finally {
            setLoadingModal(false);
        }
    };

    // 🔹 Obtener documentos del usuario
    const getDocsUser = async (id_user) => {
        setIsOpen(true);
        setModalContent("documents");
        setIdUser(id_user);
        setLoadingModal(true);

        try {
            const response = await getDocsUserById(id_user);
            if (response.status === 200) {
                setDocuments(response.data.data);
            }
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        } finally {
            setLoadingModal(false);
        }
    };

    // 🔹 Obtener vehículos del usuario
    const getVehiculeUser = async (id_user) => {
        setLoadingModal(true);
        setModalContent("vehicule");
        setIsOpen(true);

        try {
            const response = await getUserVehicules(id_user);
            if (response.status === 200) {
                setUserVehiculos(response.data.data);
            }
        } catch (error) {
            console.error("Error al obtener vehículos:", error);
        } finally {
            setLoadingModal(false);
        }
    };

    // 🔹 Limpiar filtros
    const handleClearFilters = () => {
        setTextoFilter('');
        setEstadoFilter('');
    };

    // 🔹 Filtrar usuarios
    const textoFilterLower = textoFilter.trim().toLowerCase();
    const filterUser = users.filter((user) => {
        return (
            (
                (user.email || "").toLowerCase().includes(textoFilterLower) ||
                (user.lastName || "").toLowerCase().includes(textoFilterLower) ||
                (user.name || "").toLowerCase().includes(textoFilterLower) ||
                (user.numeroDocumento || "").toLowerCase().includes(textoFilterLower) ||
                (user.telefono || "").toLowerCase().includes(textoFilterLower) ||
                (user.idCargo?.name || "").toLowerCase().includes(textoFilterLower) ||
                (user.capacidadVehiculo || "").toString().toLowerCase().includes(textoFilterLower)
            )
        );
    }).filter((user) => {
        return estadoFilter === '' || user.active.toString() === estadoFilter;
    });

    const getAdminNotifyByIdUser = async (id_user) => {
        const resNotify = await getNotifyByIdUser(id_user);


        if (resNotify.data.success) {

            setNotifications(resNotify.data.data)
            console.log(notifications)
        }
    }

    const openHistoryNotify = (id_user) => {
        setInfoHistoryNotify(true);
        getAdminNotifyByIdUser(id_user);
    }

    return (
        <div className="p-6 ">
            {/* Encabezado */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>/Pesv</span>
                <ChevronRight className="h-4 w-4" />
                <span>Gestión de Usuarios</span>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mt-5">Gestión de Usuarios</h1>
                <div className=" flex gap-3">
                    <button onClick={handleRefresh} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <Link title={"Agregar Usuario"} to={`/admin/gestion-usuarios/registro`} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 hover:border-black transition-colors">
                        <Plus className="h-4 w-4 transition-transform duration-200 ease-in-out hover:scale-150 " />
                    </Link>
                </div>
            </div>

            {/* Filters Card */}
            <div className="bg-white p-4 rounded-lg shadow-xl mt-5">
                <div className="flex flex-wrap items-center gap-4 justify-between sm:justify-end">
                    {/* Filter 1 */}
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Estado</option>
                            <option value={true}>Activo</option>
                            <option value={false}>Inactivo</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            value={textoFilter}
                            onChange={(e) => setTextoFilter(e.target.value)}
                            placeholder="Buscar Vehiculos..."
                            className="pl-9 pr-3 py-2 w-full sm:w-[250px] border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Contenedor de Tabla */}
            <div className="w-full p-5 border rounded-xl mb-10">
                <div className="bg-white rounded-xl overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="px-6 py-4 text-sm font-bold ">Nombres</th>
                                <th className="px-6 py-4 text-sm font-bold ">Cargo</th>
                                <th className="px-6 py-4 text-sm font-bold ">Licencia</th>
                                <th className="px-6 py-4 text-sm font-bold ">Estado</th>
                                <th className="px-6 py-4 text-sm font-bold ">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton />
                            ) : users.length > 0 ? (
                                filterUser.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-primaryHover transition-colors`}
                                    >
                                        <td className="px-6 text-sm py-4  text-gray-700">{user.name}</td>
                                        <td className="px-6 text-sm py-4 text-gray-700">{user.idCargo.name}</td>
                                        <td className="px-6 text-sm py-4 text-gray-700">{user.tipoLicencia}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.active ? (
                                                    <>
                                                        <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                        </span>
                                                        <span className="text-sm font-medium text-green-800 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                                                            Activo
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                                        <span className="text-sm font-medium text-red-800 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                                                            Inactivo
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    title="Editar Usuario"
                                                    to={`/admin/gestion-usuarios/edicion/${user._id}`}
                                                    className="rounded p-1 ">
                                                    <Pencil className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </Link>
                                                <button
                                                    title="Ver Usuario"
                                                    on                             Click={() => {
                                                        getUserInfoModal(user._id)
                                                    }}
                                                    className="rounded p-1 ">
                                                    <Eye className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </button>
                                                <button
                                                    disabled={!user.active}
                                                    title="Vehículos del Usuario"
                                                    onClick={() => {
                                                        getVehiculeUser(user._id)

                                                    }}

                                                    className="rounded p-1 ">
                                                    <Car className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </button>
                                                <button
                                                    disabled={!user.active}
                                                    title="Documentos del Usuario"
                                                    onClick={() => [
                                                        getDocsUser(user._id)

                                                    ]}
                                                    className="rounded p-1 ">
                                                    <File className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </button>

                                                <button
                                                    title="Historial de Notificaciones"
                                                    onClick={() => [
                                                        openHistoryNotify(user._id)
                                                    ]}
                                                    className="rounded p-1 ">
                                                    <div className="flex">
                                                        <History className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />                   
                                                    </div>
                                                </button>

                                                {/* <button
                                                    disabled={!user.active}
                                                    title={user.active ? "Usuario Activo" : "Usuario Inactivo"}
                                                    className="rounded p-1 transition-all hover:scale-110"
                                                >
                                                    {user.active ? (
                                                        <UserCheck className="h-5 w-5 text-green-500 hover:text-green-700" />
                                                    ) : (
                                                        <UserX className="h-5 w-5 text-red-500 hover:text-red-700" />
                                                    )}
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No hay usuarios disponibles.
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

            {/* //Modal */}
            <Modal isOpen={isOpen && modalContent === 'user'} onClose={() => setIsOpen(false)}>
                <div className="flex flex-col">
                    <div className="bg-primary px-6 py-2 rounded-t-lg">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <Car className="mr-2" />
                            Detalles del Usuario
                        </h1>
                    </div>
                    {loadingModal && !user ? (
                        <SoftLoader />
                    ) : (
                        user && (
                            <div className="space-y-4">
                                <div className="mb-4 p-2 border-b border-gray-300">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Nombre:</span>
                                        <span className="font-medium text-gray-800">{user.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Apellidos:</span>
                                        <span className="font-medium text-gray-800">{user.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium text-gray-800">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cédula:</span>
                                        <span className="font-medium text-gray-800">{user.numeroDocumento}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Fecha Nacimiento:</span>
                                        <span className="font-medium text-gray-800">{convertirFecha(user.fechaNacimiento)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Telefono:</span>
                                        <span className="font-medium text-gray-800">{user.telefono}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tipo Licencia:</span>
                                        <span className="font-medium text-gray-800">{user.tipoLicencia}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cargo:</span>
                                        <span className="font-medium text-gray-800">{user.idCargo?.name || ''}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </Modal>

            <Modal isOpen={isOpen && modalContent === 'vehicule'} onClose={() => setIsOpen(false)}>
                <div className="flex flex-col">
                    {/* Modal Header */}
                    <div className="bg-primary px-6 py-2 rounded-t-lg overflow-y-auto">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <Car className="mr-2" />
                            Vehículos del Usuario
                        </h1>
                    </div>

                    {loadingModal ? (
                        <SoftLoader />
                    ) : (
                        userVehiculos && userVehiculos.length > 0 ? (
                            <div className="">
                                {userVehiculos.map((vehicle, index) => (
                                    <div key={vehicle._id} className={index === 0 ? "col-span-1" : "col-span-1 md:col-span-1"}>
                                        <VehicleCard vehicle={vehicle} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-lg">
                                No tiene vehículos registrados o asignados.
                            </div>
                        )
                    )}

                </div>
            </Modal>

            {/* Modal Documents */}
            <Modal isOpen={isOpen && modalContent === 'documents'} onClose={() => setIsOpen(false)}>
                <div className="divide-y divide-gray-200 my-5">
                    {/* Modal Header */}
                    <div className="bg-primary px-6 py-2 rounded-t-lg flex justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <User className="mr-2" />
                            Documentos del Usuario
                        </h1>

                        <div
                            onClick={() => {
                                setIsOpen(false)
                                setModalRegisterDocument(true);

                            }}
                            title="Agregar Docuemento"
                            className="">
                            <Plus className="text-white w-8 h-8 hover:text-secondary hover:scale-150 transition-all  " />

                        </div>
                    </div>

                    {/* Loader o Lista de Documentos */}
                    {loadingModal ? (
                        <SoftLoader />
                    ) : documents?.length > 0 ? (
                        documents.map((doc) => (
                            <div
                                key={doc._id}
                                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                {/* Icono del archivo y detalles */}
                                <div className="flex items-center">
                                    <FileText className="text-primary mr-4" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{doc.tipoDocumentoId?.nombre}</h2>
                                        <p className="text-sm text-gray-500">{doc.name}</p>
                                    </div>
                                </div>

                                {/* Fecha de expiración y botón de descarga */}
                                <div className="flex items-center space-x-4">
                                    <div title="Fecha de Expiración" className="flex items-center text-sm text-gray-500">
                                        <Calendar className="mr-1" size={16} />
                                        {doc.fechaExpiracion ? new Date(doc.fechaExpiracion).toLocaleDateString() : "No vence"}
                                    </div>
                                    <button
                                        onClick={() => {
                                            console.log(doc);
                                            handleDownload(doc.ruta, doc.tipoDocumentoId.nombre)
                                        }}
                                        className="text-blue-500 hover:text-blue-600"
                                        title="Descargar Documento"
                                    >
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay documentos disponibles.</p>
                    )}
                </div>
            </Modal>

            <ModalDocumentsRegister isOpen={modalRegisterDocument} setIsOpen={setModalRegisterDocument} id_user={idUser} />

            <Modal isOpen={infoHistoryNotify}
                onClose={() => {
                    setInfoHistoryNotify(false)
                    setNotifications([])

                }}>
                <div className=" p-4">
                    {/* Encabezado del modal */}
                    <div className="p-6 border-b">
                        <h1 className="text-xl font-bold">Historial de Notificaciones</h1>
                    </div>

                    {/* Contenido del modal */}
                    <div className="w-full">
                        <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                            {
                                notifications && notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            onClick={() => {
                                                console.log(notif)
                                            }}
                                            key={notif._id}
                                            className={`p-4 border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${notif.leida
                                                ? 'border-gray-300 bg-white hover:bg-gray-50'
                                                : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-semibold text-gray-800">{notif.detalle}</h5>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${notif.leida
                                                    ? 'bg-gray-200 text-gray-700'
                                                    : 'bg-blue-500 text-white animate-pulse'
                                                    }`}>
                                                    {notif.leida ? 'Leída' : 'Nueva'}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-700">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Fecha Notificación:</span>
                                                    <span className="text-gray-900 font-medium">
                                                        {convertirFecha(notif.fechaNotificacion)}
                                                    </span>
                                                </div>
                                                {/* <div className="flex justify-between items-center">
                                                    <span className="text-gray-500">Expira:</span>
                                                    <span className="text-gray-800 flex items-center gap-2">
                                                        {new Date(notif.fechaExpiracion).toLocaleDateString()}
                                                        {new Date(notif.fechaExpiracion) < new Date() && (
                                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                                                Expirada
                                                            </span>
                                                        )}
                                                    </span>
                                                </div> */}

                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <Bell className="w-12 h-12 mb-2" />
                                        <p className="text-lg">No hay notificaciones disponibles</p>

                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div >
    );
};

export default GestionUsuarios;