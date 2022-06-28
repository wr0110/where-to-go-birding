import * as React from "react";
import { useFormContext } from "react-hook-form";

type InputProps = {
  name: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
};

const CheckboxGroup = ({ name, label, options }: InputProps) => {
  const { register } = useFormContext();
  return (
    <div>
      <label className="text-gray-500 font-bold">{label}</label>
      <br />
      <div className="mt-1 flex flex-col gap-3">
        {options.map(({ label, value }) => (
          <React.Fragment key={value}>
            <label>
              <input
                {...register(name)}
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                name={name}
                value={value}
              />{" "}
              {label}
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
