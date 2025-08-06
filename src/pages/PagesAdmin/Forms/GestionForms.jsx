import { Plus, FileArchiveIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import InputTextFieldWithSearch from "../../../components/ui/InputTextFieldWithSearch";
import InputCheckboxField from "../../../components/ui/InputCheckboxField";
import { useAdmin } from "../../../context/AdminContext";
import { useForm, FormProvider } from "react-hook-form";
import { Pagination } from "../../../components/ui/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { convertirFecha } from "../../../utils/Fecha";
import { getPaginatedUsers } from "../../../utils/Pagination";

const GestionForms = () => {
    const [loading, setLoading] = useState(false);
    const [isModalAddForm, setIsModalAddForm] = useState(false);
    const [isModalPreview, setIsModalPreview] = useState(false);
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [typeOfForm, setTypeOfForm] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const [allPreguntas, setAllPreguntas] = useState([]);
    const [formularios, setFormularios] = useState([]);
    const [allForms, setAllForms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [numForms, setNumForms] = useState(0);
    const [vehiculos] = useState(JSON.parse(sessionStorage.getItem("clasesVehiculos")));
    const { getPreguntas, getFormularios, postPreguntas, postFormularios } = useAdmin();

    const methods = useForm();

    const limit = 10;

    const getForms = async () => {
        setLoading(true);
        try {
            const docsResponse = await getFormularios();
            setAllForms(docsResponse.data.data);
            if (docsResponse.status == 200 && docsResponse.data.success) {
                const data = docsResponse?.data.data;
                const dataReverse = data.reverse();
                const num = data.length;
                setNumForms(num);
                setTotalPages(Math.ceil(num / limit));
                const currentDocs = getPaginatedUsers(dataReverse, currentPage, limit);
                setFormularios(currentDocs);

            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getForms();

    }, [currentPage, isModalAddForm]);

    useEffect(() => {
        const fetchAndSet = async () => {
            const resQuestions = await getPreguntas();
            setAllPreguntas(resQuestions.data.data || []);

        };
        fetchAndSet();
    }, [isModalAddForm]);

    const formulariosActivos = allForms.filter((formulario) => formulario.estadoFormulario === true);

    useEffect(() => {
        if (typeOfForm !== null) {
            let form = formulariosActivos.find((formulario) => formulario.idClaseVehiculo._id === typeOfForm);
            setPreguntas(form ? form.preguntas.map(p => ({
                _id: p._id,
                preguntaTexto: p.preguntaTexto,
                determinancia: p.determinancia || false
            })) : []);
        } else {
            setPreguntas([]);
        }
    }, [typeOfForm, isModalAddForm]);

    function handleSelectTypeChange(event) {
        setTypeOfForm(event.target.value);
    };

    const handleAddPregunta = () => {
        const nuevaPregunta = {
            preguntaTexto: "",
            determinancia: false
        };

        setPreguntas((prevPreguntas) => [...prevPreguntas, nuevaPregunta]);
    };

    function handleDeletePregunta(index) {
        setPreguntas(preguntas.filter((_, i) => i !== index));
    };

    const handlePreguntaChange = (index, campo, valor) => {
        setPreguntas((prevPreguntas) =>
            prevPreguntas.map((pregunta, i) =>
                i === index ? { ...pregunta, [campo]: valor } : pregunta
            )
        );
    };

    const handleSubmit = async () => {
        if (!typeOfForm || preguntas.length === 0) {
            alert("Debe seleccionar un tipo de formulario y agregar al menos una pregunta.");
            return;
        }

        const loadingToast = toast.loading("Cargando... 🚗");
        setLoading(true);

        let preguntasConId = preguntas.filter(p => p._id !== null && p._id !== undefined);
        let preguntasSinId = preguntas.filter(p => p._id === undefined);

        if (allPreguntas.length > 0) {
            preguntasSinId = preguntasSinId.map(p => {
                const preguntaExistente = allPreguntas.find(existing =>
                    existing.preguntaTexto.trim().toLowerCase() === p.preguntaTexto.trim().toLowerCase()
                );

                return preguntaExistente ? { ...p, _id: preguntaExistente._id } : p;
            });

            preguntasConId = preguntasConId.filter((p, index, self) =>
                index === self.findIndex((q) => q._id === p._id)
            );

            preguntasConId = [...preguntasConId, ...preguntasSinId.filter(p => p._id !== undefined)];

            preguntasSinId = preguntasSinId.filter(p => p._id === undefined);

            const preguntasModificadas = preguntasConId.filter(p => {
                const original = allPreguntas.find(existing => existing._id === p._id);
                return original && (
                    original.preguntaTexto.trim().toLowerCase() !== p.preguntaTexto.trim().toLowerCase() ||
                    original.determinancia !== p.determinancia
                );
            });

            preguntasModificadas.forEach(p => {
                const preguntaExistente = allPreguntas.find(existing =>
                    existing.preguntaTexto.trim().toLowerCase() === p.preguntaTexto.trim().toLowerCase()
                );

                if (!preguntaExistente) {
                    preguntasSinId.push({ ...p, _id: undefined });
                }
            });


            preguntasConId = preguntasConId.filter(p => !preguntasModificadas.includes(p));

            preguntasSinId = preguntasSinId.filter(p =>
                !allPreguntas.some(existing => existing.preguntaTexto.trim().toLowerCase() === p.preguntaTexto.trim().toLowerCase())
            );
        }

        let preguntasToSend = [...new Set(preguntasConId.map(p => p._id))];

        if (preguntasSinId.length > 0) {
            try {
                const res = await postPreguntas(preguntasSinId);
                preguntasConId = [...preguntasConId, ...res.data.data];
                preguntasToSend = [...new Set(preguntasConId.map(p => p._id))];
            } catch (error) {
                console.error("Error al registrar preguntas:", error);
                toast.update(loadingToast, {
                    render: "Error al registrar preguntas ❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
                return;
            }
        }

        const vehiculo = vehiculos.find(v => v._id === typeOfForm);
        if (!vehiculo) {
            alert("El tipo de vehículo seleccionado no es válido.");
            return;
        }

        const nuevoFormulario = {
            nombreFormulario: `PreOperacional-${vehiculo.name}`,
            preguntas: preguntasToSend,
            idClaseVehiculo: typeOfForm
        };

        try {
            const response = await postFormularios(nuevoFormulario);
            if (response.status === 200) {
                toast.update(loadingToast, {
                    render: "Formulario Cargado ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                setIsModalAddForm(false);
                setTypeOfForm(null);
                setPreguntas([]);
            }
        } catch (error) {
            console.error("Error al cargar el formulario:", error);
            toast.update(loadingToast, {
                render: "Error al cargar el formulario ❌",
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold my-5">Formularios</h1>
            </div>

            <div className="items-center rounded-lg p-5 shadow-xl">
                <h3 className="text-xl font-semibold">Manejo de formularios</h3>
                <p className="text-[#000000a6] text-xs">Añadir formularios y visualizar el historial</p>
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-semibold mt-5 mb-5">Formularios activos</h4>
                    <button onClick={() => setIsModalAddForm(true)} className="bg-black rounded-sm text-[#fff] flex items-center justify-center gap-2 px-2 py-2 text-[10px] hover:bg-[#000000ce] transition">
                        <Plus size={"15px"} />
                        Crear formulario
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {
                        loading ? ("Cargando formularios activos...") : (
                            formulariosActivos.length > 0 ? (
                                formulariosActivos.map((formulario, index) => (
                                    <button onClick={() => { setIsModalPreview(true); setSelectedPreview(formulario) }} key={index} className="px-12 rounded-sm py-6 border-[1px] flex flex-col items-center justify-center gap-2">
                                        <FileArchiveIcon />
                                        <p className="font-semibold text-xs">{formulario.nombreFormulario}</p>
                                    </button>
                                ))
                            ) : ("No hay formularios activos aun")
                        )
                    }
                </div>
            </div>

            <div className="w-full p-5 shadow-xl rounded-lg my-10">
                <div className="bg-white rounded-xl overflow-x-auto">
                    <h4 className="text-xl font-semibold mt-5 mb-5">Historial de Formularios</h4>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="px-6 py-4 text-sm font-bold ">Nombre del formulario</th>
                                <th className="px-6 py-4 text-sm font-bold ">N. Preguntas</th>
                                <th className="px-6 py-4 text-sm font-bold ">Tipo</th>
                                <th className="px-6 py-4 text-sm font-bold ">Estado</th>
                                <th className="px-6 py-4 text-sm font-bold ">Fecha</th>
                                <th className="px-6 py-4 text-sm font-bold ">Version</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                "Cargando"
                            ) : formularios.length > 0 ? (
                                formularios.map((formulario, index) => (
                                    <tr onClick={() => { setIsModalPreview(true); setSelectedPreview(formulario) }} key={formulario._id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-primaryHover cursor-pointer transition-colors`}>
                                        <td className="px-6 text-sm py-4 text-gray-700">{formulario.nombreFormulario}</td>
                                        <td className="px-6 text-sm py-4 text-gray-700">{formulario.preguntas.length}</td>
                                        <td className="px-6 text-sm py-4 text-gray-700">{formulario.idClaseVehiculo.name}</td>
                                        <td className="flex text-sm items-center gap-2 px-6 py-4 text-gray-700">
                                            {formulario.estadoFormulario ? "Activo" : "No activo"}
                                        </td>
                                        <td className="px-6 text-sm py-4 text-gray-700">{convertirFecha(formulario.createdAt)}</td>
                                        <td className="px-6 text-sm py-4 text-gray-700">{formulario.version}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No hay formularios disponibles disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="px-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {isModalAddForm && (
                <Modal isOpen={isModalAddForm} onClose={() => { setIsModalAddForm(false); setTypeOfForm(null); setPreguntas([]) }} title={"Agregar formulario"}>
                    <div className="flex-col">
                        <select onChange={handleSelectTypeChange} className="mb-5" >
                            <option defaultValue>Seleccione el tipo de vehiculo</option>
                            {
                                vehiculos.length > 0 && (
                                    vehiculos.map((vehiculo) => (
                                        <option key={vehiculo._id} value={vehiculo._id}>{vehiculo.name}</option>
                                    ))
                                )
                            }
                        </select>

                        <div className="w-full flex-wrap flex">
                            <FormProvider {...methods}>
                                <form onSubmit={methods.handleSubmit(handleSubmit)}>
                                    {preguntas.map((pregunta, index) => (
                                        <div key={pregunta._id || index} className="flex items-center gap-2 w-full">
                                            <InputTextFieldWithSearch
                                                name={`pregunta-${index}`}
                                                value={pregunta.preguntaTexto}
                                                onChange={(e) => handlePreguntaChange(index, "preguntaTexto", e.target.value)}
                                                required
                                                preguntasExistentes={allPreguntas}
                                            />

                                            <InputCheckboxField
                                                name={`determinancia-${index}`}
                                                checked={pregunta.determinancia}
                                                onChange={(e) => handlePreguntaChange(index, "determinancia", e.target.checked)}
                                                label="Determinante"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePregunta(index)}
                                                className="text-red-500"
                                            >
                                                <Trash2Icon size={20} />
                                            </button>
                                        </div>
                                    ))}
                                    {
                                        typeOfForm !== null && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleAddPregunta}
                                                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                                                    disabled={loading}
                                                >
                                                    Añadir Pregunta
                                                </button>

                                                {
                                                    preguntas.length > 0 && (
                                                        <>
                                                            {
                                                                loading ? (
                                                                    <button
                                                                        type="submit"
                                                                        className="bg-blue-500 opacity-80 text-white px-4 py-2 rounded mt-4 ml-2"
                                                                        disabled
                                                                    >
                                                                        Guardando Formulario
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="submit"
                                                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
                                                                    >
                                                                        Guardar Formulario
                                                                    </button>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </Modal>
            )}

            {
                isModalPreview && (
                    <Modal isOpen={isModalPreview} onClose={() => { setIsModalPreview(false); setSelectedPreview(null) }} title={"Vista previa Formulario"}>
                        <h3 className="text-lg font-semibold mb-2">Informacion del formulario</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <span>
                                <p className="text-[#00000091]">Nombre del Formulario</p>
                                <p className="font-bold">{selectedPreview.nombreFormulario}</p>
                            </span>
                            <span>
                                <p className="text-[#00000091]">Fecha de Creación</p>
                                <p className="font-bold">{convertirFecha(selectedPreview.createdAt)}</p>
                            </span>
                            <span>
                                <p className="text-[#00000091]">Estado</p>
                                {
                                    selectedPreview.estadoFormulario ? (
                                        <p className="font-bold px-1 py-1 bg-[#b0dfc3] w-[50px] text-[#165a31]
                                        flex items-center justify-center rounded-lg text-[12px]">
                                            Activo
                                        </p>
                                    ) : (
                                        <p className="font-bold px-1 py-1 bg-[#f7969698] w-[75px] text-[#ff0d0d]
                                        flex items-center justify-center rounded-lg text-[12px]">
                                            No Activo
                                        </p>
                                    )
                                }
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold mt-2">Preguntas</h3>
                        {
                            selectedPreview.preguntas.map((pregunta, index) => (
                                <div key={index}>
                                    <section className="flex items-center justify-between">
                                        <p>{index + 1}. {pregunta.preguntaTexto}</p>
                                        {
                                            pregunta.determinancia ? (<p className="px-1 py-1 bg-[#15803D] w-[105px] text-white font-medium flex items-center justify-center rounded-lg text-[12px] mb-4">
                                                Determinante
                                            </p>) : (
                                                <p className="px-1 py-1 bg-transparent border border-[#ff1717] w-[105px] text-[#ff1717] font-medium flex items-center justify-center rounded-lg text-[12px] mb-4">
                                                    No Determinante
                                                </p>
                                            )
                                        }
                                    </section>
                                </div>
                            ))
                        }
                    </Modal>
                )
            }
        </div>
    );
};

export default GestionForms;