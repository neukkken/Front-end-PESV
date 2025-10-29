import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext.jsx";
import { TableSkeleton } from "../../../components/ui/SkeletonTable";
import { Pencil, Eye, Car, Search, X, ChevronDown, ChevronRight, RefreshCw, Plus, File, FileText, Calendar, Download, DownloadCloud, DownloadCloudIcon, User, Cog, ArrowBigRight, Check, ArrowRight, User2 } from "lucide-react";
import { Pagination } from "../../../components/ui/Pagination";
import { getPaginatedUsers } from "../../../utils/Pagination.js";
import { Link } from "react-router-dom";
import Modal from "../../../components/ui/Modal.jsx";
import { convertirFecha } from "../../../utils/Fecha.js";
import { SoftLoader } from "../../../components/ui/LoaderSot.jsx";
import { ModalDocumentsRegister } from "../../../components/ModalDocumentRegister.jsx";
//Download
import { handleDownload } from "../../../utils/DownloadPdf.js";
//Toatify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GestionVehiculos = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('vehicule'); // 'vehicule view' o 'Documents'
    const [usuarios] = useState(JSON.parse(sessionStorage.getItem("users"))) ?? [];
    const [busquedaUser, setBusquedaUser] = useState("");

    const [modalRegisterDocument, setModalRegisterDocument] = useState(false);
    const { getAllVehiuculos, getVehiculeDetail, getDocsVehiuleById, editVehiculoInfo } = useAdmin(); // Función para obtener usuarios
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Número de usuarios por página

    const [loadingModal, setLoadingModal] = useState(false);
    const [vehiculo, setVehiculo] = useState([])
    const [vehiculoAsign, setVehiculoAsign] = useState([])
    const [documents, setDocuments] = useState([]);
    const [idDoc, setIdDoc] = useState(null); //Para Anadir un nuevo doc

    const [asignModal, setAsignModal] = useState(false);


    //Estados Filtros
    const [clasesVehiculos, setClasesVehiculos] = useState(JSON.parse(sessionStorage.getItem("clasesVehiculos")));
    const [zonasVehiculos, setZonasVehiculos] = useState(JSON.parse(sessionStorage.getItem("zonas")));
    const [tiposVehiculos, setTiposVehiculos] = useState(JSON.parse(sessionStorage.getItem("tiposVehiculos")));


    const [textoFilter, setTextoFilter] = useState('');
    const [claseVehiculoFilter, setClaseVehiculoFilter] = useState('');
    const [zonaVehiculoFilter, setZonaVehiculoFilter] = useState('');
    const [tiposVehiculoFilter, setTiposVehiculoFilter] = useState('');

    // 🔹 Función para obtener usuarios
    const getVehiculos = async () => {
        setLoading(true);
        try {
            const storedVehicules = await getAllVehiuculos();
            setVehiculos(storedVehicules); // Guardar todos los usuarios en el estado
            const totalUsers = storedVehicules?.length;
            // Calcula el número total de páginas
            setTotalPages(Math.ceil(totalUsers / limit));
            // Usamos la función para obtener los usuarios de la página actual
            const currentUsers = getPaginatedUsers(storedVehicules, currentPage, limit);
            setVehiculos(currentUsers);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getVehiculos();
    }, [currentPage]);

    const handleRefresh = () => {
        sessionStorage.removeItem("vehiculos");
        getVehiculos();
    };

    const getVehiculeInfoModal = async (id_vehiculo) => {
        setModalContent('vehicule')
        setModalOpen(true);
        setLoadingModal(true);
        try {
            const response = await getVehiculeDetail(id_vehiculo);
            if (response.status === 200) {
                setLoadingModal(false);
                const vehic = response.data.data;
                setVehiculo(vehic);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const getDocsVehiculesModal = async (id_vehiculo) => {
        if (!id_vehiculo) {
            return alert("Error")
        }
        setModalContent('documents')
        setModalOpen(true);
        setLoadingModal(true);
        setIdDoc(id_vehiculo)

        const response = await getDocsVehiuleById(id_vehiculo);
        if (response.status == 200) {
            setLoadingModal(false);
            const docs = response.data.data;
            setDocuments(docs);

        }
    }

    const asignarVehiculo = async (id_vehiculo) => {
        setAsignModal(true);
        try {
            const response = await getVehiculeDetail(id_vehiculo);
            if (response.status === 200) {
                setLoadingModal(false);
                const vehic = response.data.data;
                setVehiculoAsign(vehic);
            }
        } catch (error) {
            console.log(error);

        }
    }

    const handleClearFilters = () => {
        setTextoFilter('');
        setClaseVehiculoFilter('');
        setZonaVehiculoFilter('');
        setTiposVehiculoFilter('');
    };
    const textoFilterLower = textoFilter.trim().toLowerCase();
    const filterVehiuclo = vehiculos?.filter((vehiculo) => {
        return (
            (
                String(vehiculo.placa).toLocaleLowerCase().includes(textoFilterLower) ||
                String(vehiculo.marca).toLocaleLowerCase().includes(textoFilterLower) ||
                String(vehiculo.servicio).toLocaleLowerCase().includes(textoFilterLower) ||
                String(vehiculo.modeloVehiculo).toLocaleLowerCase().includes(textoFilterLower) ||
                String(vehiculo.idUsuario?.name).toLocaleLowerCase().includes(textoFilterLower) ||
                String(vehiculo.color).toLocaleLowerCase().includes(textoFilterLower) ||
                String(vehiculo.capacidadVehiculo).toLocaleLowerCase().includes(textoFilterLower)
            )
        )
    }).filter((vehiculo) => {
        return claseVehiculoFilter === '' || vehiculo.idClaseVehiculo?._id === claseVehiculoFilter;

    }).filter((vehiculo) => {
        return zonaVehiculoFilter === '' || vehiculo.idZona?._id === zonaVehiculoFilter;

    }).filter((vehiculo) => {
        return tiposVehiculoFilter === '' || vehiculo.idActividadVehiculo?._id === tiposVehiculoFilter;
    })

    const textobusquedaUserLower = busquedaUser.trim().toLowerCase();
    const filterUserAsign = usuarios.filter((usuario) => {
        return (
            (
                String(usuario.name).toLocaleLowerCase().includes(textobusquedaUserLower) ||
                String(usuario.lastName).toLocaleLowerCase().includes(textobusquedaUserLower) ||
                String(usuario.numeroDocumento).toLocaleLowerCase().includes(textobusquedaUserLower) ||
                String(usuario.email).toLocaleLowerCase().includes(textobusquedaUserLower)

            )
        )
    })

    return (
        <div className="p-6">

            <ToastContainer position="top-center" />

            {/* Encabezado */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>/Pesv</span>
                <ChevronRight className="h-4 w-4" />
                <span >Gestión de Vehículos y Equipos</span>
            </div>

            {/* Page Title and Refresh Button */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mt-5">Gestión de Vehículos y Equipos</h1>

                <div className=" flex gap-3">
                    <button onClick={handleRefresh} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <Link title={"Agregar Vehiculo"} to={`/admin/gestion-vehiculos/registro`} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 hover:border-black transition-colors">
                        <Plus className="h-4 w-4 transition-transform duration-200 ease-in-out hover:scale-150 " />
                    </Link>

                </div>
            </div>

            {/* Filters Card */}
            <div className="bg-white p-4 rounded-lg shadow-xl mt-5">
                <div className="flex flex-wrap items-center gap-4 justify-between sm:justify-end">
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={tiposVehiculoFilter}
                            onChange={(e) => {
                                console.log(e.target.value)
                                setTiposVehiculoFilter(e.target.value)
                            }}
                            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            <option disabled value="">Actividad Vehiculo</option>
                            {tiposVehiculos.map((tipo, index) => (
                                <option key={`clase_${index}`} value={tipo._id}>
                                    {tipo.nombreTipo}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                        />
                    </div>
                    {/* Filter 1 */}
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={claseVehiculoFilter}
                            onChange={(e) => setClaseVehiculoFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            <option disabled value="">Clase Vehiculo</option>
                            {clasesVehiculos.map((clase, index) => (
                                <option key={`clase_${index}`} value={clase._id}>
                                    {clase?.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                        />
                    </div>


                    {/* Filter 2 */}
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={zonaVehiculoFilter}
                            onChange={(e) => setZonaVehiculoFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            <option disabled value="">Zona</option>
                            {zonasVehiculos.map((zona, index) => (
                                <option key={`zona_${index}`} value={zona._id}>
                                    {zona.nombreZona}
                                </option>
                            ))}
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
                        className="flex items-center w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={handleClearFilters}
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
                                <th className="px-6 py-4 text-sm font-bold ">Matricula / Codigo</th>
                                {/* <th className="px-6 py-4 text-sm font-bold ">Año</th> */}
                                <th className="px-6 py-4 text-sm font-bold ">Clase de Vehiculo</th>
                                <th className="px-6 py-4 text-sm font-bold ">Usuario</th>
                                <th className="px-6 py-4 text-sm font-bold ">Estado</th>
                                <th className="px-6 py-4 text-sm font-bold ">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton />
                            ) : vehiculos.length > 0 ? (
                                filterVehiuclo.map((vehiculo, index) => (
                                    <tr
                                        key={vehiculo._id}
                                        className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-primaryHover  transition-colors`}
                                    >
                                        <td className="px-6 text-sm py-4 text-gray-700">
                                            {vehiculo.placa || vehiculo.codigo || "-"}
                                        </td>

                                        {/* <td className="px-6 text-sm py-4 text-gray-700">{vehiculo.modeloVehiculo}</td> */}
                                        <td className="px-6 text-sm py-4 text-gray-700">{vehiculo.idClaseVehiculo?.name}</td>

                                        <td className="px-6 text-sm py-4">
                                            {vehiculo.idUsuarioAsignado?.name ? (
                                                <span className="text-gray-700 font-medium">
                                                    {vehiculo.idUsuarioAsignado.name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                                                    <svg className="mr-1.5 h-2 w-2 text-yellow-800" fill="currentColor" viewBox="0 0 8 8">
                                                        <circle cx="4" cy="4" r="3" />
                                                    </svg>
                                                    Sin asignar
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {vehiculo.estadoVehiculo ? (
                                                    <>
                                                        <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                        </span>
                                                        <span className="text-sm font-medium text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                                                            Activo
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                                        <span className="text-sm font-medium text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                                                            Inactivo
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/admin/gestion-vehiculos/edicion/${vehiculo._id}`}
                                                    className="rounded p-1 "
                                                    title="Editar Vehiculo"
                                                >
                                                    <Pencil className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </Link>
                                                <button
                                                    className="rounded p-1 "
                                                    onClick={() => {
                                                        getVehiculeInfoModal(vehiculo._id)
                                                    }}
                                                    title="Visualizar Vehiculo"

                                                >
                                                    <Eye className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        getDocsVehiculesModal(vehiculo._id);

                                                    }}
                                                    className="rounded p-1 " title="Documentos del Vehiculo">
                                                    <File className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        asignarVehiculo(vehiculo._id)
                                                    }}
                                                    className="rounded p-1"
                                                    title="Asignar Vehiculo"
                                                >
                                                    <Cog className="h-5 w-5 text-gray-600 hover:scale-110 transition-all hover:text-black" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No hay Vehiculos aun.
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


            {/* Modal View */}
            <Modal isOpen={isModalOpen && modalContent === 'vehicule'} onClose={() => setModalOpen(false)} >
                <div className="flex flex-col">
                    <div className="bg-primary px-6 py-2 rounded-t-lg">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <Car className="mr-2" />
                            Detalles del Vehículo
                        </h1>
                    </div>

                    {loadingModal && !vehiculo ? (
                        <SoftLoader />
                    ) : (
                        vehiculo && (
                            <div className="space-y-4">
                                <div className="mb-4 p-2 border-b border-gray-300">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Marca:</span>
                                        <span className="font-medium text-gray-800">{vehiculo.marca}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Clase Vehículo:</span>
                                        <span className="font-medium text-gray-800">{vehiculo.idClaseVehiculo?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Modelo:</span>
                                        <span className="font-medium text-gray-800">{vehiculo.modeloVehiculo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Color:</span>
                                        <span className="font-medium text-gray-800">{vehiculo.color}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Capacidad:</span>
                                        <span className="font-medium text-gray-800">{vehiculo.capacidadVehiculo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {vehiculo.placa ? "Placa:" : "Código:"}
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {vehiculo.placa || vehiculo.codigo}
                                        </span>
                                    </div>

                                    {vehiculo.servicio && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Servicio:</span>
                                            <span className="font-medium text-gray-800">{vehiculo.servicio}</span>
                                        </div>
                                    )}
                                    {vehiculo.numero_equipo && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Número de Equipo:</span>
                                            <span className="font-medium text-gray-800">{vehiculo.numero_equipo}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vehículo corporativo:</span>
                                        <span className="font-medium text-gray-800">{vehiculo.VehicleEmpresa ? 'Si' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Fecha de Creacion:</span>
                                        <span className="font-medium text-gray-800">{convertirFecha(vehiculo.fechaCreacion)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Zona:</span>
                                        <span className="font-medium text-gray-800">{vehiculo.idZona?.nombreZona}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Vehículo en uso:</span>
                                        <span className="flex items-center font-medium text-gray-800">
                                            {vehiculo.vehiculoEnUso ? 'Sí' : 'No'}
                                            <span
                                                className={`ml-2 w-3 h-3 rounded-full ${vehiculo.vehiculoEnUso ? 'bg-green-400' : 'bg-red-400'}`}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </Modal>

            {/* Modal Documents */}

            <Modal isOpen={isModalOpen && modalContent === 'documents'} onClose={() => setModalOpen(false)}>
                <div className="divide-y divide-gray-200 my-5">
                    {/* Modal Header */}
                    <div className="bg-primary px-6 py-2 rounded-t-lg flex  justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <Car className="mr-2" />
                            Documentos del Vehículo
                        </h1>
                        <div
                            onClick={() => {
                                setModalOpen(false)
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
                                        <p className="text-sm text-gray-500">{doc?.name}</p>
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
                                            console.log(doc.tipoDocumentoId.nombre);
                                            handleDownload(doc.ruta, doc.tipoDocumentoId.nombre);
                                        }}
                                        // onClick={() => { handleDownload(doc.assetId) }}
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

            <ModalDocumentsRegister isOpen={modalRegisterDocument} setIsOpen={setModalRegisterDocument} id_Vehiculo={idDoc} />


            <Modal isOpen={asignModal} onClose={() => { setAsignModal(false), setVehiculoAsign(null) }}>
                <div className="divide-y divide-gray-200 my-5">
                    {/* Modal Header */}
                    <div className="bg-primary px-6 py-2 rounded-t-lg flex">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <Car className="mr-2" />
                            <ArrowBigRight className="mr-2" />
                            <User className="mr-2" />
                            Asignar Vehículo
                        </h1>
                    </div>

                    <div className="my-3 p-3 bg-white shadow-md rounded-lg border border-gray-200">
                        {!vehiculoAsign ? (
                            <SoftLoader />
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className={`text-sm font-semibold ${vehiculoAsign.idUsuarioAsignado ? "text-red-600" : "text-green-600"}`}>
                                        {vehiculoAsign.idUsuarioAsignado ? `Asignado a ${vehiculoAsign.idUsuarioAsignado?.name} ${vehiculoAsign.idUsuarioAsignado?.lastName} ` : " Disponible para asignación"}
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-bold">Placa:</span> {vehiculoAsign.placa} |
                                        <span className="font-bold"> Marca:</span> {vehiculoAsign.marca} |
                                        <span className="font-bold"> Modelo:</span> {vehiculoAsign.modeloVehiculo} |
                                        <span className="font-bold"> Zona:</span> {vehiculoAsign.idZona?.nombreZona}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input de búsqueda */}
                    <div className="p-4">
                        <div className="relative w-full my-3">
                            <input
                                onChange={(e) => setBusquedaUser(e.target.value)}
                                value={busquedaUser}
                                type="text"
                                placeholder="Buscar Usuario por Número de identificación o nombres"
                                className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* Contenedor con scroll solo en la lista de usuarios */}
                    <div className="max-h-72 overflow-y-auto divide-y">
                        {!usuarios ? (
                            <SoftLoader />
                        ) : filterUserAsign?.length > 0 ? (
                            filterUserAsign.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    {/* Icono y detalles */}
                                    <div className="flex items-center">
                                        <User2 className="text-primary mr-4" />
                                        <div>
                                            <h2 className="text-md font-semibold text-gray-800">{`${user.name} ${user.lastName}`}</h2>
                                            <p className="text-xs text-gray-500">{user.idCargo?.name || "?"}</p>

                                            <p className="text-xs text-gray-500">{user.tipoLicencia}</p>
                                        </div>
                                    </div>

                                    {/* Botón de Seleccionar si sabe  */}
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={async () => {

                                                try {
                                                    const res = await editVehiculoInfo(vehiculoAsign._id, { idUsuarioAsignado: user._id });

                                                    if (res.status === 200 && res.data?.success) {
                                                        toast.success(" Vehículo asignado correctamente", {
                                                            autoClose: 500,
                                                            onClose: () => {
                                                                setAsignModal(false)
                                                                setVehiculoAsign(null)
                                                                setBusquedaUser("")
                                                            }
                                                        });


                                                    } else {
                                                        toast.error(" Error al asignar el vehículo", {
                                                            autoClose: 500,
                                                            onClose: () => {
                                                                setAsignModal(false)
                                                                setVehiculoAsign(null)
                                                                setBusquedaUser("")

                                                            }
                                                        });

                                                    }
                                                } catch (error) {
                                                    toast.error(" Ocurrió un error inesperado", {
                                                        autoClose: 500,
                                                        onClose: () => {
                                                            setAsignModal(false)
                                                            setVehiculoAsign(null)
                                                            setBusquedaUser("")

                                                        }
                                                    });

                                                    console.error("Error al asignar vehículo:", error);
                                                }



                                            }}
                                            className="text-primary hover:text-secondary transition-all hover:scale-105"
                                            title="Asignar"
                                        >

                                            <div className="flex">
                                                <Car size={20} />
                                                <ArrowRight size={20} />
                                                <User size={20} />


                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hay Usuarios disponibles.</p>
                        )}
                    </div>
                </div>
            </Modal>



        </div>
    );

}

export default GestionVehiculos;