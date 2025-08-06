import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from "react-hook-form";
import { InputTextField } from "../../../components/ui/InputTextField";
import { InputNumberField } from "../../../components/ui/InputNumberField";
import { SelectField } from "../../../components/ui/SelectField";
import { InputFile } from "../../../components/ui/InputFile";
import { InputDateField } from "../../../components/ui/InputDateField";
import { User, ArrowLeft, ChevronRight, Car } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
//Toatify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUsuario = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const methods = useForm();
    const { setValue } = methods;
    const { cargos, roles, tiposLicencia, getUserById, updateInfoUser, getAllUsers } = useAdmin();
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getUserData();
    }, [])

    const getUserData = async () => {
        const loadingToast = toast.loading("Cargando... 🚗");

        try {
            const res = await getUserById(id);
            if (res.status === 200) {
                toast.update(loadingToast, {
                    render: "Usuario Cargado ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 300
                });

                const user = res.data.data;
                console.log(user)
                const formattedDate = user.fechaNacimiento
                    ? new Date(user.fechaNacimiento).toISOString().split("T")[0]
                    : "";
                const userData = {
                    name: user.name,
                    lastName: user.lastName,
                    idCargo: user.idCargo?._id,
                    idRole: user.idRole?._id,
                    fechaNacimiento: formattedDate,
                    tipoLicencia: user.tipoLicencia,
                    telefono: user.telefono,
                    email: user.email,
                    numeroDocumento: user.numeroDocumento,
                    password: "",

                };

                setOriginalData(userData); // Guardamos datos originales
                Object.keys(userData).forEach((key) => setValue(key, userData[key]));
                setLoading(false);
            } else {
                toast.update(loadingToast, {
                    render: "Error al cargar usuario ❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                    onClose: () => {
                        navigate('/admin/gestion-usuarios/edicion/');
                    }
                });
            }
        } catch (error) {
            toast.update(loadingToast, {
                render: "Error en la solicitud ❌",
                type: "error",
                isLoading: false,
                autoClose: 500,
                onClose: () => navigate(`/admin/gestion-usuarios`)
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

        // Verificar si la contraseña se ha modificado realmente
        if (cambios.password === "" || cambios.password === "****" || !cambios.password) {
            delete cambios.password;
        }

        // Si no hay cambios, mostrar mensaje y detener la ejecución sin abrir un toast de carga
        if (Object.keys(cambios).length === 0) {
            toast.info("No has realizado cambios", { autoClose: 500 });
            return;
        }

        // Solo aquí se muestra el toast de carga porque sí hay cambios
        const loadingUpToast = toast.loading("Cargando... 👤");

        try {
            const res = await updateInfoUser(id, cambios);

            if (res.status === 200) {

                getAllUsers();
                toast.update(loadingUpToast, {
                    render: res.data.message || "Usuario actualizado correctamente ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 500,
                    onClose: () => {
                        navigate("/admin/gestion-usuarios/")
                        sessionStorage.removeItem("users")
                    }
                });
            } else {
                throw new Error(res.data.message || "Error al actualizar usuario");
            }
        } catch (error) {
            toast.update(loadingUpToast, {
                render: error.message || "Error en la actualización ❌",
                type: "error",
                isLoading: false,
                autoClose: 1500
            });
        }

        console.log("Datos a actualizar:", cambios);
    };




    return (
        <div className="p-6">
            <ToastContainer position="top-center" />

            {/* Encabezado */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>/Pesv</span>
                <ChevronRight className="h-4 w-4" />
                <span >Gestión de Usuarios</span>
                <ChevronRight className="h-4 w-4" />
                <span >Edicion</span>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mt-5">Edición de Usuarios</h1>
                <div className=" flex gap-3">
                    <Link title={"Volver"} to={`/admin/gestion-usuarios`} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 hover:border-black transition-colors">
                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 ease-in-out hover:scale-150 " />
                    </Link>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg  mt-5 border">

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} >

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <InputTextField
                                name="name"
                                label="Nombre"
                                placeholder="Ingrese su Nombre"
                                icon={User}
                                required
                                minLength={3}

                            />

                            <InputTextField
                                name="lastName"
                                label="Apellido"
                                placeholder="Ingrese su Apellido"
                                minLength={3}
                                icon={User}

                            />

                            <SelectField
                                name="idCargo"
                                label="Cargo"
                                options={cargos}
                                icon={User}

                            />
                            <InputDateField
                                name="fechaNacimiento"
                                label="Fecha de Nacimiento"
                                icon={User}

                            />
                            <InputTextField
                                name="telefono"
                                label="Telefono"
                                placeholder="Ingrese Telefono"
                                icon={User}
                                maxLength={11}

                            />

                            <InputTextField
                                name="email"
                                label="Email"
                                placeholder="Ingrese el Email"
                                icon={User}
                            />

                            <InputNumberField
                                name="numeroDocumento"
                                label="Número de Documento"
                                placeholder="Ingrese Numero de Documento"
                                minLength={7}
                                maxLength={11}
                                icon={User}


                            />

                            <SelectField
                                name="idRole"
                                label="Rol"
                                options={roles}
                                icon={User}

                            />
                            <SelectField
                                name="tipoLicencia"
                                label="Tipo Licencia"
                                options={tiposLicencia}
                                icon={User}

                            />
                            <InputTextField
                                name="password"
                                label="Contraseña"
                                placeholder="Ingrese Nueva Contraseña"
                                minLength={3}
                                icon={User}

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

export default EditUsuario