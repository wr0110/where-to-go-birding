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
  const { control, watch } = useFormContext();
  const value = watch(name);

  const loadOptions = async (inputValue: string, callback: (options: Option[]) => void) => {
    const ids = Array.isArray(value) ? value.map(({ value }) => value).join(",") : value?.value || "";
    const response = await fetch(`/api/hotspot/search?stateCode=${stateCode || ""}&q=${inputValue}&ids=${ids}`);
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
