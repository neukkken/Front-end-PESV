import React from "react";
import { useFormContext } from "react-hook-form";

export const SelectField = ({ name, label, options, icon: Icon, required = false, onChange }) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="relative">
      <label htmlFor={name} className="mb-2 text-sm flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          className={`appearance-none py-2 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg border
            ${errors[name] ? "border-red-500" : "border-gray-300"} text-gray-500`}
          defaultValue=""
          {...register(name, { required })}
          onChange={(e) => {
            const value = e.target.value;
            setValue(name, value);
            if (onChange) onChange(value);
          }}
        >
          <option value="" disabled>Selecciona</option>
          {options.map((option, i) => (
            <option className="text-black" key={i} value={option._id}>
              {option.name || option.nombreZona || option.nombreTipo || option.nombre}
            </option>
          ))}
        </select>
        {Icon && <Icon className="absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-500 w-4 h-4" />}
      </div>
      {errors[name] && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
    </div>
  );
};
