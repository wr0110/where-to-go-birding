import * as React from "react";
import { Hotspot } from "lib/types";
import MapBox from "components/MapBox";
import BtnSmall from "./BtnSmall";
import { useFormContext } from "react-hook-form";
import { ZoomInIcon } from "@heroicons/react/outline";

export default function StreetViewInput({ lat, lng }: Hotspot) {
  const [open, setOpen] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const { register, watch } = useFormContext();
  React.useEffect(() => setRendered(true), []);
  const mapRef = React.useRef(null);
  const streetViewRef = React.useRef(null);
  const isInitalizedRef = React.useRef<boolean>();

  const handleDone = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    //@ts-ignore
    if (!mapRef.current || !streetViewRef.current || isInitalizedRef.current || !window.google) {
      return;
    }
    const fenway = { lat: 42.345573, lng: -71.098326 };
    //@ts-ignore
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: fenway,
      zoom: 14,
    });
    //@ts-ignore
    const panorama = new google.maps.StreetViewPanorama(document.getElementById("pano") as HTMLElement, {
      position: fenway,
      pov: {
        heading: 34,
        pitch: 10,
      },
    });

    map.setStreetView(panorama);
    isInitalizedRef.current = true;
  });

  return (
    <>
      <button
        type="button"
        className="flex gap-2 bg-white shadow items-center rounded px-4 py-1.5 w-full justify-center"
        onClick={() => setOpen(!open)}
      >
        <ZoomInIcon className="h-5 w-5" /> Edit Street View
      </button>
      <p className="text-xs text-gray-600 mt-2">Street View is not shown if images have been uploaded.</p>

      {open && (
        <div className="mt-8">
          <div
            className={`fixed top-0 bottom-0 left-0 right-0 transition-opacity bg-black z-[10000] ${
              rendered ? "opacity-40" : "opacity-0"
            }`}
          />
          <div className="fixed left-0 right-0 top-0 bottom-0 overflow-auto z-[10001]">
            <div className={`mt-[5%] mb-12 max-w-[900px]  mx-auto bg-white shadow-md rounded-lg `}>
              <div className="flex">
                <div id="map" ref={mapRef} className="w-[400px] h-[350px]" />
                <div id="pano" ref={streetViewRef} className="w-[500px] h-[350px]" />
              </div>

              <footer className="p-4 border-t flex items-center">
                <BtnSmall type="button" color="green" onClick={handleDone} className="pl-4 pr-4">
                  Done
                </BtnSmall>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
