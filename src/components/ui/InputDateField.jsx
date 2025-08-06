import React from "react";
import { useFormContext } from "react-hook-form";


export const InputDateField = ({ name, label, icon: Icon, required = false, min, max }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="relative">
            <label htmlFor={name} className="mb-2 text-sm block">{label}</label>
            <div className="relative">
                <input
                    id={name}
                    type="date"
                    className={`appearance-none py-2 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg border 
                        ${errors[name] ? "border-red-500" : "border-gray-300"} text-gray-500`}
                    {...register(name, {
                        required: required ? { value: true, message: "Este campo es obligatorio" } : false,
                        validate: (value) => {
                            const selectedDate = new Date(value);
                            const minDate = min ? new Date(min) : null;
                            const maxDate = max ? new Date(max) : null;

                            if (minDate && selectedDate < minDate) {
                                return `La fecha no puede ser menor a ${min}`;
                            }
                            if (maxDate && selectedDate > maxDate) {
                                return `La fecha no puede ser mayor a ${max}`;
                            }
                            return true;
                        }
                    })}
                    min={min}
                    max={max}
                />
                {Icon && <Icon className="absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-500 w-4 h-4" />}
            </div>
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
        </div>
    );
};