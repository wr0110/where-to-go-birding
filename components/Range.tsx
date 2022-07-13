import { useFormContext } from "react-hook-form";

type InputProps = {
  className?: string;
  name: string;
  required?: boolean;
  [x: string]: any;
};

const Range = ({ type, className, name, required, ...props }: InputProps) => {
  const { register } = useFormContext();
  return (
    <input
      type="range"
      {...register(name, { required: required ? "This field is required" : false })}
      className={`w-full ${className || ""}`}
      {...props}
    />
  );
};

export default Range;
