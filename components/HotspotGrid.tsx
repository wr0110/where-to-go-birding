import { Hotspot } from "lib/types";
import { distanceBetween } from "lib/helpers";
import Link from "next/link";

type Props = {
  lat?: number;
  lng?: number;
  hotspots: Hotspot[];
  loading: boolean;
  showFullName?: boolean;
  smallTitle?: boolean;
  skeletonCount?: number;
};

export default function HotspotGrid({ lat, lng, hotspots, loading, showFullName, smallTitle, skeletonCount }: Props) {
  if (loading) {
    return (
      <>
        {Array.from(Array(skeletonCount || 6)).map((item, i) => (
          <Skeleton key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {hotspots.map(({ name, _id, featuredImg, url, parent, lat: hsLat, lng: hsLng, species }) => {
        let distance = distanceBetween(lat || 0, lng || 0, hsLat, hsLng);
        distance = distance < 10 ? parseFloat(distance.toFixed(1)) : parseFloat(distance.toFixed(0));
        showFullName = showFullName || !parent?.name;
        const shortName = showFullName ? name : name.split("--")?.[1] || name;
        const showMeta = (lat && lng) || Number.isInteger(species);
        return (
          <article key={_id} className="flex flex-col gap-3">
            <Link href={url}>
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
                    <Link href={url}>
                      <a className={`text-gray-700 ${smallTitle ? "text-[13px] leading-3" : ""}`}>{shortName}</a>
                    </Link>
                  </h2>
                  {showMeta && (
                    <p className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      {lat && lng && <span>{distance} miles away</span>}
                      {lat && lng && Number.isInteger(species) && <span>•</span>}
                      {Number.isInteger(species) && <span>{species} species</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </>
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
