import { Hotspot } from "lib/types";
import { distanceBetween } from "lib/helpers";
import Link from "next/link";

type Props = {
  lat?: number;
  lng?: number;
  hotspots: Hotspot[];
  loading: boolean;
};

export default function HotspotGrid({ lat, lng, hotspots, loading }: Props) {
  if (loading) {
    return (
      <div className="mt-12 grid xs:grid-cols-2 md:grid-cols-3 gap-6">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }
  return (
    <div className="mt-12 grid xs:grid-cols-2 md:grid-cols-3 gap-6">
      {hotspots.map(({ name, _id, featuredImg, locationId, parent, lat: hsLat, lng: hsLng }) => {
        let distance = distanceBetween(lat || 0, lng || 0, hsLat, hsLng);
        distance = distance < 10 ? parseFloat(distance.toFixed(1)) : parseFloat(distance.toFixed(0));
        const shortName = name.split("--")?.[1] || name;
        return (
          <article key={_id} className="flex flex-col gap-3">
            <Link href="/hotspot/[id]" as={`/hotspot/${locationId}`}>
              <a>
                <img
                  src={featuredImg?.smUrl || "/placeholder.png"}
                  alt={featuredImg?.caption || ""}
                  className="object-cover rounded-md bg-gray-100 w-full aspect-[1.55]"
                />
              </a>
            </Link>
            <div className="flex-1">
              <div className="mb-4 leading-5 flex items-start">
                <div>
                  {parent?.name && <p className="text-gray-600 text-[11px]">{parent.name}</p>}
                  <h2 className="font-bold">
                    <Link href="/hotspot/[id]" as={`/hotspot/${locationId}`}>
                      <a className="text-gray-700">{shortName}</a>
                    </Link>
                  </h2>
                  <p className="text-gray-500 text-[11px]">{distance} miles away</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Skeleton() {
  return (
    <article className="flex flex-col gap-3 animate-pulse">
      <div className="rounded-md bg-slate-100 w-full aspect-[1.55]" />
      <div>
        <div className="h-3 bg-slate-200 rounded col-span-2" />
        <div className="h-3 bg-slate-200 rounded col-span-2 w-1/2 mt-2" />
      </div>
    </article>
  );
}
