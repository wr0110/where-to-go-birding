import { useFormContext, Controller } from "react-hook-form";
import ReactSelectStyled from "components/ReactSelectStyled";

type InputProps = {
	name: string,
	required?: boolean,
	options: {
		value: string,
		label: string,
	}[],
	[x:string]: any;
}

const Select = ({ name, options, required, ...props}: InputProps) => {
	const { control } = useFormContext();
	return (
		<Controller
        name={name}
        control={control}
				rules={{ required: required ? "This field is required" : false }}
        render={({ field: { ref, ...field } }) => (
					<ReactSelectStyled options={options} {...field} {...props} />
				)}
      />
	);
}

export default Select
