import LayoutAdmin from "../layouts/LayoutAdmin";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/pagesAuth/Login";
import DashboardPage from "../pages/PagesAdmin/Dashboard";
import GestionUsuariosPage from "../pages/PagesAdmin/Users/GestionUsuarios";
import GestionFromsPage from "../pages/PagesAdmin/Forms/GestionForms";
import GestionPesavPage from "../pages/PagesAdmin/Forms/GestionPesv";
import GestionPesvEdit from "../pages/PagesAdmin/Forms/GestionPesvEdit";

import VehiculosPage from "../pages/PagesAdmin/Vehiculos/GestionVehiculos";
import RegisterVehiculoPage from "../pages/PagesAdmin/Vehiculos/RegisterVehiculo";
import RegisterUsersPage from "../pages/PagesAdmin/Users/RegisterUsuario";
import EditUsuario from "../pages/PagesAdmin/Users/EditUsuario";
import EditVehiculo from "../pages/PagesAdmin/Vehiculos/EditVehiculo";
import GestionDocumentosPage from "../pages/PagesAdmin/Documentos/GestionDocumentos";


export const Routes = createBrowserRouter([
  {
    path: "/", // Ruta raíz de /admin
    element: <Navigate to={"/admin"} />,

  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/admin",
    element: <LayoutAdmin />, // Protege todas las rutas dentro de /admin
    children: [
      { path: "", element: <DashboardPage /> }, // Ruta raíz de admin
      { path: "gestion-usuarios", element: <GestionUsuariosPage /> },
      { path: "gestion-usuarios/registro", element: <RegisterUsersPage /> },
      { path: "gestion-usuarios/edicion/:id", element: <EditUsuario /> },


      { path: "gestion-vehiculos", element: <VehiculosPage /> },
      { path: "gestion-vehiculos/registro", element: <RegisterVehiculoPage /> },
      { path: "gestion-vehiculos/edicion/:id", element: <EditVehiculo /> },


      { path: "documentos", element: <GestionDocumentosPage /> },



      { path: "configuracion/gestion-forms", element: <GestionFromsPage /> },
      { path: "configuracion/gestion-pesv", element: <GestionPesavPage /> },
      { path: "configuracion/gestion-pesv/edit/:id", element: <GestionPesvEdit /> },

      {
        path: "*",
        element: <h1>Página no encontrada</h1>,
      }


    ],
  }
])