import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50 
            transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
   
            <div
                className={`relative bg-white w-[90%] max-w-3xl p-6 rounded-2xl shadow-lg 
                transform transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}
            >
                {/* Botón de Cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-500 hover:text-primary"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Título */}
                {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

                {/* Contenido con scroll si es necesario */}
                <div className="max-h-[70vh] overflow-y-auto text-gray-700 p-3">
                    {children}
                </div>
            </div>
        </div>
    );
}