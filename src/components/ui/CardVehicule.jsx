
import { Car } from "lucide-react";


export function VehicleCard({ vehicle }) {
    return (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-4 hover:shadow-md transition duration-300 ease-in-out my-2">
            <div className="flex items-center space-x-4 mb-3">
                <Car className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                    {vehicle.marca} - {vehicle.modeloVehiculo}
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {vehicle.placa && (
                    <p>
                        <span className="font-medium">Placa:</span> {vehicle.placa}
                    </p>
                )}

                {vehicle.codigo && (
                    <p>
                        <span className="font-medium">Codigo:</span> {vehicle.codigo}
                    </p>
                )}

                {vehicle.numero_equipo && (
                    <p>
                        <span className="font-medium">Número de Equipo:</span> {vehicle.numero_equipo}
                    </p>
                )}

                {vehicle.servicio && (
                    <p>
                        <span className="font-medium">Servicio:</span> {vehicle.servicio}
                    </p>
                )}

                <p>
                    <span className="font-medium">Capacidad:</span> {vehicle.capacidadVehiculo}
                </p>
                <p>
                    <span className="font-medium">Actividad:</span> {vehicle.idActividadVehiculo?.nombreTipo}
                </p>

                <p>
                    <span className="font-medium">Color:</span> {vehicle.color}
                </p>
                <p>
                    <span className="font-medium">Zona:</span> {vehicle.idZona?.nombreZona}
                </p>

            </div>
            <div className="mt-3 flex justify-between items-center text-xs">
                <span
                    className={`px-2 py-1 rounded-full ${vehicle.estadoVehiculo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                    {vehicle.estadoVehiculo ? "Activo" : "Inactivo"}
                </span>
                <span
                    className={`px-2 py-1 rounded-full ${vehicle.vehiculoEnUso ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                >
                    {vehicle.vehiculoEnUso ? "En uso" : "No en uso"}
                </span>
            </div>
        </div>
    )
}