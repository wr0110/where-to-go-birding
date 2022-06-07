import ReactSelect from "react-select";
import { useFormContext, Controller } from "react-hook-form";

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
        render={({ field }) => (
					<ReactSelect
						options={options}
						styles={{
							input: (base) => ({
								...base,
								"input:focus": { boxShadow: "none" },
							}),
							singleValue: (base) => ({
								...base,
								"color": "#555",
								"font-weight": "normal",
							}),
							control: (base, state) => ({
								...base,
								"border-color": state.isFocused ? "rgb(165, 180, 252)" : base["border-color"],
								"outline": "none",
								"box-shadow": state.isFocused ? "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(199, 210, 254, 0.5) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" : base["box-shadow"],
							}),
						}}
						{...field}
						{...props}
					/>
				)}
      />
	);
}

export default Select
