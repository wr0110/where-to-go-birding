import Link from "next/link";
import { State, County } from "lib/types";

type Props = {
  state: State;
  county: County;
  name: string;
  locationId: string;
  lat: number;
  lng: number;
  locationIds: string[];
};

export default function EbirdHotspotSummary({ state, county, name, locationId, locationIds, lat, lng }: Props) {
  const color = state.color || "#4a84b2";
  const region = locationIds.length > 1 ? locationIds.join(",") : locationId;
  const base = state.portal ? `https://ebird.org/${state.portal}` : "https://ebird.org";
  return (
    <section className={`mb-6 p-2 border-2 rounded`} style={{ borderColor: color }}>
      <h3 className="mb-2 font-bold text-lg">Explore in eBird</h3>
      Coordinates: {lat}, {lng}
      <br />
      <a href={`${base}/hotspots?hs=${locationId}&yr=all&m=`} target="_blank" rel="noreferrer">
        Hotspot map
      </a>
      &nbsp;–&nbsp;
      <a href={`${base}/hotspot/${locationId}?yr=all&m=&rank=mrec`} target="_blank" rel="noreferrer">
        View details
      </a>
      &nbsp;–&nbsp;
      <a href={`${base}/hotspot/${locationId}/activity?yr=all&m=`} target="_blank" rel="noreferrer">
        Recent visits
      </a>
      <br />
      <strong>Bar charts</strong>
      <br />
      <a href={`${base}/barchart?byr=1900&eyr=2060&bmo=1&emo=12&r=${region}`} target="_blank" rel="noreferrer">
        Entire Year
      </a>
      &nbsp;–&nbsp;
      <a href={`${base}/barchart?byr=1900&eyr=2060&bmo=3&emo=5&r=${region}`} target="_blank" rel="noreferrer">
        Spring
      </a>
      &nbsp;–&nbsp;
      <a href={`${base}/barchart?byr=1900&eyr=2060&bmo=6&emo=7&r=${region}`} target="_blank" rel="noreferrer">
        Summer
      </a>
      &nbsp;–&nbsp;
      <a href={`${base}/barchart?byr=1900&eyr=2060&bmo=8&emo=11&r=${region}`} target="_blank" rel="noreferrer">
        Fall
      </a>
      &nbsp;–&nbsp;
      <a href={`${base}/barchart?byr=1900&eyr=2060&bmo=12&emo=2&r=${region}`} target="_blank" rel="noreferrer">
        Winter
      </a>
      <br />
      {locationId && (
        <a href={`${base}/hotspot/${region}/media?yr=all&m=`} target="_blank" rel="noreferrer">
          Illustrated Checklist
        </a>
      )}
      <br />
      <strong>My eBird links</strong>
      <br />
      <a href={`${base}/MyEBird?cmd=list&rtype=loc&r=${locationId}&time=life`} target="_blank" rel="noreferrer">
        Location life list
      </a>
      &nbsp;–&nbsp;
      <a href={`${base}/submit/effort?locID=${locationId}&clr=1`} target="_blank" rel="noreferrer">
        Submit data
      </a>
    </section>
  );
}
