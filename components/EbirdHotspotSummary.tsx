import Link from "next/link";

type Props = {
	name: string,
	locationId: string,
	lat: number,
	lng: number,
	countySlug: string,
	stateSlug: string,
	countyName: string,
	locationIds: string[],
	color?: string,
	portal?: string,
}

export default function EbirdHotspotSummary({ stateSlug, countySlug, countyName, name, locationId, locationIds, lat, lng, color="#4a84b2", portal }: Props) {
	const region = locationIds.length > 1 ? locationIds.join(",") : locationId;
	const base = portal ? `https://ebird.org/${portal}` : "https://ebird.org";
	return (
		<div className={`mb-6 p-2 border-2 rounded`} style={{ borderColor: color }}>
			<h3 className="mb-4 font-bold text-lg">Explore in eBird</h3>
			<h3 className="my-4 font-bold"><Link href={`/birding-in-${stateSlug}/${countySlug}-county`}>{`${countyName} County`}</Link></h3>
			<h3 className="font-bold">{name}</h3>
			Coordinates: {lat}, {lng}<br/>
			<strong>eBird links</strong><br/>
				<a href={`${base}/hotspots?hs=${locationId}&yr=all&m=`} target="_blank" rel="noreferrer">Hotspot map</a>
				&nbsp;–&nbsp;
				<a href={`${base}/hotspot/${locationId}?yr=all&m=&rank=mrec`} target="_blank" rel="noreferrer">View details</a>
				&nbsp;–&nbsp;
				<a href={`${base}/hotspot/${locationId}/activity?yr=all&m=`} target="_blank" rel="noreferrer">Recent visits</a>
				<br/>
			<strong>Bar charts</strong><br />
				<a href={`${base}/barchart?byr=1900&eyr=2060&bmo=1&emo=12&r=${region}`} target="_blank" rel="noreferrer">Entire Year</a>
				&nbsp;–&nbsp;
				<a href={`${base}/barchart?byr=1900&eyr=2060&bmo=3&emo=5&r=${region}`} target="_blank" rel="noreferrer">Spring</a>
				&nbsp;–&nbsp;
				<a href={`${base}/barchart?byr=1900&eyr=2060&bmo=6&emo=7&r=${region}`} target="_blank" rel="noreferrer">Summer</a>
				&nbsp;–&nbsp;
				<a href={`${base}/barchart?byr=1900&eyr=2060&bmo=8&emo=11&r=${region}`} target="_blank" rel="noreferrer">Fall</a>
				&nbsp;–&nbsp;
				<a href={`${base}/barchart?byr=1900&eyr=2060&bmo=12&emo=2&r=${region}`} target="_blank" rel="noreferrer">Winter</a>
				<br/>
				{locationId &&
					<a href={`${base}/hotspot/${region}/media?yr=all&m=`} target="_blank" rel="noreferrer">Illustrated Checklist</a>
				}
				<br/>
			<strong>My eBird links</strong><br/>
				<a href={`${base}/MyEBird?cmd=list&rtype=loc&r=${locationId}&time=life`} target="_blank" rel="noreferrer">Location life list</a>
				&nbsp;–&nbsp;
				<a href={`${base}/submit/effort?locID=${locationId}&clr=1`} target="_blank" rel="noreferrer">Submit data</a>
		</div>
	)
}