import { useState, useEffect } from "react";
import { ChevronRight, RefreshCw, Plus, ArrowLeft, Car } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { SelectField } from "../../../components/ui/SelectField";
import { InputNumberField } from "../../../components/ui/InputNumberField";
import { InputTextField } from "../../../components/ui/InputTextField";
import { InputDateField } from "../../../components/ui/InputDateField";
import { EstadoSwitchField } from "../../../components/ui/InputToggleSwitch";

//Toatify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const EditVehiculo = () => {

    const { zonas, clasesVehiculos, tiposVehiculos, getVehiculeDetail, editVehiculoInfo, servicio, claseUnidad } = useAdmin();
    const [originalData, setOriginalData] = useState(null);
    const { id } = useParams();
    const methods = useForm();
    const navigate = useNavigate();
    const [requierePlaca, setRequierePlaca] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const { setValue } = methods;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVehiculoData();
    }, [])





    const getVehiculoData = async () => {
        const loadingToast = toast.loading("Cargando... 🚗");

        try {
            const res = await getVehiculeDetail(id);

            if (res.status == 200) {
                toast.update(loadingToast, {
                    render: "Vehiculo Cargado ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 300
                });

                const vehiculo = res.data.data;
                const showSlectedInputs = vehiculo.idClaseVehiculo.requierePlaca;
                console.log(vehiculo.idClaseVehiculo.requierePlaca)
                setRequierePlaca(showSlectedInputs)
                const formattedDate = vehiculo.fechaMatricula
                    ? new Date(vehiculo.fechaMatricula).toISOString().split("T")[0]
                    : "";
                const vehiculoData = {
                    servicio: vehiculo.servicio,
                    modeloVehiculo: vehiculo.modeloVehiculo,
                    idActividadVehiculo: vehiculo.idActividadVehiculo?._id,
                    fechaMatricula: formattedDate,
                    idClaseVehiculo: vehiculo.idClaseVehiculo?._id,
                    color: vehiculo.color,
                    idZona: vehiculo.idZona?._id,
                    marca: vehiculo.marca,
                    placa: vehiculo.placa,
                    capacidadVehiculo: vehiculo.capacidadVehiculo,
                    estadoVehiculo: vehiculo.estadoVehiculo,
                    vehiculoEnUso: vehiculo.vehiculoEnUso,
                    claseUnidad: vehiculo.claseUnidad,
                    codigo: vehiculo.codigo,
                    numero_equipo: vehiculo.numero_equipo

                };


                setOriginalData(vehiculoData); // Guardamos datos originales
                Object.keys(vehiculoData).forEach((key) => setValue(key, vehiculoData[key]));
                setLoading(false);
            } else {
                toast.update(loadingToast, {
                    render: "Error al cargar Vehiculo ❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                    onClose: () => {
                        navigate('/admin/gestion-vehiculos');
                    }
                });
            }
        } catch (error) {
            console.log(error)
            toast.update(loadingToast, {
                render: "Error en la solicitud ❌",
                type: "error",
                isLoading: false,
                autoClose: 500,
                onClose: () => navigate(`/admin/gestion-vehiculos`)
            });
        }
    };




    const onSubmit = async (data) => {


        if (!originalData) return;

        // Comparar datos para enviar solo los modificados
        const cambios = {};
        Object.keys(data).forEach((key) => {
            if (data[key] !== originalData[key]) {
                cambios[key] = data[key];
            }
        });

        // Si no hay cambios, mostrar mensaje y detener la ejecución sin abrir un toast de carga
        if (Object.keys(cambios).length === 0) {
            toast.info("No has realizado cambios", { autoClose: 500 });
            return;
        }
        console.log("Datos enviados:", cambios);

        // Solo aquí se muestra el toast de carga porque sí hay cambios
        const loadingUpToast = toast.loading("Cargando... 👤");

        try {
            const res = await editVehiculoInfo(id, cambios);
            console.log(res)

            if (res.status === 200 && res.data.success) {
                sessionStorage.removeItem("vehiculos");
                toast.update(loadingUpToast, {
                    render: res.data.message || "Vehiculo actualizado correctamente ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 500,
                    onClose: () => {
                        sessionStorage.removeItem("vehiculos");
                        navigate("/admin/gestion-vehiculos")
                    }
                });
            } else {
                toast.update(loadingUpToast, {
                    render: res.data.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 500,
                    onClose: () => navigate("/admin/gestion-vehiculos")
                });
            }
        } catch (error) {
            console.log(error)
            toast.update(loadingUpToast, {
                render: error.message || "Error en la actualización ❌",
                type: "error",
                isLoading: false,
                autoClose: 1500
            });
        }
    };


    const handleClaseChange = (e) => {
        console.log(e)
        const idClaseSeleccionada = e;
        const claseSeleccionada = clasesVehiculos.find((clase) => clase._id === idClaseSeleccionada);

        if (claseSeleccionada) {
            setRequierePlaca(claseSeleccionada.requierePlaca);
            console.log(claseSeleccionada.requierePlaca);
            console.log(claseSeleccionada);


            if (!claseSeleccionada.requierePlaca) {
                // Limpiar el campo de placa si no se requiere
                methods.setValue("placa", "");
            }
        } else {
            setRequierePlaca(true);
        }

        methods.setValue("idClaseVehiculo", idClaseSeleccionada);
    };

    return (
        <div className="p-6">
            <ToastContainer position="top-center" />
            {/* Encabezado */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>/Pesv</span>
                <ChevronRight className="h-4 w-4" />
                <span >Gestión de Vehiculos</span>
                <ChevronRight className="h-4 w-4" />
                <span >Edicion</span>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mt-5">Edicion de Vehículos</h1>
                <div className=" flex gap-3">
                    <Link title={"Volver"} to={`/admin/gestion-vehiculos`} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 hover:border-black transition-colors">
                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 ease-in-out hover:scale-150 " />
                    </Link>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg  mt-5 border">


                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} >

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {/* <SelectField
                                name="claseUnidad"            //La categoria hace referencia a si es un vehiculo o es un equipo
                                label="Categoría"
                                options={claseUnidad}
                                icon={Car}

                                required
                            /> */}
                            <SelectField
                                name="idClaseVehiculo"
                                label="Clase"
                                options={clasesVehiculos}
                                onChange={handleClaseChange}
                                icon={Car}
                                required
                            />

                            <SelectField
                                name="idActividadVehiculo"
                                label="Actividad"
                                options={tiposVehiculos}
                                icon={Car}
                                required
                            />

                            <SelectField
                                name="idZona"
                                label="Zona"
                                options={zonas}
                                icon={Car}
                                required
                            />

                            {
                                requierePlaca && (
                                    <SelectField
                                        name="servicio"
                                        label="Servicio"
                                        options={servicio}
                                        icon={Car}
                                        onChange={setServicioSeleccionado}
                                        required
                                    />

                                )
                            }

                            <InputTextField
                                name="marca"
                                label="Marca"
                                placeholder="Ingrese la Marca"
                                icon={Car}
                                maxLength={15}
                                required
                            />

                            {
                                requierePlaca && (
                                    <InputTextField
                                        name="placa"
                                        label="Placa"
                                        placeholder="Ingrese la Placa"
                                        minLength={6}
                                        maxLength={6}
                                        icon={Car}
                                        required
                                    />
                                )
                            }


                            {
                                !requierePlaca && (
                                    <InputTextField
                                        name="codigo"
                                        label="Codigo"
                                        placeholder="Ingrese codigo de Equipo"
                                        minLength={1}
                                        maxLength={3}
                                        icon={Car}
                                        required

                                    />

                                )
                            }

                            {
                                !requierePlaca && (
                                    <InputTextField
                                        name="numero_equipo"
                                        label="Número de Equipo"
                                        placeholder="Ingrese Número de Equipo"
                                        minLength={1}
                                        maxLength={4}
                                        icon={Car}

                                    />

                                )
                            }

                            <InputNumberField
                                name="capacidadVehiculo"
                                label="Capacidad"
                                placeholder="Ingrese la Capacidad"
                                icon={Car}
                                maxLength={5}
                                required
                            />

                            {
                                !requierePlaca && (
                                    <InputTextField
                                        name="modeloVehiculo"
                                        label="Modelo"
                                        placeholder="Ingrese el Modelo"
                                        icon={Car}
                                        minLength={4}
                                        maxLength={10}
                                        required
                                    />
                                )
                            }

                            {
                                requierePlaca && (
                                    <InputNumberField
                                        name="modeloVehiculo"
                                        label="Modelo"
                                        placeholder="Ingrese el Modelo"
                                        icon={Car}
                                        minLength={4}
                                        maxLength={4}
                                        required
                                    />
                                )
                            }



                            <InputTextField
                                name="color"
                                label="Color"
                                placeholder="Ingrese la Color"
                                icon={Car}
                                required
                            />


                            {
                                requierePlaca && (

                                    <InputDateField
                                        name="fechaMatricula"
                                        label="Fecha de Matricula"
                                        icon={Car}
                                        required
                                    />
                                )
                            }

                            <EstadoSwitchField
                                name="estadoVehiculo"
                                label="Estado del Vehículo"
                                trueLabel="Activo"
                                falseLabel="Inactivo"
                            />

                            <EstadoSwitchField
                                name="vehiculoEnUso"
                                label="Estado del Uso"
                                trueLabel="En Uso "
                                falseLabel="No está siendo usado"
                            />


                        </div>

                        <div className="flex justify-center  p-2 my-2 " >
                            <button
                                type="submit"
                                disabled={loading}
                                className={`${loading ? 'bg-gray-300' : 'bg-primary hover:bg-secondary'}   p-2 rounded-md text-white  hover:transition-transform  hover:scale-105 duration-200`}
                            >
                                Editar
                            </button>
                        </div>
                    </form>

                </FormProvider>


            </div>

        </div>
    )
}

export default EditVehiculo