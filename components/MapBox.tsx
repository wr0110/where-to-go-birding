import * as React from "react";
import mapboxgl from "mapbox-gl";
import { Marker } from "lib/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

type Props = {
  markers: Marker[];
  lat: number;
  lng: number;
  zoom: number;
  disabled?: boolean;
};

export default function MapBox({ markers, lat, lng, zoom, disabled }: Props) {
  const [satellite, setSatellite] = React.useState<boolean>(false);
  const mapContainer = React.useRef(null);
  const map = React.useRef<any>(null);

  const handleToggle = () => {
    const style = satellite ? "outdoors-v11" : "satellite-streets-v11";
    map.current.setStyle(`mapbox://styles/mapbox/${style}`);
    setSatellite((prev) => !prev);
  };

  React.useEffect(() => {
    if (!mapContainer.current || !lat || !lng) return;
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [lng, lat],
      zoom: zoom || 15,
      interactive: !disabled,
    });
    map.current.addControl(new mapboxgl.NavigationControl());

    markers.map((data) => {
      const img = document.createElement("img");
      img.className = "marker";
      img.src = `/${data.type}-marker.png`;

      const id = new Date().getTime();
      const marker = new mapboxgl.Marker(img);
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `${data.name}<br><a href="https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}" target="_blank" class="marker-link"><b>Get Directions</b></a>`
      );
      marker.setLngLat([data.lng, data.lat]).setPopup(popup).addTo(map.current);

      return { ...data, id, ref: marker };
    });
  });

  React.useEffect(() => {
    if (!map.current) return;
    map.current.flyTo({ zoom });
  }, [zoom]);

  return (
    <div className="relative w-full aspect-[4/3.5] rounded-md overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="flex gap-2 absolute top-2 left-2">
        <button type="button" className="bg-white shadow text-black rounded-sm px-4" onClick={handleToggle}>
          {satellite ? "Terrain" : "Satellite"}
        </button>
      </div>
    </div>
  );
}
