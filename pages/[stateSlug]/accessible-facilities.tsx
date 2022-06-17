import * as React from "react";
import Link from "next/link";
import { getAccessibleHotspotsByState } from "lib/mongo";
import { getState } from "lib/localData";
import { restructureHotspotsByCounty } from "lib/helpers";
import { GetServerSideProps } from "next";
import { HotspotsByCounty, State } from "lib/types";
import { ParsedUrlQuery } from "querystring";
import Heading from "components/Heading";
import ListHotspotsByCounty from "components/ListHotspotsByCounty";
import Title from "components/Title";

interface Params extends ParsedUrlQuery {
	stateSlug: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { stateSlug } = query as Params;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };
	
	const hotspots = await getAccessibleHotspotsByState(state.code) || [];
	const hotspotsByCounty = restructureHotspotsByCounty(hotspots as any);

  return {
    props: { state, hotspots: hotspotsByCounty },
  }
}

type Props = {
	state: State,
	hotspots: HotspotsByCounty,
}

export default function AccessibleFacilities({ state, hotspots }: Props) {
	return (
		<div className="container pb-16 mt-12">
			<Title isOhio={state.code === "OH"}>Accessible Facilities</Title>
			<Heading state={state}>Accessible Facilities</Heading>
			<p className="mb-4">
				<strong>Below are listed, alphabetically by county, eBird hotspots which have facilities which are ADA accessible.</strong><br/>
				You can use your browser’s search function to search for the name of a location of interest.<br/>
Safety first
			</p>
			<p className="mb-4">
				Also, see <Link href={`/${state.slug}/roadside-birding`}>Roadside Birding</Link> for hotspots where you may view birds from your vehicle.
			</p>
			<h3 className="text-lg mb-8 font-bold">Accessible Facilities Listed by County</h3>
			<div className="columns-1 sm:columns-3 mb-12">
				<ListHotspotsByCounty stateSlug={state.slug} hotspots={hotspots} />
			</div>
		</div>
	)
}
