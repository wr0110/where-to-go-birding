import * as React from "react";
import Link from "next/link";
import { getRoadsideHotspotsByState } from "lib/mongo";
import { restructureHotspotsByCounty } from "lib/helpers";
import { getState } from "lib/localData";
import Heading from "components/Heading";
import { GetServerSideProps } from "next";
import { HotspotsByCounty } from "lib/types";

type Props = {
	stateSlug: string,
	stateLabel: string,
	hotspots: HotspotsByCounty,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const stateSlug = query.stateSlug as string;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };
	
	const hotspots = await getRoadsideHotspotsByState(state.code) || [];
	const hotspotsByCounty = restructureHotspotsByCounty(hotspots as any);

  return {
    props: { stateSlug: state.slug, hotspots: hotspotsByCounty },
  }
}

export default function RoadsideBirding({ stateSlug, hotspots }: Props) {
	return (
		<div className="container pb-16 mt-12">
			<Heading>Roadside Birding</Heading>
			<div className="md:flex gap-8 items-start mb-8">
				<figure className="border p-2 bg-gray-200 text-center text-xs mb-4">
					<img src="/riddle-rd.jpg" className="md:min-w-[400px] mx-auto" />
					<figcaption className="my-3">Riddle Road, Sandusky County, Ohio<br/>Photo by Ken Ostermiller</figcaption>
				</figure>
				<div>
					<p className="mb-4">
						<strong>Birding from your vehicle</strong><br/>
						There are many locations, especially in rural counties, where you can view birds from your vehicle. Rural roads through agricultural lands, state forests and wildlife areas, “skypools” that form after a rain, airport runways near public roads, cemeteries, all are examples of places you can do roadside birding.
Safety first
					</p>
					<p className="mb-4">
						<strong>Safety first</strong><br/>
						Please use care when birding these locations. When you stop, pull off as far as you are able. Use flashers when there is traffic. If you park to get out of your vehicle, park at a pull off or on the berm completely off the pavement. Many of these locations are on roads that traverse privately owned land. Do not enter a private property without permission.
					</p>
					<p className="mb-4">
						Also, see the list of hotspot locations which have <Link href={`/birding-in-${stateSlug}/accessible-facilities`}>handicap accessible facilities</Link>.
					</p>
				</div>
			</div>
			<h3 className="text-lg mb-8 font-bold">Roadside Birding Locations Listed by County</h3>
			<div className="columns-1 sm:columns-3 mb-12">
				{hotspots.map(({countySlug, countyName, hotspots}) => (
					<p key={countySlug} className="mb-4 break-inside-avoid">
						<Link href={`/birding-in-${stateSlug}/${countySlug}-county`}>{countyName}</Link><br/>
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
			</div>
		</div>
	)
}
