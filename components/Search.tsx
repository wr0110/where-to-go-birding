import * as React from "react";
import AsyncSelect from "react-select/async";
import { components, IndicatorsContainerProps } from "react-select";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

type Option = {
	value: string;
	label: string;
}

type Props = {
	onClose: () => void;
	[x:string]: any;
}

const IndicatorsContainer = ({ children, ...props }: IndicatorsContainerProps) => (
  <components.IndicatorsContainer {...props}>
    <SearchIcon className="h-5 w-5 opacity-80 mr-2" />
  </components.IndicatorsContainer>
);

export default function HotspotSelect({ onClose, ...props}: Props) {
	const [value, setValue] = React.useState<Option | null>(null);
	const [isMounted, setIsMounted] = React.useState<boolean>(false);
	const router = useRouter();
	const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
		(async () => {
			const response = await fetch(`/api/search?q=${inputValue}`);
			const json = await response.json();
			const options = json.results?.filter((option: any) => option.value !== self);
			callback(options || []);
		})();
	};

	const handleChange = (option: Option) => {
		setValue(null);
		router.push(option.value);
		onClose();
	}

	React.useEffect(() => {
		const handleKeyDown = (e: any) => {
			if (e.key === "Escape") onClose();
		}
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []);

	React.useEffect(() => setIsMounted(true), []);

	return (
		<>
			<div className={`fixed top-0 bottom-0 left-0 right-0 transition-opacity bg-black z-20 ${isMounted ? "opacity-40" : "opacity-0"}`} onClick={onClose}/>
			<div className="absolute top-[10%] max-w-lg left-0 right-0 mx-auto z-30 p-8">
				<div className="">
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
								fontSize: "18px",
								fontWeight: "normal",
								padding: "0.5rem",
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
						components={{ IndicatorsContainer }}
						noOptionsMessage={() => null}
						loadingMessage={() => null}
						placeholder="Search..."
						onChange={(option: any) => handleChange(option)}
						escapeClearsValue
						{...props}
					/>
				</div>
			</div>
		</>
  );
};