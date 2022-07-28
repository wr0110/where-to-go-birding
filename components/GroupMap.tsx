import * as React from "react";
import mapboxgl from "mapbox-gl";
import { GroupMarker } from "lib/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

type Props = {
  lat: number;
  lng: number;
  zoom: number;
  markers: GroupMarker[];
};

export default function MapCustomizer({ markers, lat, lng, zoom }: Props) {
  const [satellite, setSatellite] = React.useState<boolean>(false);
  const mapContainer = React.useRef(null);
  const map = React.useRef<any>(null);

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
      zoom: zoom || 15,
    });
    map.current.addControl(new mapboxgl.NavigationControl());

    markers.forEach((it) => {
      let name = it.name;
      if (name.includes("--")) {
        name = name.split("--")[1];
      }
      const marker = new mapboxgl.Marker();
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${name}</strong><br><a href="${it.url}" class="marker-link">View Hotspot</a>`
      );
      marker.setLngLat(it.coordinates).setPopup(popup).addTo(map.current);
    });
  });

  return (
    <div className="relative w-full aspect-[4/3.5] mt-2">
      <div ref={mapContainer} className="w-full h-full" />
      <button
        type="button"
        className="absolute top-2 left-2 bg-white shadow text-black rounded-sm px-4"
        onClick={handleToggle}
      >
        {satellite ? "Terrain" : "Satellite"}
      </button>
    </div>
  );
}
