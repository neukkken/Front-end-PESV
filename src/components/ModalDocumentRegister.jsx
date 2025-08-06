import { File, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputFile } from "./ui/InputFile";
import { SelectField } from "./ui/SelectField";
import { InputDateField } from "./ui/InputDateField";
import { InputTextField } from "./ui/InputTextField";
import { useAdmin } from "../context/AdminContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { diasPermitidos } from "../utils/DiasPermitidosEx.js";

export function ModalDocumentsRegister({ isOpen, setIsOpen, id_Vehiculo, id_user }) {
    const methods = useForm();
    const { getTiposDocumentosVehiculo, uploadOneDocVehicule, uploadOneDocUsuario } = useAdmin();
    const [docTipos, setDocTipos] = useState([]);

    const { min, max } = diasPermitidos(5);

    useEffect(() => {
        if (!id_user && !id_Vehiculo) return; // Evita llamadas innecesarias
        fetchTiposDocumentos();
    }, [id_user, id_Vehiculo]);

    const fetchTiposDocumentos = async () => {
        try {
            const response = await getTiposDocumentosVehiculo();
            if (response.status === 200) {
                const data = response.data.data;
                setDocTipos(id_user ? data.tipoDocUsuario : data.tipoDocVehiculo);
            }
        } catch (error) {
            console.error("Error al obtener tipos de documentos:", error);
        }
    };

    const onSubmit = async (data) => {
        const loadingToast = toast.loading("Registrando Documento... ");

        if (!data.documento || !data.documento[0]) {
            toast.update(loadingToast, {
                render: "Debe seleccionar un documento 📄",
                type: "warning",
                isLoading: false,
                autoClose: 3000,
            });
            return;
        }

        const formData = new FormData();
        formData.append("documento", data.documento[0]);
        formData.append("tipoDocumentoId", data.tipoDocumentoId);
        formData.append("fechaExpiracion", data.documentoDate);
        formData.append("numeroDocumento", data.documentoNum);


        let response;
        if (id_user) {
            formData.append("idUsuario", id_user);
            response = await uploadOneDocUsuario(formData);
        } else if (id_Vehiculo) {
            formData.append("idVehiculo", id_Vehiculo);
            response = await uploadOneDocVehicule(formData);
        } else {
            toast.update(loadingToast, {
                render: "Error: No se proporcionó un ID válido",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            return;
        }

        if (response.status === 200 && response.data.success) {
            toast.update(loadingToast, {
                render: "Documento Cargado ✅",
                type: "success",
                isLoading: false,
                autoClose: 1000,
                onClose: () => {
                    setIsOpen(false);
                    methods.reset();
                }
            });
        } else {
            toast.update(loadingToast, {
                render: response.data.message || "Error en el proceso ❌",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <ToastContainer position="top-center" />
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
                <div className="flex justify-between items-center my-5">
                    <h2 className="text-xl font-semibold">Registrar Documento</h2>
                    <X onClick={() => setIsOpen(false)} className="hover:scale-125 transition-all cursor-pointer" />
                </div>

                <FormProvider {...methods}>
                    <p className="text-gray-700">
                        {id_user ? `ID Usuario: ${id_user}` : `ID Vehículo: ${id_Vehiculo}`}
                    </p>

                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="border flex flex-col p-4 gap-4 rounded-lg">
                            <SelectField name="tipoDocumentoId" label="Tipo Documento" options={docTipos} icon={File} required />
                            <InputFile icon={File} name="documento" label="Documento" required />
                            <InputTextField name="documentoNum" label="Número Documento" placeholder="Número" icon={File} required />
                            <InputDateField name="documentoDate" icon={File} label="Fecha Expiración" min={min} />
                        </div>

                        <button className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
                            Guardar
                        </button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
