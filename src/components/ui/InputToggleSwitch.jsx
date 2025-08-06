import React from "react";
import { useFormContext } from "react-hook-form";

export const EstadoSwitchField = ({
    name,
    label,
    trueLabel = "Activo",
    falseLabel = "Inactivo",
    icon: Icon,
    isEditable = true
}) => {
    const { register, setValue, watch } = useFormContext();
    const value = watch(name);

    const toggle = () => {
        if (isEditable) {
            setValue(name, !value, { shouldValidate: false });
        }
    };

    return (
        <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                {label}
            </label>
            <span className="text-sm text-gray-600">
                {value ? trueLabel : falseLabel}
            </span>

            <div className="flex items-center gap-4">

                {Icon && <Icon className="w-5 h-5 text-gray-500" />}


                <button
                    type="button"
                    onClick={toggle}
                    disabled={!isEditable}
                    className={`relative w-12 h-6 transition-all duration-300 rounded-full 
            ${value ? 'bg-green-500' : 'bg-gray-300'} 
            ${!isEditable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
              ${value ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                </button>
            </div>

            {/* Hidden input for react-hook-form */}
            <input type="hidden" {...register(name)} />
        </div>
    );
};
