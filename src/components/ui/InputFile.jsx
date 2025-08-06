import React from "react";
import { useFormContext } from "react-hook-form";

export const InputFile = ({ name, label, icon: Icon, required = false, placeholder = "", maxSizeMB = 5 }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="relative">
            <label htmlFor={name} className="mb-2 text-sm block">{label}</label>
            <div className="relative">
                <input
                    id={name}
                    type="file"
                    accept="application/pdf"
                    className={`appearance-none py-2 pl-10 pr-4 bg-white w-full outline-none rounded-lg border 
                        ${errors[name] ? "border-red-500" : "border-gray-300"} text-gray-700`}
                    placeholder={placeholder}
                    {...register(name, {
                        required: required ? { value: true, message: "Este campo es obligatorio" } : false,
                        validate: {
                            fileSize: (fileList) => {
                                const file = fileList[0];
                                if (!file) return true; // Permitir si no hay archivo (cuando no es obligatorio)
                                return file.size <= maxSizeMB * 1024 * 1024 || `El archivo debe ser menor a ${maxSizeMB}MB`;
                            },
                        },
                    })}
                />
                {Icon && <Icon className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500 w-4 h-4" />}
            </div>
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
        </div>
    );
};
