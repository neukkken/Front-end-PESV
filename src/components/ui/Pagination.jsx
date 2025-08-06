import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex items-center justify-end gap-2 py-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1} // 🔹 Deshabilitar si es la primera página
                className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="rounded-lg bg-gray-200 px-4 py-1 text-sm">
                Página {currentPage} de {totalPages}
            </span>
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages} // 🔹 Deshabilitar si es la última página
                className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}