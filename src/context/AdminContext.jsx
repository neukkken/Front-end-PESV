import { createContext, useContext, useEffect, useState } from "react";
import AdminService from "../core/services/users.js";
import VehiculeService from "../core/services/vehicules.js";
import UsersService from "../core/services/users.js"
import DocumentsService from "../core/services/documents.js";
import NotifyService from "../core/services/notify.js";
import QuestionsService from "../core/services/questions.js";
import { useAuth } from "../context/AuthContext.jsx";
import { aside } from "framer-motion/client";
import FormsService from "../core/services/forms.js";
import DashboardService from "../core/services/dashboard.js";
import PreoperacionlService from "../core/services/formPreoperacional.js";
const AdminContext = createContext();
const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within provider")
    }
    return context
}

const AdminProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth()
    const [zonas, setZonas] = useState([]);
    const [clasesVehiculos, setClasesVehiculos] = useState([]);
    const [tiposVehiculos, setTiposVehiculos] = useState([]);
    const [servicio, setServicio] = useState([]);

    const [claseUnidad, setClaseUnidad] = useState([]);

    const [cargos, setCargos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [tiposLicencia, setTiposLicencia] = useState([]);
    const [erros, setErrors] = useState([]);
    const [numFormsError, setNumFormsError] = useState(null);


    useEffect(() => {
        getAllSelctVehiculos();
        getALLSelectUser();
        getAllUsers();
        getAllVehiuculos();

    }, [user]);

    const getUsersPorPaginacion = async (lastId, limit) => {
        const userResponse = await AdminService.findUsersPaginados(lastId, limit);
        return userResponse.data

    }

    const getAllUsers = async () => {
        const cachedUsers = sessionStorage.getItem("users");

        if (cachedUsers) {
            const usersLocal = JSON.parse(cachedUsers);
            return usersLocal;
        }

        try {
            const responseUsers = await AdminService.getAllUsers();
            if (responseUsers.data.sucess) {
                const sortedUsers = responseUsers.data.data.reverse(); // Ordenar de más reciente a más antiguo
                sessionStorage.setItem("users", JSON.stringify(sortedUsers)); // Guardar en sessionStorage
                return sortedUsers;
            }
        } catch (error) {
            console.error("Error obteniendo los usuarios:", error);
            return [];
        }
    };

    const getAllVehiuculos = async () => {

        const cachedVehicules = sessionStorage.getItem("vehiculos");

        if (cachedVehicules) {
            const vehiculeLocal = JSON.parse(cachedVehicules);
            return vehiculeLocal;
        }
        else {
            try {
                const vehiculos = await VehiculeService.getAllVehiculos();

                if (vehiculos.data.success) {
                    const sortedVehiculos = vehiculos.data.data.reverse(); // Ordenar de más reciente a más antiguo
                    sessionStorage.setItem("vehiculos", JSON.stringify(sortedVehiculos)); // Guardar en sessionStorage
                    return sortedVehiculos;
                }
            } catch (error) {
                console.log(error)
                console.error("Error obteniendo los vehiculos:", error);

            }

        }







    }

    const filterUserByNameOrIdentiication = async (nameOrCc) => {
        const filterResponse = await AdminService.fil(nameOrCc);
        return filterResponse.data

    }

    const getAllSelctVehiculos = async () => {
        try {

            const zonasStorage = JSON.parse(sessionStorage.getItem('zonas'));

            const clasesVehiculosStorage = JSON.parse(sessionStorage.getItem('clasesVehiculos'));
            const tiposVehiculosStorage = JSON.parse(sessionStorage.getItem('tiposVehiculos'));
            const servicioVehiculosStorage = JSON.parse(sessionStorage.getItem('servicioVehiculos'));
            const sessionStorageStorage = JSON.parse(sessionStorage.getItem('claseUnidad'));


            if (zonasStorage && clasesVehiculosStorage && tiposVehiculosStorage && servicioVehiculosStorage && sessionStorageStorage) {
                setZonas(zonasStorage);
                setClasesVehiculos(clasesVehiculosStorage);
                setTiposVehiculos(tiposVehiculosStorage);
                setServicio(servicioVehiculosStorage)
                setClaseUnidad(sessionStorageStorage);



            } else {
                const selectVehiculos = await VehiculeService.getSelctVehiculos();

                if (selectVehiculos.status === 200) {
                    const { data } = selectVehiculos;



                    setZonas(data.zonas || []);
                    setClasesVehiculos(data.clasesVehiculos || []);
                    setTiposVehiculos(data.tiposVehiculos || []);
                    setServicio(data.servicio || []);
                    setClaseUnidad(data.unidad || []);

                    sessionStorage.setItem('zonas', JSON.stringify(data.zonas));
                    sessionStorage.setItem('clasesVehiculos', JSON.stringify(data.clases));
                    sessionStorage.setItem('tiposVehiculos', JSON.stringify(data.tipos));
                    sessionStorage.setItem('servicioVehiculos', JSON.stringify(data.servicio));
                    sessionStorage.setItem('claseUnidad', JSON.stringify(data.unidad));
                }
            }


        } catch (error) {
            console.error("Error al obtener los vehículos:", error);
        }
    };

    const getALLSelectUser = async () => {
        try {
            // Obtener datos de sessionStorage con validación
            let cargos = [], roles = [], tiposLicencia = [];

            try {
                cargos = JSON.parse(sessionStorage.getItem('cargosUser')) || [];
                roles = JSON.parse(sessionStorage.getItem('rolesUser')) || [];
                tiposLicencia = JSON.parse(sessionStorage.getItem('tiposLicencia')) || [];
            } catch (error) {
                console.warn("Error al parsear sessionStorage:", error);
            }

            if (cargos.length && roles.length && tiposLicencia.length) {
                // Si todos los datos están disponibles, solo actualiza el estado
                setCargos(cargos);
                setRoles(roles);
                setTiposLicencia(tiposLicencia);
            } else {
                // Si falta algún dato, hacer la petición al backend
                const responseSelect = await UsersService.getSelectRegisterUser();

                if (responseSelect.status === 200) {
                    const data = responseSelect.data.data;

                    cargos = data.selectCargos || cargos;
                    roles = data.selectRoles || roles;
                    tiposLicencia = data.selectTipoLicencia || tiposLicencia;

                    // Actualizar estados
                    setCargos(cargos);
                    setRoles(roles);
                    setTiposLicencia(tiposLicencia);

                    // Guardar solo los datos obtenidos
                    sessionStorage.setItem('cargosUser', JSON.stringify(cargos));
                    sessionStorage.setItem('rolesUser', JSON.stringify(roles));
                    sessionStorage.setItem('tiposLicencia', JSON.stringify(tiposLicencia));
                }
            }
        } catch (error) {
            console.error("Error al obtener los datos de usuario:", error);
        }
    };



    const uploadDocsVehicule = async (docs) => {

        try {
            const responesDocs = await VehiculeService.registerVehiculeDocuments(docs);
            return responesDocs;
        } catch (error) {
            return error.response;
            console.log("Error en uploadDocsVehicule", error);

        }
    }

    const uploadOneDocVehicule = async (doc) => {
        try {
            const resDoc = await DocumentsService.subirUnDocuemntoAVehiculo(doc);
            return resDoc;

        } catch (error) {
            console.log(error)

        }

    }


    const uploadOneDocUsuario = async (doc) => {
        try {
            const resDoc = await DocumentsService.subirUnDocuemntoAUsuario(doc);
            return resDoc;

        } catch (error) {
            console.log(error)

        }

    }

    const registerAdminVehicule = async (data_vehicule) => {
        try {

            const response = await VehiculeService.registerAdminVehicule(data_vehicule);
            sessionStorage.removeItem("vehiculos");
            return response;

        } catch (error) {
            console.log("Error en registerAdminVehicule", error.response.data);
            return error.response

        }
    }

    const registerUser = async (user) => {
        try {
            const response = await UsersService.registerUserAdmin(user);
            return response;

        } catch (error) {
            console.log("Error en registerAdminVehicule");
            console.log(error);
            setErrors([error.response.data.message])
            return error.response

        }

    }

    const uploadDocsUser = async (docs) => {

        try {
            const responesDocs = await UsersService.registerUserDocuments(docs);
            return responesDocs;
        } catch (error) {
            return error.response
            console.log("Error en uploadDocsUser", error);

        }
    }

    const getUserById = async (id_user) => {
        const response = await UsersService.getUserById(id_user);
        return response;

    }

    const updateInfoUser = async (id_user, user_data) => {
        const response = await UsersService.updateUser(id_user, user_data);
        return response;

    }

    const getVehiculeDetail = async (id_vehiculo) => {
        const response = await VehiculeService.getVehiculoById(id_vehiculo);
        return response;

    }

    const getDocsVehiuleById = async (id_vehiculo) => {
        const response = await VehiculeService.getDocsVehiuleById(id_vehiculo);
        return response;

    }

    const getDocsUserById = async (id_user) => {
        const response = await UsersService.getDocsByIdUser(id_user);
        return response;

    }

    const downloadDocsAssetId = async (asssetId) => {
        const response = await VehiculeService.descargaDocsByAssetId(asssetId);
        return response;
    }

    const editVehiculoInfo = async (id_vehiculo, vehicule_data) => {
        const response = await VehiculeService.editInfoVehiculo(id_vehiculo, vehicule_data);
        return response;
    }

    const getUserVehicules = async (id_user) => {
        const response = await VehiculeService.getVehiculosByUser(id_user);
        return response;
    }

    const getDocuemntsPorExpirarYExpirados = async () => {
        try {
            const response = await DocumentsService.findDocuemntsPorExpirarYExpirados();
            return response;
        } catch (error) {
            console.log(error);
        }

    }

    const registerNewNotify = async (new_notify) => {
        try {
            const response = await NotifyService.createNotify(new_notify);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    const getNotifyByIdUser = async (id_user) => {
        const responesNotify = await NotifyService.getNotifyByIdUser(id_user);
        return responesNotify;

    }



    const getPreguntas = async () => {
        const response = await QuestionsService.getPreguntas()
        return response;
    }

    const postPreguntas = async (data_preguntas) => {
        const response = await QuestionsService.postPreguntas(data_preguntas);
        return response
    }

    const getFormularios = async () => {
        const response = await FormsService.getForms()
        return response
    }

    const postFormularios = async (form) => {
        const response = await FormsService.postForm(form);
        return response
    }

    const getALLFormsRespondidosHoy = async () => {
        const response = await PreoperacionlService.getFomulariosPreOperacionalDiarios();
        return response;

    }

    const getFormularioPreById = async (id) => {
        const response = await PreoperacionlService.getFormularioPreById(id);
        return response;
    }

    // const getFormsPreWithErrors = async () => {
    //     const response = await PreoperacionlService.getFomsWhitErrors();
    //     if (response.status == 200) {
    //         const numFormulariosConErrores = response.data.data.length;
    //         setNumFormsError(numFormulariosConErrores);
    //     }
    // }

    const getAdminNorify = async () => {
        const response = await NotifyService.getNotifyAdmin();
        return response;

    }

    const marcarComoLeidaNotify = async (id_notify) => {
        const response = await NotifyService.marcarComoLeidaSiSabe(id_notify);
        return response;
    }

    const getTiposDocumentosVehiculo = async () => {
        const response = await DocumentsService.findTiposDocumentosVehiculo();
        return response;
    }

    const getDashBoardData = async () => {
        const response = await DashboardService.getDashboardData();
        return response
    }

    const getVehicleDocuemntById = async (id_doc) => {
        const response = await DocumentsService.getVehicleDocuemntById(id_doc);
        return response;

    }

    const getUserDocuemntById = async (id_doc) => {
        const response = await DocumentsService.getUserDocuemntById(id_doc);
        return response;

    }

    const updateVehicleDoc = async (id_doc, data) => {
        const response = await DocumentsService.updateVehiucleDoc(id_doc, data);
        return response;

    }

    const updateUserDoc = async (id_doc, data) => {
        const response = await DocumentsService.updateUserDoc(id_doc, data);
        return response;

    }

    const getInfoFomrsPreoperacionalesFaltantes = async () => {
        const response = await PreoperacionlService.getFomrsFaltantesByVehiculo();
        return response;

    }

    const markPreoperaconalFaltantes = async () => {
        const response = await PreoperacionlService.markPreoperaconalFaltantes();
        return response;
    }

    const getPreoperacionalById = async (id_form) => {
        const response = await PreoperacionlService.getPreoperacionalById(id_form);
        return response;
    }

    const deletePreoperacionalById = async (id_form) => {
        const response = await PreoperacionlService.deletePreoperacionalById(id_form);
        return response;
    }


    const updatePreoperacionalById = async (id, data) => {
        const response = await PreoperacionlService.updateePreoperacionalById(id, data);
        return response;

    }

    return (
        <AdminContext.Provider value={{
            registerNewNotify,
            getUsersPorPaginacion,
            getDashBoardData,
            getAllUsers,
            getAllVehiuculos,
            registerAdminVehicule,
            uploadDocsVehicule,
            registerUser,
            uploadDocsUser,
            getUserById,
            updateInfoUser,
            getVehiculeDetail,
            getDocsVehiuleById,
            downloadDocsAssetId,
            editVehiculoInfo,
            getDocsUserById,
            getUserVehicules,
            getDocuemntsPorExpirarYExpirados,
            getALLFormsRespondidosHoy,
            getAdminNorify,
            marcarComoLeidaNotify,
            getTiposDocumentosVehiculo,
            uploadOneDocVehicule,
            uploadOneDocUsuario,
            zonas,
            clasesVehiculos,
            tiposVehiculos,
            servicio,
            claseUnidad,
            cargos,
            roles,
            tiposLicencia,
            getPreguntas,
            postPreguntas,
            getFormularios,
            postFormularios,
            getFormularioPreById,
            numFormsError,
            getVehicleDocuemntById,
            getUserDocuemntById,
            updateVehicleDoc,
            updateUserDoc,
            getInfoFomrsPreoperacionalesFaltantes,
            getNotifyByIdUser,
            markPreoperaconalFaltantes,
            getPreoperacionalById,
            deletePreoperacionalById,
            updatePreoperacionalById

        }}>
            {children}
        </AdminContext.Provider>
    )
}

export { AdminProvider, useAdmin };