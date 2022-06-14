import { useFormContext, Controller } from "react-hook-form";
import AsyncSelectStyles from "components/AsyncSelectStyles";

type Option = {
	value: string;
	label: string;
}

type Props = {
	name: string,
	countyCode: string,
	self?: string,
	required?: boolean,
	[x:string]: any;
}

export default function HotspotSelect({ name, countyCode, self, required, ...props }: Props) {
	const { control } = useFormContext();

	const loadOptions = async (inputValue: string, callback: (options: Option[]) => void) => {
		const response = await fetch(`/api/hotspot/search?countyCode=${countyCode}&q=${inputValue}`);
		const json = await response.json();
		const options = json.results?.filter((option: any) => option.value !== self);
		callback(options || []);
	};

	return (
		<Controller
			control={control}
			name={name}
			rules={{ required: required ? "This field is required" : false }}
			render={({ field: { ref, ...field } }) => {
				return (
					<AsyncSelectStyles
						loadOptions={loadOptions}
						cacheOptions
						defaultOptions
						noOptionsMessage={({inputValue}: any) => inputValue.length ? "No Results" : "Search for a hotspot..."}
						{...field}
						{...props}
					/>
				);
			}}
		/>
  );
};