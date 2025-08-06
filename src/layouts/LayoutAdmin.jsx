import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import Loader from "../components/ui/LoaderEfagram";

const LayoutAdmin = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />

  if (!loading && !isAuthenticated, !user) return <Navigate to="/login" replace />;


  return (
    <div className="flex h-screen">
      {/* Sidebar ocupa toda la altura */}
      <Sidebar />

      {/* Contenedor principal (Header + Contenido) */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header ocupa todo el ancho restante */}
        <div className=" h-16 items-center pb-5 shadow-">
          <Header />
        </div>

        {/* Contenido dinámico debajo del header */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
