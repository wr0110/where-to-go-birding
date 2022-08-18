import * as React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Title from "components/Title";
import { Hotspot, LocationSearchValue } from "lib/types";
import LocationSearch from "components/LocationSearch";
import { useRouter } from "next/router";
import HotspotGrid from "components/HotspotGrid";
import PageHeading from "components/PageHeading";
import RegionSearch from "components/RegionSearch";
import ExploreToggle from "components/ExploreToggle";

type Option = {
  value: string;
  label: string;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { params: query } };
};

type Props = {
  params: any;
};

export default function Explore({ params }: Props) {
  const router = useRouter();
  const [mode, setMode] = React.useState<string>((params.mode as string) || "nearby");
  const [region, setRegion] = React.useState<Option | null>(() => {
    const value = params.region;
    const label = params.label;
    if (params.mode === "region" && value && label) {
      return { value, label };
    }
    return null;
  });
  const [results, setResults] = React.useState<Hotspot[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<boolean>(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [location, setLocation] = React.useState<LocationSearchValue | null>(() => {
    if (typeof window === "undefined") return null;
    const lat = params.lat as string;
    const lng = params.lng as string;
    const label = params.label as string;
    if (lat && lng) {
      return { lat, lng, label };
    }
    const json = localStorage.getItem("location") || "";
    const location = json ? JSON.parse(json) : null;
    if (location?.lat && location?.lng) {
      return location;
    }
    return null;
  });

  const { lat, lng, label } = location || {};
  const { value: regionCode, label: regionLabel } = region || {};

  const loadMore = async () => {
    if (loading) return;
    setLoadingMore(true);
    try {
      const response = await fetch(
        mode === "nearby"
          ? `/api/hotspot/nearby?lat=${lat}&lng=${lng}&offset=${results.length || 0}`
          : `/api/hotspot/by-region?region=${regionCode}&offset=${results.length || 0}`
      );
      const json = await response.json();
      setResults((prev) => [...prev, ...(json?.results || [])]);
    } catch (error) {
      alert("Error fetching hotspots");
    }
    setLoadingMore(false);
  };

  const handleRegionChange = (option: Option) => {
    console.log("handleRegionChange", option);
    setRegion(option);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          mode === "nearby"
            ? `/api/hotspot/nearby?lat=${lat}&lng=${lng}`
            : `/api/hotspot/by-region?region=${regionCode}`
        );
        const json = await response.json();
        setResults(json?.results || []);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    if ((lat && lng) || regionCode) fetchData();
  }, [lat, lng, regionCode, mode]);

  React.useEffect(() => {
    if (!lat || !lng || !label) return;
    localStorage.setItem("location", JSON.stringify({ lat, lng, label }));
  }, [lat, lng, label]);

  React.useEffect(() => {
    if (mode === "nearby") {
      router.replace({ query: { mode, lat, lng, label } });
    } else {
      router.replace({ query: { mode, region: regionCode, label: regionLabel } });
    }
  }, [mode, regionCode, regionLabel, lat, lng, label]);

  return (
    <div className="container pb-16 mt-12 max-w-[975px]">
      <Title />
      <PageHeading breadcrumbs={false}>Explore Hotspots</PageHeading>
      <div className="relative w-full sm:w-[500px] mx-auto flex">
        <ExploreToggle value={mode} onChange={setMode} />
        {mode === "nearby" && (
          <LocationSearch
            value={location}
            onChange={setLocation}
            className="w-full border-gray-200 focus:border-gray-200 block outline-none rounded-r-full px-6 py-3 shadow focus:ring-0"
          />
        )}
        {mode === "region" && <RegionSearch onChange={handleRegionChange} value={region} isClearable />}
      </div>
      <div className="mt-12 grid xs:grid-cols-2 md:grid-cols-3 gap-6">
        <HotspotGrid
          hotspots={results}
          loading={loading}
          lat={mode === "nearby" ? lat : undefined}
          lng={mode === "nearby" ? lng : undefined}
        />
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
