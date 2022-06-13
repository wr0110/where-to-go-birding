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
}

export default function EbirdHotspotSummary({ stateSlug, countySlug, countyName, name, locationId, locationIds, lat, lng }: Props) {
	const region = locationIds.length > 1 ? locationIds.join(",") : locationId;
	return (
		<div className="mb-6">
			<h3 className="mb-4 font-bold">eBird Hotspot</h3>
			<h3 className="my-4 font-bold"><Link href={`/birding-in-${stateSlug}/${countySlug}-county`}>{`${countyName} County`}</Link></h3>
			<h3 className="font-bold">{name}</h3>
			Coordinates: {lat}, {lng}<br/>
			Bar charts:
				&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=1&emo=12&r=${region}`}>Entire Year</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=3&emo=5&r=${region}`}>Spring</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=6&emo=7&r=${region}`}>Summer</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=8&emo=11&r=${region}`}>Fall</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=12&emo=2&r=${region}`}>Winter</a>
				<br/>
			eBird links:
				&nbsp;
				<a href={`https://ebird.org/ebird/hotspots?hs=${locationId}&yr=all&m=`} target="_blank" rel="noreferrer">Hotspot map</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/hotspot/${locationId}?yr=all&m=&rank=mrec`} target="_blank" rel="noreferrer">View details</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/hotspot/${locationId}/activity?yr=all&m=`} target="_blank" rel="noreferrer">Recent visits</a>
				<br/>
			My eBird links:
				&nbsp;
				<a href={`https://ebird.org/ebird/MyEBird?cmd=list&rtype=loc&r=${locationId}&time=life`} target="_blank" rel="noreferrer">Location life list</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/submit/effort?locID=${locationId}&clr=1`} target="_blank" rel="noreferrer">Submit data</a>
		</div>
	)
}