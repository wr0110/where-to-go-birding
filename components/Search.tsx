import * as React from "react";
import AsyncSelect from "react-select/async";
import { components, DropdownIndicatorProps } from "react-select";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Highlighter from "react-highlight-words";

type Option = {
  value: string;
  label: string;
};

type Props = {
  pill?: boolean;
  onChange?: () => void;
  [x: string]: any;
};

const DropdownIndicator = ({ children, ...props }: DropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <SearchIcon className="h-5 w-5 opacity-80 mr-2" />
  </components.DropdownIndicator>
);

function formatOptionLabel({ label }: any, { inputValue }: any) {
  return <Highlighter searchWords={[inputValue]} textToHighlight={label} highlightTag="b" />;
}

export default function Search({ onChange, pill, ...props }: Props) {
  const [value, setValue] = React.useState<Option | null>(null);
  const router = useRouter();
  const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    (async () => {
      const response = await fetch(`/api/search?q=${inputValue}`);
      const json = await response.json();
      callback(json.results || []);
    })();
  };

  const handleChange = (option: Option) => {
    setValue(null);
    router.push(option.value);
    onChange && onChange();
  };

  return (
    <AsyncSelect
      styles={{
        input: (base) => ({
          ...base,
          outline: "none",
          "input:focus": { boxShadow: "none" },
        }),
        singleValue: (base) => ({
          ...base,
          color: "#555",
          fontWeight: "normal",
        }),
        control: (base, state) => ({
          ...base,
          borderRadius: pill ? "50px" : "8px",
          fontSize: "18px",
          fontWeight: "normal",
          padding: "0.5rem",
          paddingLeft: pill ? "1rem" : "0.5rem",
          border: "solid 1px #efefef",
          borderColor: "#efefef !important",
          outline: "none",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)",
        }),
        indicatorSeparator: (base) => ({
          display: "none",
        }),
      }}
      value={value}
      loadOptions={loadOptions}
      cacheOptions
      autoFocus
      // @ts-expect-error
      components={{ DropdownIndicator }}
      formatOptionLabel={formatOptionLabel}
      noOptionsMessage={() => null}
      loadingMessage={() => null}
      placeholder="Find a region or hotspot..."
      onChange={(option: any) => handleChange(option)}
      escapeClearsValue
      {...props}
    />
  );
}
