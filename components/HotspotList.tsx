import Link from "next/link";
import { Hotspot } from "lib/types";

type Props = {
	hotspots: Hotspot[],
	countySlug: string,
	stateSlug: string,
}

export default function HotspotList({ countySlug, stateSlug, hotspots }: Props) {
	return (
		<ul>
			{hotspots?.map(({ name, slug: hotspotSlug }) => (
				<li key={hotspotSlug}>
					<Link href={`/birding-in-${stateSlug}/${countySlug}-county/${hotspotSlug}`}>{name}</Link>
				</li>
			))}
		</ul>
	)
}