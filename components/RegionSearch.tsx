import AsyncSelect from "react-select/async";
import { components, DropdownIndicatorProps } from "react-select";
import { SearchIcon } from "@heroicons/react/outline";
import Highlighter from "react-highlight-words";

type Option = {
  value: string;
  label: string;
};

type Props = {
  styles?: any;
  value?: Option | null;
  onChange: (value: any) => void;
  [x: string]: any;
};

const DropdownIndicator = ({ children, ...props }: DropdownIndicatorProps) => {
  if (props.hasValue) return null;
  return (
    <components.DropdownIndicator {...props}>
      <SearchIcon className="h-5 w-5 opacity-80" />
    </components.DropdownIndicator>
  );
};

function formatOptionLabel({ label }: any, { inputValue }: any) {
  return <Highlighter searchWords={[inputValue]} textToHighlight={label} highlightTag="b" />;
}

export default function RegionSearch({ onChange, value, ...props }: Props) {
  const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    (async () => {
      const response = await fetch(`/api/region-search?q=${inputValue}`);
      const json = await response.json();
      callback(json.results || []);
    })();
  };

  return (
    <AsyncSelect
      styles={{
        input: (base: any) => ({
          ...base,
          outline: "none",
          "input:focus": { boxShadow: "none" },
        }),
        singleValue: (base: any) => ({
          ...base,
          color: "#555",
          fontWeight: "normal",
        }),
        control: (base: any, state: any) => ({
          ...base,
          borderTopRightRadius: "50px",
          borderBottomRightRadius: "50px",
          fontSize: "16px",
          fontWeight: "normal",
          padding: "0.4rem 0.5rem",
          paddingLeft: "1rem",
          border: "solid 1px #efefef",
          borderColor: "#efefef !important",
          outline: "none",
          boxShadow: "0 1px 3px -1px rgba(0,0,0,.07), 0 2px 4px -2px rgba(0,0,0,.07)",
        }),
        container: (base: any) => ({
          ...base,
          width: "100%",
        }),
        indicatorSeparator: (base: any) => ({
          display: "none",
        }),
        indicatorsContainer: (base: any) => ({
          ...base,
          marginRight: "0.5rem",
        }),
      }}
      loadOptions={loadOptions}
      cacheOptions
      autoFocus
      //@ts-ignore
      components={{ DropdownIndicator }}
      formatOptionLabel={formatOptionLabel}
      noOptionsMessage={() => null}
      loadingMessage={() => null}
      placeholder="Find a region or hotspot..."
      onChange={onChange}
      value={value}
      escapeClearsValue
      {...props}
    />
  );
}
