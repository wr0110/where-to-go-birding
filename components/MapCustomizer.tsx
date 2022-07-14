import * as React from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

type Props = {
  lat: number;
  lng: number;
  zoom: number;
};

export default function MapCustomizer({ lat, lng, zoom }: Props) {
  const [show, setShow] = React.useState(false);
  const [markers, setMarkers] = React.useState<any[]>([]);
  const [isAdding, setIsAdding] = React.useState(false);
  const isAddingRef = React.useRef(false);
  const markersRef = React.useRef<any[]>();
  markersRef.current = markers;
  isAddingRef.current = isAdding;
  const mapContainer = React.useRef(null);
  const map = React.useRef<any>(null);

  const testRef = React.useRef<any>(null);

  function addMarker(event: any) {
    if (!isAddingRef.current) return;
    setIsAdding(false);
    //const [lat, lng] = event.lngLat;
    const id = new Date().getTime();
    const marker = new mapboxgl.Marker();
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<strong>Hello</strong> world<br><button onclick="removeMarker(${id})">Remove</button>`
    );
    marker.setLngLat(event.lngLat).setPopup(popup).addTo(map.current);
    //testRef.current = marker;
    setMarkers((prev) => [
      ...prev,
      {
        id,
        ref: marker,
      },
    ]);
  }

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    //@ts-ignore
    window.removeMarker = function (id: string) {
      const marker = markersRef.current?.find((it) => it.id === id);
      if (!marker) return;
      marker.ref.remove();
    };
  }, []);

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

    map.current.on("click", addMarker);
  });

  return (
    <div className="mt-8">
      <button type="button" onClick={() => setShow((prev) => !prev)}>
        Customize Map
      </button>
      {show && (
        <div
          className={`fixed top-0 bottom-0 left-0 right-0 transition-opacity bg-black z-20 ${
            show ? "opacity-40" : "opacity-0"
          }`}
        />
      )}
      {show && (
        <div
          className={`fixed top-[10%] max-w-xl left-0 right-0 mx-auto z-30 p-8 bg-white shadow rounded-xl ${
            isAdding ? "cursor-crosshair" : ""
          }`}
        >
          <button type="button" onClick={() => setIsAdding(true)} className="bg-gray-500 rounded px-2 text-white">
            Add Parking Pin
          </button>
          <div className="relative">
            {isAdding && (
              <div className="absolute left-1 right-1 top-2 bg-white/70 rounded text-center font-bold z-10">
                Click anywhere on map to add pin
              </div>
            )}
            <div ref={mapContainer} className={`w-full aspect-[4/3.5] mt-2 ${isAdding ? "mapboxAddMarkerMode" : ""}`} />
          </div>
        </div>
      )}
    </div>
  );
}
