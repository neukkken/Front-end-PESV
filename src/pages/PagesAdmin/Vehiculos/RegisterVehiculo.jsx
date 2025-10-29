
import { useEffect, useState } from "react";
import { ChevronRight, RefreshCw, Plus, ArrowLeft, Squircle, Settings, ArrowDown, Brush, Car, Pin, Truck, Users, Tag, Timer, Calendar, Badge, CreditCard, PanelLeftDashed, File } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { SelectField } from "../../../components/ui/SelectField";
import { InputNumberField } from "../../../components/ui/InputNumberField";
import { InputTextField } from "../../../components/ui/InputTextField";
import { InputDateField } from "../../../components/ui/InputDateField";
import { InputFile } from "../../../components/ui/InputFile";
//Toatify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { diasPermitidos } from "../../../utils/DiasPermitidosEx.js";

const RegisterVehiculo = () => {
    const { zonas, clasesVehiculos, tiposVehiculos, registerAdminVehicule, servicio, uploadDocsVehicule, claseUnidad } = useAdmin();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const methods = useForm();

    const [requierePlaca, setRequierePlaca] = useState(true);

    const { min, max } = diasPermitidos(5); // Calcula el rango de fechas permitido

    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [esPublico, setEsPublico] = useState(false);

    useEffect(() => {

        console.log(clasesVehiculos)

        if (servicioSeleccionado == "Publico") {
            setEsPublico(true)
        }
        else {
            setEsPublico(false);
        }
    }, [servicioSeleccionado]);

    const onSubmit = async (data) => {

        const loadingToast = toast.loading("Registrando vehículo... 🚗");
        setLoading(true);

        try {
            const formData = new FormData();
            const dataVehicle = {
                ...data,
                capacidadVehiculo: Number(data.capacidadVehiculo),

                modeloVehiculo: data.modeloVehiculo, // Mantén como string
            };

            if (data.placa?.trim() === "") {
                delete dataVehicle.placa; // Elimina si está vacío
            }

            if (data.servicio?.trim() === "") {
                delete dataVehicle.servicio; // Elimina si está vacío
            }

            // Registrar el vehículo
            const registerResponse = await registerAdminVehicule(dataVehicle);

            if (registerResponse.status === 200 && registerResponse.data.success) {
                toast.update(loadingToast, {
                    render: registerResponse.data.message,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                const loadingDocsToast = toast.loading("Subiendo documentos... 📂");

                const idVehiculo = registerResponse.data.data._id;

                // Función para limpiar documentos (evita enviar valores vacíos o undefined)
                const limpiarDocumento = (doc) => {
                    return doc.numeroDocumento && doc.archivo;
                };

                // Creando los objetos para cada tipo de documento
                const documentos = {};

                if (limpiarDocumento({ numeroDocumento: data.tarjetaPropiedadNum, archivo: data.tarjetaPropiedadDoc?.[0] })) {
                    documentos.targPropiedad = {
                        tipoDocumentoId: "679318760a92a8075e0d8199",
                        numeroDocumento: data.tarjetaPropiedadNum,
                        archivo: data.tarjetaPropiedadDoc[0]
                    };
                }

                if (limpiarDocumento({ numeroDocumento: data.soatNum, archivo: data.soatDoc?.[0] })) {
                    documentos.soat = {
                        tipoDocumentoId: "679318760a92a8075e0d819a",
                        numeroDocumento: data.soatNum,
                        archivo: data.soatDoc[0],
                        fechaExpiracion: data.soatDate
                    };
                }

                if (limpiarDocumento({ numeroDocumento: data.tecnomecanicaNum, archivo: data.tecnomecanicaDoc?.[0] })) {
                    documentos.tecnoMecanica = {
                        tipoDocumentoId: "679318760a92a8075e0d819b",
                        numeroDocumento: data.tecnomecanicaNum,
                        archivo: data.tecnomecanicaDoc[0],
                        fechaExpiracion: data.tecnomecanicaDate
                    };
                }

                if (limpiarDocumento({ numeroDocumento: data.polizaNum, archivo: data.polizaDoc?.[0] })) {
                    documentos.poliza = {
                        tipoDocumentoId: "679318760a92a8075e0d819c",
                        numeroDocumento: data.polizaNum,
                        archivo: data.polizaDoc[0],
                        fechaExpiracion: data.polizaDate
                    };
                }

                if (limpiarDocumento({ numeroDocumento: data.tarjetaOperacionNum, archivo: data.tarjetaOperacionDoc?.[0] })) {
                    documentos.targOperacion = {
                        tipoDocumentoId: "679318760a92a8075e0d819e",
                        numeroDocumento: data.tarjetaOperacionNum,
                        archivo: data.tarjetaOperacionDoc[0],
                        fechaExpiracion: data.tarjetaOperacionDate
                    };
                }

                if (limpiarDocumento({ numeroDocumento: data.revisionBiNum, archivo: data.revisionBiDoc?.[0] })) {
                    documentos.revisionBimensual = {
                        tipoDocumentoId: "67b75d4feb2539c7915e71c3",
                        numeroDocumento: data.revisionBiNum,
                        archivo: data.revisionBiDoc[0],
                        fechaExpiracion: data.revisionBiDate
                    };
                }

                // Añadir los documentos y archivos al FormData
                formData.append("idVehiculo", idVehiculo);
                Object.entries(documentos).forEach(([key, doc]) => {
                    formData.append(key, JSON.stringify(doc));
                    if (doc.archivo) {
                        formData.append(`${key}Doc`, doc.archivo);
                    }
                });

                // Subir documentos
                const res = await uploadDocsVehicule(formData);
                console.log(res);

                if (res.status === 200) {
                    toast.update(loadingDocsToast, {
                        render: res.data.message || "Documentos subidos correctamente ✅",
                        type: "success",
                        isLoading: false,
                        autoClose: 2000,
                        onClose: () => {
                            sessionStorage.removeItem("vehiculos");
                            navigate("/admin/gestion-vehiculos");
                        }
                    });
                } else {
                    toast.update(loadingDocsToast, {
                        render: res.data.message || "Error al subir documentos",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000
                    });
                }
            } else {
                toast.update(loadingToast, {
                    render: registerResponse.data.message || "Error al registrar el vehículo",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            }
        } catch (error) {
            console.error(error);
            toast.update(loadingToast, {
                render: "Error en el proceso",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setLoading(false);
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
                <span >Gestión de Vehículos y Equipos</span>
                <ChevronRight className="h-4 w-4" />
                <span >Registro</span>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mt-5">Registro de Vehículos y Equipos</h1>
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

                            <SelectField
                                name="claseUnidad"
                                label="Categoría"
                                options={claseUnidad}
                                icon={Car}
                                required
                            />

                            <SelectField
                                name="idClaseVehiculo"
                                label="Tipo"
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
                        </div>

                        {/* Documentos */}
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {
                                requierePlaca && (
                                    <div className="border flex flex-col p-2 gap-3 rounded-lg">
                                        <InputFile icon={Car} name="tarjetaPropiedadDoc" label="Tarjeta de Propiedad" />
                                        <InputTextField name={`tarjetaPropiedadNum`} label="Numero Documento" placeholder="Numero" icon={Car} />
                                    </div>
                                )
                            }

                            {
                                requierePlaca && (
                                    <div className="border flex flex-col p-2 gap-3 rounded-lg">
                                        <InputFile icon={Car} name="soatDoc" label="Soat" />
                                        <InputTextField name={`soatNum`} label="Numero Documento" placeholder="Numero" icon={Car} />
                                        <InputDateField name="soatDate" icon={Car} label="Fecha Expiracion" min={min} />
                                    </div>
                                )

                            }

                            {
                                requierePlaca && (
                                    <div className="border flex flex-col p-2 gap-3 rounded-lg">
                                        <InputFile icon={Car} name="tecnomecanicaDoc" label="Revisión técnico-mecánica" />
                                        <InputTextField name={`tecnomecanicaNum`} label="Numero Documento" placeholder="Numero" icon={Car} requir />
                                        <InputDateField name="tecnomecanicaDate" label="Fecha Expiracion" icon={Car} min={min} />
                                    </div>

                                )
                            }

                            <div className="border flex flex-col p-2 gap-3 rounded-lg">
                                <InputFile icon={Car} name="polizaDoc" label="Poliza Todo Riesgo" required={false} />
                                <InputTextField name={`polizaNum`} label="Numero Documento" placeholder="Numero" icon={Car} required={false} />
                                <InputDateField name="polizaDate" label="Fecha Expiracion" icon={Car} required={false} min={min} />
                            </div>

                            {esPublico && (
                                <div className="border flex flex-col p-2 gap-3 rounded-lg">
                                    <InputFile icon={Car} name="revisionBiDoc" label="Revisión Bimensual" required />
                                    <InputTextField name="revisionBiNum" label="Número Documento" placeholder="Número" icon={Car} required />
                                    <InputDateField name="revisionBiDate" label="Fecha Expiración" icon={Car} required min={min} />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center  p-2 my-2 " >
                            <button
                                type="submit"
                                className={` p-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-primary'}`}
                            >
                                Registrar
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}

export default RegisterVehiculo;