import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from "react-hook-form";
import { InputTextField } from "../../../components/ui/InputTextField";
import { InputNumberField } from "../../../components/ui/InputNumberField";
import { SelectField } from "../../../components/ui/SelectField";
import { InputFile } from "../../../components/ui/InputFile";
import { InputDateField } from "../../../components/ui/InputDateField";
import { useAdmin } from "../../../context/AdminContext";
import { User, ArrowLeft, ChevronRight, Car, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
//Toatify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { diasPermitidos } from "../../../utils/DiasPermitidosEx.js";

const RegisterUsuario = () => {
    const methods = useForm();
    const { cargos, roles, tiposLicencia, registerUser, uploadDocsUser } = useAdmin();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { min, max } = diasPermitidos(-5844); // Calcula el rango de fechas permitido

    const tipoLicenciaSeleccionada = methods.watch("tipoLicencia");
    const numeroDocumento = methods.watch("numeroDocumento");

    const onSubmit = async (data) => {
        setLoading(true);
        const loadingUserToast = toast.loading("Registrando usuario...");

        try {
            const res = await registerUser(data); // 1️⃣ Intentar registrar usuario
            console.log(res.data)
            if (res.status === 200 && res.data.success) {
                const idUsuario = res.data.data._id;

                // ✅ Usuario registrado correctamente
                toast.update(loadingUserToast, {
                    render: res.data.message || "Usuario registrado correctamente ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });

                // 2️⃣ Ahora mostrar un nuevo toast para la carga de documentos
                const loadingDocsToast = toast.loading("Subiendo documentos... 📂");

                // Creando los objetos para cada tipo de documento
                const documento = {
                    tipoDocumentoId: '679318760a92a8075e0d8197',
                    numeroDocumento: data.documentoNum,
                    archivo: data.documentoDoc[0],
                    fechaExpiracion: data.documentoDate
                };

                const licencia = {
                    tipoDocumentoId: '679318760a92a8075e0d8198',
                    numeroDocumento: data.licenciaNum,
                    archivo: data.licenciaDoc[0],
                    fechaExpiracion: data.licenciaDate
                };

                const formData = new FormData();
                formData.append('licencia', JSON.stringify(licencia));
                formData.append('documento', JSON.stringify(documento));
                formData.append('idUsuario', idUsuario);
                formData.append('licenciaDoc', data.licenciaDoc[0]);
                formData.append('documentoDoc', data.documentoDoc[0]);

                const resDocs = await uploadDocsUser(formData); // 3️⃣ Intentar subir documentos
                console.log(resDocs)
                if (resDocs.status === 200) {
                    toast.update(loadingDocsToast, {
                        render: resDocs.data.message || "Documentos subidos correctamente ✅",
                        type: "success",
                        isLoading: false,
                        autoClose: 2000,
                        onClose: () => {
                            sessionStorage.removeItem('users');
                            navigate("/admin/gestion-usuarios/");
                        }
                    });
                } else {

                    toast.update(loadingDocsToast, {
                        render: error.message || "Error al subir documentos❌",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000
                    });
                }
            }
            else {
                toast.update(loadingUserToast, {
                    render: res.data.message || "Error al subir documentos❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });

            }
        } catch (error) {
            console.error(error);

            toast.update(loadingUserToast, {
                render: error.message || "Error en el proceso ❌",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
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
                <span >Registro</span>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mt-5">Registro de Usuarios</h1>
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
                                maxLength={15}
                            />

                            <InputTextField
                                name="lastName"
                                label="Apellido"
                                placeholder="Ingrese su Apellido"
                                icon={User}
                                minLength={3}

                                required
                            />

                            <SelectField
                                name="idCargo"
                                label="Cargo"
                                options={cargos}
                                icon={User}
                                required
                            />
                            <InputDateField
                                name="fechaNacimiento"
                                label="Fecha de Nacimiento"
                                icon={User}
                                max={max}
                                required
                            />
                            <InputTextField
                                name="telefono"
                                label="Telefono"
                                placeholder="Ingrese Telefono"
                                icon={User}
                                required
                            />

                            <InputTextField
                                name="email"
                                label="Email"
                                placeholder="Ingrese el Email"
                                icon={User}
                                required
                            />
                            <InputTextField
                                name="password"
                                label="Contraseña"
                                placeholder="Ingrese Contraseña"
                                minLength={3}
                                icon={User}
                                required
                            />

                            <InputNumberField
                                name="numeroDocumento"
                                label="Numero de Documento"
                                placeholder="Ingrese Numero de Documento"
                                minLength={7}
                                maxLength={11}
                                icon={User}
                                required

                            />

                            <SelectField
                                name="idRole"
                                label="Rol"
                                options={roles}
                                icon={User}
                                required
                            />
                            <SelectField
                                name="tipoLicencia"
                                label="Tipo Licencia"
                                options={tiposLicencia}
                                icon={User}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                            <div className="border flex flex-col p-2 gap-3 rounded-lg">
                                <InputFile icon={User} name="documentoDoc" label="Cédula de Ciudadanía" required={true} />
                                <InputTextField name={`documentoNum`} label="Numero Documento" placeholder="Numero" icon={User} required={true} value={numeroDocumento} />
                            </div>

                            {tipoLicenciaSeleccionada !== "N/A" && (
                                <div className="border flex flex-col p-2 gap-3 rounded-lg">
                                    <InputFile icon={User} name="licenciaDoc" label="Licencia de conducir" required />
                                    <InputTextField name="licenciaNum" label="Numero Documento" placeholder="Numero" icon={User} value={numeroDocumento} required />
                                    <InputDateField name="licenciaDate" icon={User} label="Fecha Expiracion" required min={min} />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center  p-2 my-2 " >
                            <button
                                disabled={loading}
                                type="submit"
                                className={` p-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-primary'} `}
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

export default RegisterUsuario