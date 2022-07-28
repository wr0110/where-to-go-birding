import * as React from "react";
import useOnClickOutside from "hooks/useOnClickOutside";
import BtnSmall from "components/BtnSmall";
import { ZoomInIcon } from "@heroicons/react/outline";
import Field from "components/Field";

type Props = {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
};

export default function EditZoomBtn({ value, onChange, onReset }: Props) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOutside = () => {
    setOpen(false);
  };

  useOnClickOutside(menuRef, handleClickOutside);

  const handleClick = () => {
    setOpen(!open);
    onReset();
  };

  return (
    <div className="relative" ref={menuRef}>
      <BtnSmall type="button" color="default" onClick={handleClick} className={"flex items-center gap-1 mr-2"}>
        <ZoomInIcon className="h-5 w-5" /> Edit Default Zoom
      </BtnSmall>
      {open && (
        <div className="absolute top-8 right-0 bg-white shadow-md border rounded-sm z-10 w-[270px] py-2 px-4">
          <Field label="Map Zoom">
            <div className="flex gap-2">
              <input
                type="range"
                min={7}
                max={17}
                step={1}
                className="w-full"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
              />
              {value}
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}
