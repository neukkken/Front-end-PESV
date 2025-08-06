import React from "react";
import { useFormContext } from "react-hook-form";

export const InputTextArea = ({
  name,
  label,
  placeholder,
  required = false,
  minLength,
  maxLength,
  rows = 3, // Número de filas predeterminado
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="relative">
      <label htmlFor={name} className="mb-2 text-sm block">
        {label}
      </label>
      <textarea
        id={name}
        className={`appearance-none py-2 px-3 bg-secondary-900 w-full outline-none rounded-lg border border-gray-300 resize-none ${
          errors[name] ? "border-red-500" : "border-solidEmpleado"
        } text-gray-500`}
        placeholder={placeholder}
        rows={rows}
        {...register(name, {
          required: required ? { value: true, message: "Este campo es obligatorio" } : false,
          minLength: minLength ? { value: minLength, message: `Debe tener al menos ${minLength} caracteres` } : undefined,
          maxLength: maxLength ? { value: maxLength, message: `No puede tener más de ${maxLength} caracteres` } : undefined,
        })}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
  );
};
