import * as React from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

type Props = {
  lat: number;
  lng: number;
  zoom: number;
};

export default function MapBox({ lat, lng, zoom }: Props) {
  const mapContainer = React.useRef(null);
  const map = React.useRef<any>(null);

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
  });

  return <div ref={mapContainer} className="w-full aspect-[4/3.5] mt-8" />;
}
