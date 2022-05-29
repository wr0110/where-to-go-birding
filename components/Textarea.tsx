import { useFormContext } from "react-hook-form";

type InputProps = {
	className?: string,
	name: string,
	required?: boolean,
	[x:string]: any;
}

const Textarea = ({type, className, name, required, ...props}: InputProps) => {
	const { register } = useFormContext();
	return <textarea {...register(name, { required: required ? "This field is required" : false })} className={`form-input ${className || ""}`} {...props}/>
}

export default Textarea
