import * as React from "react";
import BtnSmall from "./BtnSmall";
import { useFormContext } from "react-hook-form";
import StreetView from "components/StreetView";
import { RefreshIcon } from "@heroicons/react/outline";
import useSecureFetch from "hooks/useSecureFetch";

export default function AddStreetView() {
  const [loading, setLoading] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [fov, setFov] = React.useState(80);
  const [open, setOpen] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const { setValue, getValues } = useFormContext();
  const secureFetch = useSecureFetch();
  React.useEffect(() => setRendered(true), []);

  const pieces = url.split(",");

  const lat = parseFloat(pieces[0]?.split("@")?.[1]);
  const lng = parseFloat(pieces[1]);
  const heading = parseInt(pieces[4]?.replace("h", ""));
  const tilt = parseInt(pieces[5]?.replace("t", ""));
  const pitch = tilt ? tilt - 90 : 0;

  const invalid = !!url && (!lat || !lng || !fov || !heading || !tilt);
  const isValid = !!lat && !!lng && !!fov && !!heading && !!tilt;

  const handleAdd = async () => {
    setLoading(true);
    const json = await secureFetch(`/api/file/add-streetview`, "POST", {
      lat,
      lng,
      fov,
      heading,
      pitch,
    });
    setLoading(false);
    const { small, large, success } = json;
    if (success) {
      const image = {
        smUrl: small,
        lgUrl: large,
        by: "© Google Street View",
        caption: "",
        width: 640,
        height: 413,
        isStreetview: true,
        isNew: true,
        streetviewData: { lat, lng, fov, heading, pitch },
      };
      const images = getValues().images || [];
      setValue("images", [...images, image]);
      setOpen(false);
      setUrl("");
      setFov(90);
    } else {
      console.error(json.error);
      alert("Error adding street view");
    }
  };

  return (
    <>
      <button type="button" className="text-[#2275d7] text-xs font-medium" onClick={() => setOpen(!open)}>
        Or add Google Street View
      </button>
      {open && (
        <div className="mt-8">
          <div
            className={`fixed top-0 bottom-0 left-0 right-0 transition-opacity bg-black z-[10000] ${
              rendered ? "opacity-40" : "opacity-0"
            }`}
          />
          <div className="fixed left-0 right-0 top-0 bottom-0 overflow-auto z-[10001] px-2">
            <div className={`mt-[5%] mb-12 sm:max-w-[700px]  mx-auto bg-white shadow-md rounded-lg overflow-hidden`}>
              <header className="p-4 border-b flex bg-gray-50">
                <span className="text-lg font-medium mr-auto">Add Google Street View</span>
              </header>
              <div className="p-4">
                <div className="flex-1">
                  <label className="text-gray-500 font-bold">
                    Google Street View URL <br />
                    <input type="text" className="form-input" value={url} onChange={(e) => setUrl(e.target.value)} />
                  </label>
                </div>
                {!url && (
                  <p className="my-4 font-normal">
                    Browse{" "}
                    <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">
                      Google Maps
                    </a>{" "}
                    and find a Street View image that you want to include. In Street View mode, copy the browser URL and
                    paste it into the field above.
                  </p>
                )}
                {invalid && (
                  <p className="my-4 font-normal text-amber-700">The URL you entered is not valid. Please try again.</p>
                )}
                {isValid && (
                  <StreetView
                    lat={lat}
                    lng={lng}
                    heading={heading}
                    pitch={pitch}
                    fov={fov}
                    className="w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-lg pointer-events-none mt-4"
                  />
                )}
                {isValid && (
                  <div className="flex-1">
                    <label className="text-gray-500 font-bold flex gap-4 mt-4 whitespace-nowrap">
                      Field of View <br />
                      <input
                        type="range"
                        min={20}
                        max={100}
                        step={10}
                        value={fov}
                        className="w-full"
                        onChange={(e) => setFov(parseInt(e.target.value))}
                      />
                    </label>
                  </div>
                )}
              </div>

              <footer className="p-4 border-t flex items-center bg-gray-50">
                <BtnSmall
                  type="button"
                  color="green"
                  onClick={handleAdd}
                  disabled={!url || invalid || loading}
                  className="pl-4 pr-4"
                >
                  {loading ? <RefreshIcon className="h-5 w-5 animate-spin" /> : "Add"}
                </BtnSmall>
                <BtnSmall type="button" color="gray" onClick={() => setOpen(false)} className="pl-4 pr-4 ml-2">
                  Cancel
                </BtnSmall>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
