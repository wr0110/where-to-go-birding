import * as React from "react";
import useOnClickOutside from "hooks/useOnClickOutside";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ExploreToggle({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const handleClick = (value: string) => {
    setIsOpen(false);
    onChange(value);
  };

  return (
    <>
      <button
        type="button"
        className="bg-lime-600/90 py-2 pl-6 pr-4 text-base rounded-l-full text-white font-bold shadow border-gray-200 border border-r-0 flex gap-1 items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value === "nearby" ? "Nearby" : "Region"}
        {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div ref={ref} className="absolute top-14 left-0 rounded shadow-lg border bg-white flex flex-col w-[120px]">
          <button
            onClick={() => handleClick("nearby")}
            type="button"
            className="px-3 text-left py-1.5 hover:bg-gray-100 font-medium"
          >
            Nearby
          </button>
          <button
            type="button"
            onClick={() => handleClick("region")}
            className="px-3 py-1.5 text-left hover:bg-gray-100 font-medium"
          >
            Region
          </button>
        </div>
      )}
    </>
  );
}
