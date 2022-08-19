import * as React from "react";
import { Hotspot } from "lib/types";
import HotspotGrid from "components/HotspotGrid";
import Link from "next/link";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";

type Props = {
  region: string;
  label?: string;
};

export default function TopHotspots({ region, label }: Props) {
  const [results, setResults] = React.useState<Hotspot[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/hotspot/by-region?region=${region}&limit=12`);
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
    <>
      <div className="mt-12 grid xs:grid-cols-2 md:grid-cols-4 gap-6">
        <HotspotGrid hotspots={results} loading={false} showFullName />
      </div>
      <Link href={`/explore?mode=region&region=${region}&label=${label || region}`}>
        <a className="bg-[#4a84b2] hover:bg-[#325a79] text-white font-bold py-1.5 text-sm px-4 rounded-full w-[140px] mx-auto block mt-8 text-center">
          View More <ArrowNarrowRightIcon className="inline-block w-4 h-4 ml-2" />
        </a>
      </Link>
    </>
  );
}
