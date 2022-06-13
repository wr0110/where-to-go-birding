import * as React from "react";
import { useFormContext } from "react-hook-form";

type InputProps = {
	name: string,
	label: string,
	options: string[],
}

const RadioGroup = ({ name, label, options }: InputProps) => {
	const { register } = useFormContext();
	return (
		<div>
			<label className="text-gray-500 font-bold">
				{label}
			</label><br/>
			<div className="mt-1 flex gap-2">
				{options.map(option => (
					<React.Fragment key={option}>
						<label>
							<input {...register(name)} type="radio" name={name} value={option}/> {option}
						</label>
						<br/>
					</React.Fragment>
				))}
			</div>
		</div>
	)
}

export default RadioGroup
