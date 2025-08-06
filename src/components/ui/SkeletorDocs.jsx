export const SkeletonDocsInfo = () => {
    return (
        <>
            {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden bg-white animate-pulse">
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            {/* Sección de información con icono y texto */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                <div>
                                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                                </div>
                            </div>

                            {/* Estado con estilos dinámicos */}
                            <div className="px-3 py-1 bg-gray-300 rounded-full w-20 h-6"></div>
                        </div>

                        <div className="mt-3">
                            <div className="h-3 bg-gray-300 rounded w-40"></div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex space-x-2">
                                <div className="px-4 py-1.5 bg-gray-300 rounded-md w-24 h-8"></div>
                                <div className="px-4 py-1.5 bg-gray-300 rounded-md w-24 h-8"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};
