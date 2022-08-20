import * as React from "react";
import { Hotspot } from "lib/types";
import HotspotGrid from "components/HotspotGrid";
import Link from "next/link";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";

type Props = {
  region: string;
  label?: string;
  className?: string;
};

export default function TopHotspots({ region, label, className }: Props) {
  const [results, setResults] = React.useState<Hotspot[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/hotspot/by-region?region=${region}&limit=10`);
        const json = await response.json();
        setResults(json?.results || []);
      } catch (error) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={`grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className || ""}`}>
        <HotspotGrid hotspots={results} loading={loading} skeletonCount={10} smallTitle />
      </div>
      {results.length > 0 && (
        <Link href={`/explore?mode=region&region=${region}&label=${label || region}`}>
          <a className="bg-[#4a84b2] hover:bg-[#325a79] text-white font-bold py-1.5 text-sm px-4 rounded-full w-[140px] mx-auto block mt-4 text-center">
            View More <ArrowNarrowRightIcon className="inline-block w-4 h-4 ml-2" />
          </a>
        </Link>
      )}
    </>
  );
}
