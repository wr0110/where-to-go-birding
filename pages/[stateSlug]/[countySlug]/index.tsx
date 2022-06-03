import * as React from "react";
import Link from "next/link";
import { getHotspots } from "lib/firebase";
import { getCounty, getState } from "lib/helpers";

export async function getServerSideProps({ query: { stateSlug, countySlug }}) {
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const county = getCounty(state.code, countySlug);
	if (!county) return { notFound: true };
	
	const hotspots = await getHotspots(county.slug) || [];
  return {
    props: { stateSlug: state.slug, countySlug: county.slug, hotspots, ...county },
  }
}

export default function County({ stateSlug, countySlug, hotspots, name, color }) {
	return (
		<div className="container pb-16">
			<h1 className="font-bold text-white text-2xl header-gradient p-3 my-16" style={{"--county-color": color} as React.CSSProperties}>{name} County</h1>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<ol>
						{hotspots?.map(({ name, slug }) => (
							<li key={slug}>
								<Link href={`/birding-in-${stateSlug}/${countySlug}-county/${slug}`}>{name}</Link>
							</li>
						))}
					</ol>
				</div>
				<div></div>
			</div>
			<hr className="my-4"/>
			<p>
				<Link href="/add">Add Hotspot</Link>
			</p>
		</div>
	)
}
