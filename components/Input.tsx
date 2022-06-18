import { useFormContext } from "react-hook-form";

type InputProps = {
	type: string,
	className?: string,
	name: string,
	required?: boolean,
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
	[x:string]: any;
}

const Input = ({type, className, name, required, onChange, ...props}: InputProps) => {
	const { register } = useFormContext();
	return <input {...register(name, { onChange, required: required ? "This field is required" : false })} type={type} className={`form-input ${className || ""}`} {...props}/>
}

export default Input
