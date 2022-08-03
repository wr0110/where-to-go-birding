import { useFormContext, Controller } from "react-hook-form";
import AsyncSelectStyled from "components/AsyncSelectStyled";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  stateCode?: string;
  required?: boolean;
  [x: string]: any;
};

export default function HotspotSelect({ name, stateCode, required, ...props }: Props) {
  const { control } = useFormContext();

  const loadOptions = async (inputValue: string, callback: (options: Option[]) => void) => {
    const response = await fetch(`/api/hotspot/search?stateCode=${stateCode || ""}&q=${inputValue}`);
    const json = await response.json();
    const options = json.results;
    callback(options || []);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field: { ref, ...field } }) => {
        return (
          <AsyncSelectStyled
            loadOptions={loadOptions}
            cacheOptions
            defaultOptions
            noOptionsMessage={({ inputValue }: any) => (inputValue.length ? "No Results" : "Search for a hotspot...")}
            {...field}
            {...props}
          />
        );
      }}
    />
  );
}
