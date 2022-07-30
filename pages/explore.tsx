import * as React from "react";
import Link from "next/link";
import Title from "components/Title";
import { Hotspot, LocationSearchValue } from "lib/types";
import LocationSearch from "components/LocationSearch";
import { SearchIcon } from "@heroicons/react/outline";
import HotspotGrid from "components/HotspotGrid";
import PageHeading from "components/PageHeading";

export default function Home() {
  const [results, setResults] = React.useState<Hotspot[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<boolean>(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [location, setLocation] = React.useState<LocationSearchValue | null>(() => {
    if (typeof window === "undefined") return null;
    const json = localStorage.getItem("location") || "";
    const location = json ? JSON.parse(json) : null;
    if (location?.lat && location?.lng) {
      return location;
    }
    return null;
  });
  const { lat, lng, label } = location || {};

  const loadMore = async () => {
    if (loading) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/hotspot/nearby?lat=${lat}&lng=${lng}&offset=${results.length || 0}`);
      const json = await response.json();
      setResults((prev) => [...prev, ...(json?.results || [])]);
    } catch (error) {
      alert("Error fetching hotspots");
    }
    setLoadingMore(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/hotspot/nearby?lat=${lat}&lng=${lng}`);
        const json = await response.json();
        setResults(json?.results || []);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    if (lat && lng) fetchData();
  }, [lat, lng]);

  React.useEffect(() => {
    if (!lat || !lng || !label) return;
    localStorage.setItem("location", JSON.stringify({ lat, lng, label }));
  }, [lat, lng, label]);

  return (
    <div className="container pb-16 mt-12 max-w-[975px]">
      <Title />
      <PageHeading breadcrumbs={false}>Explore Nearby Hotspots</PageHeading>
      <div className="relative w-full sm:w-[500px] mx-auto">
        <LocationSearch
          value={location}
          onChange={setLocation}
          className="pl-12 w-full border-gray-200 focus:border-gray-300 block outline-none rounded-full px-6 py-3 shadow focus:ring-0"
        />
        <SearchIcon className="absolute top-4 left-4 w-[18px h-[18px] text-gray-500" />
      </div>
      <div className="mt-12 grid xs:grid-cols-2 md:grid-cols-3 gap-6">
        <HotspotGrid hotspots={results} loading={loading} lat={lat} lng={lng} />
      </div>
      {error && <p className="text-center text-lg text-red-700 my-4">Error loading hotspots</p>}
      {results.length > 0 && (
        <button
          type="button"
          onClick={loadMore}
          className="bg-[#4a84b2] hover:bg-[#325a79] text-white font-bold py-2 px-4 rounded-full w-[220px] mx-auto block mt-8"
        >
          {loadingMore ? "loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
