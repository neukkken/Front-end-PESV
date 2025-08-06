import React from "react";

const InputCheckbox = ({ checked, onChange, label }) => {
  return (
    <div className="dark:bg-black/10 p-2 flex items-center">
      <label className="flex items-center gap-2 text-gray-900 dark:text-white cursor-pointer">
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer transition-all rounded-lg duration-500 ease-in-out border-gray-400 dark:border-white/20 dark:scale-100 dark:hover:scale-110 dark:checked:scale-100"
          checked={checked}
          onChange={onChange}
        />
        {label && <span className="text-sm">{label}</span>}
      </label>
    </div>
  );
};

export default InputCheckbox;
