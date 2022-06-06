import * as React from "react";
import Link from "next/link";
import { getHotspots } from "lib/firebase";
import { getCounty, getState } from "lib/helpers";
import Map from "components/Map";
import Heading from "components/Heading";

export async function getServerSideProps({ query: { stateSlug, countySlug }}) {
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const county = getCounty(state.code, countySlug);
	if (!county) return { notFound: true };
	
	const hotspots = await getHotspots(county.slug) || [];
  return {
    props: { stateSlug: state.slug, stateLabel: state.label, countySlug: county.slug, hotspots, ...county },
  }
}

export default function County({ stateSlug, stateLabel, countySlug, hotspots, name, color }) {
	const links = [];
	return (
		<div className="container pb-16">
			<Heading color={color}>{name}</Heading>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<div className="mb-6">
						{links?.map(({ url, label }, index) => (
							<a key={index} href={url} target="_blank" rel="noreferrer">{label}</a>
						))}
					</div>
					<ol>
						{hotspots?.map(({ name, slug }) => (
							<li key={slug}>
								<Link href={`/birding-in-${stateSlug}/${countySlug}-county/${slug}`}>{name}</Link>
							</li>
						))}
					</ol>
				</div>
				<div>
					<Map address={`${name} County, ${stateLabel}`} zoom={null} type="roadmap" />
				</div>
			</div>
			<hr className="my-4"/>
			<p>
				<Link href="/add">Add Hotspot</Link>
			</p>
		</div>
	)
}
