import { useFormContext } from "react-hook-form";

export const InputNumberField = ({ name, label, placeholder, icon: Icon, required = false, minLength, maxLength }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="relative">
            <label htmlFor={name} className="mb-2 text-sm flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type="number"
                    className={`appearance-none py-2 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg border border-gray-300  ${errors[name] ? "border-red-500" : "border-solidEmpleado"
                        } text-gray-500`}
                    placeholder={placeholder}
                    {...register(name, {
                        required: required ? { value: true, message: "Este campo es obligatorio" } : false,
                        minLength: minLength ? { value: minLength, message: `Debe tener al menos ${minLength} caracteres` } : undefined,
                        maxLength: maxLength ? { value: maxLength, message: `No puede tener más de ${maxLength} caracteres` } : undefined,
                    })}
                />
                {Icon && <Icon className="absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-500 w-4 h-4" />}
            </div>
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
        </div>
    );
};
