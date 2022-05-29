import { useFormContext } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

type FormErrorProps = {
	name: string,
	className?: string,
}

export default function FormError({name, className}: FormErrorProps) {
	const { formState: { errors } } = useFormContext();
	return <ErrorMessage errors={errors} name={name} render={({ message }) => (
		<span className={`text-red-600 text-sm ${className || ""}`}>{message}</span>
	)} />
}