import * as React from "react";
import Link from "next/link";
import { HotspotsByCounty } from "lib/types";

type Props = {
	stateSlug: string,
	hotspots: HotspotsByCounty,
}

export default function ListHotspotsByCounty({ stateSlug, hotspots }: Props) {
	return (
		<>
			{hotspots.map(({countySlug, countyName, hotspots}) => (
					<p key={countySlug} className="mb-4 break-inside-avoid">
						<Link href={`/birding-in-${stateSlug}/${countySlug}-county`}>
							<a>{countyName} County</a>
						</Link>
						<br/>
						{hotspots.map(({name, url}) => (
							<React.Fragment key={url}>
								<Link href={url}>
									<a className="font-bold">{name}</a>
								</Link>
								<br/>
							</React.Fragment>
						))}
					</p>
				))}
		</>
	)
}