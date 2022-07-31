import * as React from "react";
import { Hotspot } from "lib/types";
import HotspotGrid from "components/HotspotGrid";

export default function Feat() {
  const [results, setResults] = React.useState<Hotspot[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hotspot/featured");
        const json = await response.json();
        setResults(json?.results || []);
      } catch (error) {}
    };
    fetchData();
  }, []);

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 grid xs:grid-cols-2 md:grid-cols-4 gap-6">
      <HotspotGrid hotspots={results} loading={false} showFullName />
    </div>
  );
}
