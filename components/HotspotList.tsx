import Link from "next/link";
import { Hotspot } from "lib/types";

type Props = {
	hotspots: Hotspot[],
	countySlug: string,
	stateSlug: string,
}

export default function HotspotList({ hotspots }: Props) {
	return (
		<ul>
			{hotspots?.map(({ name, url }) => (
				<li key={url}>
					<Link href={url}>{name}</Link>
				</li>
			))}
		</ul>
	)
}