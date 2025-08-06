import { X, Bell, CalendarClock, AlertTriangle, AlertCircle, Info, Car, FileWarning, Eye, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";

const NotificationIcon = ({ tipoNotificacion }) => {
    switch (tipoNotificacion) {
        case "info":
            return <Info className="w-5 h-5 text-blue-500" />;
        case "warning":
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case "error":
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        case "desplazamiento_finalizado":
            return <Car className="w-5 h-5 text-gray-500" />;
        case "formulario_con_errores":
            return <FileWarning className="w-5 h-5 text-red-500" />;
        case "vencimiento_documentacion":
            return <FileWarning className="w-5 h-5 text-red-600" />;
        case "documento_proximo_vencer":
            return <CalendarClock className="w-5 h-5 text-orange-500" />;
        default:
            return null;
    }
};

function NotificationsModal({ isOpen, setIsOpen, setNumeroNotify }) {
    const { getAdminNorify, marcarComoLeidaNotify } = useAdmin();
    const [notificaciones, setNotificaciones] = useState([]);
    const [tab, setTab] = useState("noLeidas");

    useEffect(() => {
        getAllAdminNotify();
    }, []);

    const getAllAdminNotify = async () => {
        const data = await getAdminNorify();
        if (data.status === 200 && data.data.success) {
            const notificacionesData = data.data.data; //reverse si no funciona mi bro
            setNotificaciones(notificacionesData);

            // Actualiza el número de notificaciones no leídas en el estado global
            const noLeidas = notificacionesData.filter(n => !n.leida).length;
            setNumeroNotify(noLeidas);
        }
    };

    const funMarcarComoLeida = async (id_notify) => {
        const response = await marcarComoLeidaNotify(id_notify);
        if (response.status === 200) {
            getAllAdminNotify(); // Recargar las notificaciones después de marcar como leída
        }
    };

    const marcarComoLeida = (_id) => {
        setNotificaciones(prev =>
            prev.map(n => (n._id === _id ? { ...n, leida: true } : n))
        );
        funMarcarComoLeida(_id);
    };

    const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);
    const notificacionesLeidas = notificaciones.filter(n => n.leida);

    return (
        <>
            <div
                className={`fixed inset-x-0 top-0 flex justify-center z-50 
        transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
            >
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-b-xl">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Pestañas */}
                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-2 text-center ${tab === "noLeidas" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
                            onClick={() => setTab("noLeidas")}
                        >
                            📌 No Leídas
                        </button>
                        <button
                            className={`flex-1 py-2 text-center ${tab === "leidas" ? "border-b-2 border-green-500 font-bold" : "text-gray-500"}`}
                            onClick={() => setTab("leidas")}
                        >
                            📖 Leídas
                        </button>
                    </div>

                    {/* Contenido */}
                    <div className="max-h-[70vh] overflow-y-auto p-4">
                        {tab === "noLeidas" ? (
                            notificacionesNoLeidas.length > 0 ? (
                                notificacionesNoLeidas.map((notification) => (
                                    <div key={notification._id} className="flex items-start space-x-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <NotificationIcon tipoNotificacion={notification.tipoNotificacion} />
                                        <div className="flex-1 cursor-pointer">
                                            <p className="text-gray-800">{notification.detalle}</p>
                                            <p className="text-sm text-gray-500 mt-1">{notification.fechaNotificacion}</p>
                                        </div>
                                        <button
                                            title="Marcar Como Leida"
                                            className="text-sm text-blue-500"
                                            onClick={() => marcarComoLeida(notification._id)}
                                        >
                                            <Check className="text-primary hover:scale-125 transition-all" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No tienes notificaciones nuevas.</p>
                            )
                        ) : (
                            notificacionesLeidas.length > 0 ? (
                                notificacionesLeidas.map((notification) => (
                                    <div key={notification._id} className="flex items-start space-x-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <NotificationIcon tipoNotificacion={notification.tipoNotificacion} />
                                        <div className="flex-1">
                                            <p className="text-gray-400">{notification.detalle}</p>
                                            <p className="text-sm text-gray-500 mt-1">{notification.fechaNotificacion}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No tienes notificaciones leídas.</p>
                            )
                        )}
                    </div>
                </div>
            </div>

            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setIsOpen(false)} />}
        </>
    );
}

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [numeroNotify, setNumeroNotify] = useState(0); // Estado para contar notificaciones no leídas

    return (
        <div className="bg-gray-500 h-16 flex items-center justify-end px-6 gap-10">
            {/* Botón de Notificaciones */}
            <button
                title="Notificaciones"
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-full hover:scale-125 transition"
            >
                <Bell className="w-6 h-6 text-white" />
                {numeroNotify > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {numeroNotify}
                    </span>
                )}
            </button>

            {/* Modal de Notificaciones */}
            <NotificationsModal isOpen={isOpen} setIsOpen={setIsOpen} setNumeroNotify={setNumeroNotify} />

            {/* Logo */}
            <img
                src={`/img/logo_efagram_white.png`}
                alt="Usuario"
                className="w-16 h-16 rounded-full object-contain"
            />
        </div>
    );
};
