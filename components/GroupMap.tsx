import * as React from "react";
import mapboxgl from "mapbox-gl";
import { Marker } from "lib/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

type Props = {
  lat: number;
  lng: number;
  zoom: number;
  markers: Marker[];
};

export default function MapCustomizer({ markers, lat, lng, zoom }: Props) {
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

    markers.forEach((it) => {
      let name = it.name;
      if (name.includes("--")) {
        name = name.split("--")[1];
      }
      const marker = new mapboxgl.Marker();
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${name}</strong><br><a href="${it.url}" class="marker-link">View Hotspot</button>`
      );
      marker.setLngLat(it.coordinates).setPopup(popup).addTo(map.current);
    });
  });

  return <div ref={mapContainer} className="w-full aspect-[4/3.5] mt-2" />;
}
