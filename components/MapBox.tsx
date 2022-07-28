import * as React from "react";
import mapboxgl from "mapbox-gl";
import MapCustomizer from "components/MapCustomizer";
import { Marker } from "lib/types";
import { useUser } from "providers/user";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

type Props = {
  markers: Marker[];
  hideDefault: boolean;
  hotspotId: string;
  lat: number;
  lng: number;
  zoom: number;
};

export default function MapBox({ hideDefault, markers, hotspotId, lat, lng, zoom }: Props) {
  const [satellite, setSatellite] = React.useState<boolean>(false);
  const mapContainer = React.useRef(null);
  const map = React.useRef<any>(null);
  const { user } = useUser();
  const [open, setOpen] = React.useState(false);

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
    });
    map.current.addControl(new mapboxgl.NavigationControl());

    markers.map((data) => {
      const img = document.createElement("img");
      img.className = "marker";
      img.src = `/${data.type}-marker.png`;

      const id = new Date().getTime();
      const marker = new mapboxgl.Marker(img);
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `${data.description}<br><a href="https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}" target="_blank" class="marker-link"><b>Get Directions</b></a>`
      );
      marker.setLngLat([data.lng, data.lat]).setPopup(popup).addTo(map.current);

      return { ...data, id, ref: marker };
    });

    if (!hideDefault) {
      const img = document.createElement("img");
      img.className = "marker default-marker";
      img.src = `/hotspot-marker.png`;

      const marker = new mapboxgl.Marker(img);
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>General Location</strong><br><a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" class="marker-link"><b>Get Directions</b></a>`
      );
      marker.setLngLat([lng, lat]).setPopup(popup).addTo(map.current);
    }
  });

  return (
    <>
      {user && open && (
        <MapCustomizer
          hideDefault={hideDefault}
          onClose={() => setOpen(false)}
          markers={markers}
          hotspotId={hotspotId}
          lat={lat}
          lng={lng}
          zoom={zoom}
        />
      )}
      <div className="relative w-full aspect-[4/3.5] rounded-md overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
        <div className="flex gap-2 absolute top-2 left-2">
          <button type="button" className="bg-white shadow text-black rounded-sm px-4" onClick={handleToggle}>
            {satellite ? "Terrain" : "Satellite"}
          </button>
          {user && (
            <button
              type="button"
              className="bg-white shadow text-black rounded-sm px-4"
              onClick={() => setOpen((prev) => !prev)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}
