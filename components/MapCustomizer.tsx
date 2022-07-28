import * as React from "react";
import mapboxgl from "mapbox-gl";
import AddMarkerBtn from "components/AddMarkerBtn";
import EditZoomBtn from "./EditZoomBtn";
import BtnSmall from "./BtnSmall";
import useSecureFetch from "hooks/useSecureFetch";
import { useRouter } from "next/router";
import { RefreshIcon } from "@heroicons/react/outline";
import { Marker } from "lib/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

type Props = {
  onClose: () => void;
  hideDefault: boolean;
  markers: Marker[];
  hotspotId: string;
  lat: number;
  lng: number;
  zoom: number;
};

export default function MapCustomizer({
  onClose,
  markers: defaultMarkers,
  hideDefault,
  hotspotId,
  lat,
  lng,
  zoom: defaultZoom,
}: Props) {
  const [zoom, setZoom] = React.useState<number>(defaultZoom || 15);
  const [satellite, setSatellite] = React.useState<boolean>(false);
  const [rendered, setRendered] = React.useState(false);
  const [initalized, setInitialized] = React.useState<boolean>(false);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [markers, setMarkers] = React.useState<any[]>([]);
  const [addingType, setAddingType] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [hideDefaultMarker, setHideDefaultMarker] = React.useState<boolean>(hideDefault);
  const editingMarker = editingId ? markers.find((m) => m.id === editingId) : null;
  const addingTypeRef = React.useRef<string | null>(null);
  const markersRef = React.useRef<any[]>();
  const defaultMarkersRef = React.useRef<Marker[]>([]);
  defaultMarkersRef.current = defaultMarkers;
  markersRef.current = markers;
  addingTypeRef.current = addingType;
  const generalMarkerRef = React.useRef<any>();
  const mapContainer = React.useRef(null);
  const map = React.useRef<any>(null);
  const secureFetch = useSecureFetch();
  const router = useRouter();

  const handleSubmit = async () => {
    setSaving(true);
    const json = await secureFetch(`/api/hotspot/set-markers`, "POST", {
      hotspotId,
      zoom,
      hideDefaultMarker,
      data: markers.map(({ ref, id, ...marker }) => marker),
    });
    if (json.success) {
      router.reload();
      onClose();
    } else {
      setSaving(false);
      console.error(json.error);
      alert("Error saving hotspot");
    }
  };

  function addMarker(event: any) {
    const type = addingTypeRef.current;
    if (!type) return;
    setAddingType(null);
    setEditingId(null);
    const img = document.createElement("img");
    img.className = "marker";
    img.src = `/${type}-marker.png`;

    const id = new Date().getTime();
    const marker = new mapboxgl.Marker(img);
    marker.setLngLat(event.lngLat).addTo(map.current);
    marker.getElement().addEventListener("click", () => {
      setEditingId(id);
    });

    setMarkers((prev) => [
      ...prev,
      {
        id,
        type,
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
        description: type === "parking" ? "Parking" : type === "toilets" ? "Toilets" : "",
        useForDirections: false,
        ref: marker,
      },
    ]);
    setEditingId(id);
  }

  const handleHeaderClick = () => {
    if (addingType) {
      setAddingType(null);
    }
  };

  const handleDescriptionChange = (value: string, id: number) => {
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id === id) {
          return { ...marker, description: value };
        }
        return marker;
      })
    );
  };

  const handleRemove = (id: number) => {
    setMarkers((prev) =>
      prev.filter((marker) => {
        if (marker.id !== id) return marker;
      })
    );
    const marker = markersRef.current?.find((it) => it.id === id);
    if (!marker) return;
    marker.ref.remove();
  };

  const handleCheckbox = (id: number) => {
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id === id) {
          return { ...marker, useForDirections: !marker.useForDirections };
        }
        return { ...marker, useForDirections: false };
      })
    );
  };

  const handleToggleDefault = () => {
    setHideDefaultMarker(!hideDefaultMarker);
  };

  const handleZoom = (zoom: number) => {
    map.current.flyTo({ zoom });
    setZoom(zoom);
  };

  const handleClose = () => {
    onClose();
    map.current?.remove();
  };

  const handleToggle = () => {
    const style = satellite ? "outdoors-v11" : "satellite-streets-v11";
    map.current.setStyle(`mapbox://styles/mapbox/${style}`);
    setSatellite((prev) => !prev);
  };

  React.useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.dragRotate.disable();
    map.current.touchZoomRotate.disableRotation();
    map.current.on("click", addMarker);
  });

  React.useEffect(() => {
    if (!map.current || initalized) return;
    const markers = defaultMarkersRef.current?.map((data) => {
      const img = document.createElement("img");
      img.className = "marker";
      img.src = `/${data.type}-marker.png`;

      const id = new Date().getTime();
      const marker = new mapboxgl.Marker(img);
      marker.setLngLat([data.lng, data.lat]).addTo(map.current);
      marker.getElement().addEventListener("click", () => {
        setEditingId(id);
      });

      return { ...data, id, ref: marker };
    });

    const img = document.createElement("img");
    img.className = "marker default-marker";
    img.src = `/hotspot-marker.png`;

    const marker = new mapboxgl.Marker(img);
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML("<strong>General Location</strong>");
    marker.setLngLat([lng, lat]).setPopup(popup).addTo(map.current);
    generalMarkerRef.current = marker;

    setMarkers(markers);
    setInitialized(true);
  });

  React.useEffect(() => {
    setRendered(true);
    () => map.current?.remove();
  }, []);

  return (
    <div className="mt-8">
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 transition-opacity bg-black z-20 ${
          rendered ? "opacity-40" : "opacity-0"
        }`}
      />
      <div className={`fixed top-[10%] max-w-xl left-0 right-0 mx-auto z-30 bg-white shadow-md rounded-lg `}>
        <header className="p-4 border-b flex" onClick={handleHeaderClick}>
          <span className="text-lg font-medium mr-auto">Customize Map</span>
          <EditZoomBtn onReset={() => handleZoom(zoom)} onChange={handleZoom} value={zoom} />
          <AddMarkerBtn isAdding={addingType !== null} onClick={setAddingType} />
        </header>

        <div className={addingType ? "cursor-crosshair" : ""}>
          <div className="relative">
            {addingType && (
              <div className="absolute left-1 right-1 -top-3 bg-yellow-200 rounded text-center font-bold z-10 text-sm">
                Click anywhere on map to add marker or{" "}
                <button type="button" onClick={() => setAddingType(null)} className="text-blue-500 underline">
                  cancel
                </button>
              </div>
            )}
            <div className="relative w-full aspect-[4/3.5]">
              <div
                ref={mapContainer}
                className={`w-full h-full ${addingType ? "mapboxAddMarkerMode" : ""} ${
                  hideDefaultMarker ? "hide-default" : ""
                }`}
              />
              <button
                type="button"
                className="absolute top-2 left-2 bg-white shadow text-black rounded-sm px-4"
                onClick={handleToggle}
              >
                {satellite ? "Terrain" : "Satellite"}
              </button>
            </div>
          </div>
        </div>

        {editingMarker && (
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[285px]">
            <div className="px-4 py-2 rounded bg-white zoom-in">
              <label className="text-gray-500 font-bold w-full">
                Description
                <br />
                <textarea
                  className="basic-input w-full"
                  value={editingMarker?.description}
                  onChange={(e: any) => handleDescriptionChange(e.target.value, editingMarker.id)}
                />
              </label>
              <label className="text-gray-500 font-bold mt-2 text-[85%] flex items-center">
                <input
                  type="checkbox"
                  className="focus:ring-0 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={editingMarker.useForDirections}
                  onChange={(e: any) => handleCheckbox(editingMarker.id)}
                />
                &nbsp;&nbsp;Default for directions
              </label>
              <div className="flex justify-between">
                <button className="mt-2 text-sky-700 font-bold" onClick={() => setEditingId(null)}>
                  Done
                </button>
                <button className="mt-2 text-red-600" onClick={() => handleRemove(editingMarker.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="p-4 border-t flex items-center">
          <BtnSmall type="button" color="green" onClick={handleSubmit} className="pl-4 pr-4">
            {saving ? <RefreshIcon className="h-5 w-5 animate-spin" /> : "Save"}
          </BtnSmall>
          <BtnSmall type="button" color="gray" onClick={handleClose} className="ml-2 pl-4 pr-4">
            Cancel
          </BtnSmall>
          <div className="ml-auto">
            <label className="text-gray-500 font-bold flex items-center">
              <input
                type="checkbox"
                className="focus:ring-0 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={hideDefaultMarker}
                onChange={(e: any) => handleToggleDefault()}
              />
              &nbsp;&nbsp;Hide general marker
            </label>
          </div>
        </footer>
      </div>
    </div>
  );
}
