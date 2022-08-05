import * as React from "react";
import { Marker } from "lib/types";
import MapBox from "components/MapBox";
import BtnSmall from "./BtnSmall";
import { useFormContext } from "react-hook-form";
import { ZoomInIcon } from "@heroicons/react/outline";

type Props = {
  markers: Marker[];
};

export default function MapZoomInput({ markers }: Props) {
  const [open, setOpen] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const { register, watch } = useFormContext();
  React.useEffect(() => setRendered(true), []);

  const handleDone = () => {
    setOpen(false);
  };

  const value = watch("zoom");
  const lat = watch("lat");
  const lng = watch("lng");

  return (
    <>
      <button
        type="button"
        className="flex gap-2 bg-white shadow items-center rounded px-4 py-1.5 w-full justify-center"
        onClick={() => setOpen(!open)}
      >
        <ZoomInIcon className="h-5 w-5" /> Edit Map Zoom
      </button>

      {open && (
        <div className="mt-8">
          <div
            className={`fixed top-0 bottom-0 left-0 right-0 transition-opacity bg-black z-[10000] ${
              rendered ? "opacity-40" : "opacity-0"
            }`}
          />
          <div className="fixed left-0 right-0 top-0 bottom-0 overflow-auto z-[10001]">
            <div className={`mt-[5%] mb-12 max-w-[510px]  mx-auto bg-white shadow-md rounded-lg `}>
              <MapBox markers={markers} lat={lat} lng={lng} zoom={value} disabled />

              <footer className="p-4 border-t flex items-center">
                <BtnSmall type="button" color="green" onClick={handleDone} className="pl-4 pr-4">
                  Done
                </BtnSmall>
                <div className="flex gap-2 mx-4 w-full">
                  <input type="range" min={7} max={17} step={1} className="w-full" {...register("zoom")} />
                  {value}
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
