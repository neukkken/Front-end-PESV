import { useState, useEffect, useRef } from "react";

const InputTextFieldWithSearch = ({ preguntasExistentes, name, value, onChange, required, icon: Icon }) => {
    const [filtroPreguntas, setFiltroPreguntas] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null); // 📌 Referencia al contenedor del input y dropdown

    // 📌 Manejar cambios en el input y filtrar preguntas
    const handleInputChange = (e) => {
        const texto = e.target.value;
        onChange(e);

        if (texto.length > 0) {
            // eslint-disable-next-line react/prop-types
            const resultados = preguntasExistentes.filter((p) =>
                p.preguntaTexto.toLowerCase().includes(texto.toLowerCase())
            );
            setFiltroPreguntas(resultados);
            setShowDropdown(resultados.length > 0);
        } else {
            setShowDropdown(false);
        }
    };

    // 📌 Manejar selección de una pregunta
    const handleSelectPregunta = (preguntaSeleccionada) => {
        onChange({ target: { value: preguntaSeleccionada.preguntaTexto } });
        setShowDropdown(false);
    };

    // 📌 Cerrar dropdown si el usuario hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <input
                autoComplete="off"
                name={name}
                type="text"
                value={value}
                onChange={handleInputChange}
                required={required}
                className="w-full p-2 border rounded"
                placeholder="Busca una pregunta..."
            />
            {Icon && <Icon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />}

            {showDropdown && (
                <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
                    {filtroPreguntas.map((pregunta, index) => (
                        <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelectPregunta(pregunta)}
                        >
                            {pregunta.preguntaTexto}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InputTextFieldWithSearch;
