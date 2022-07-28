import * as React from "react";
import MarkerAdd from "icons/MarkerAdd";
import useOnClickOutside from "hooks/useOnClickOutside";
import BtnSmall from "components/BtnSmall";

type Props = {
  isAdding: boolean;
  onClick: (type: string) => void;
};

export default function AddMarkerBtn({ isAdding, onClick }: Props) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOutside = () => {
    setOpen(false);
  };

  useOnClickOutside(menuRef, handleClickOutside);

  const handleClick = (type: string) => {
    setOpen(!open);
    onClick(type);
  };

  return (
    <div className="relative" ref={menuRef}>
      <BtnSmall
        type="button"
        color="lightblue"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 ${isAdding ? "opacity-80" : ""}`}
        disabled={isAdding}
      >
        <MarkerAdd className="text-base" /> Add Marker
      </BtnSmall>
      {open && (
        <ul className="absolute top-8 right-0 bg-white shadow-md border rounded-sm z-10 w-[150px]">
          <li onClick={() => handleClick("parking")}>
            <button type="button" className="p-2 hover:bg-gray-100 w-full text-left font-medium flex gap-2">
              <img src="/parking-marker.png" className="h-6" />
              Parking
            </button>
          </li>
          <li onClick={() => handleClick("interest")}>
            <button type="button" className="p-2 hover:bg-gray-100 w-full text-left font-medium flex gap-2">
              <img src="/interest-marker.png" className="h-6" />
              Area of Interest
            </button>
          </li>
          <li onClick={() => handleClick("toilets")}>
            <button type="button" className="p-2 hover:bg-gray-100 w-full text-left font-medium flex gap-2">
              <img src="/toilets-marker.png" className="h-6" />
              Restrooms
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
