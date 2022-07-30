import * as React from "react";
import { Hotspot } from "lib/types";
import HotspotGrid from "components/HotspotGrid";

type Props = {
  lat: number;
  lng: number;
  limit?: number;
  exclude?: string[];
};

export default function NearbyHotspots({ limit, exclude, lat, lng }: Props) {
  const [results, setResults] = React.useState<Hotspot[]>([]);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const response = await fetch(
        `/api/hotspot/nearby?lat=${lat}&lng=${lng}&limit=${8}&exclude=${exclude?.join(",")}&offset=${
          results.length || 0
        }`
      );
      const json = await response.json();
      setResults((prev) => [...prev, ...(json?.results || [])]);
    } catch (error) {
      alert("Error fetching hotspots");
    }
    setLoadingMore(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/hotspot/nearby?lat=${lat}&lng=${lng}&limit=${limit}&exclude=${exclude?.join(",")}`
        );
        const json = await response.json();
        setResults(json?.results || []);
      } catch (error) {}
    };
    if (lat && lng) fetchData();
  }, [lat, lng, limit, exclude]);

  return (
    <div className="mt-12">
      <h3 className="mb-4 font-bold text-lg">Nearby Hotspots</h3>
      <div className="grid xs:grid-cols-2 gap-6">
        <HotspotGrid hotspots={results} loading={false} lat={lat} lng={lng} />
      </div>
      {results.length > 0 && (
        <button type="button" onClick={loadMore} className="text-[#4a84b2] font-bold block mx-auto">
          {loadingMore ? "loading..." : "View More"}
        </button>
      )}
    </div>
  );
}
