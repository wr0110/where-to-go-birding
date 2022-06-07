import Link from "next/link";
import { getDayHikeHotspots } from "lib/firebase";
import { getState, capitalize } from "lib/helpers";
import Heading from "components/Heading";

export async function getServerSideProps({ query: { stateSlug }}) {
	const state = getState(stateSlug);
	if (!state) return { notFound: true };
	
	const hotspots = await getDayHikeHotspots(state.code) || [];

	let counties = {}
	hotspots.forEach(({countySlug, slug, name}) => {
		if (!countySlug) return;
		if (!counties[countySlug]) {
			counties[countySlug] = []
		}
		counties[countySlug].push({ name, slug });
	});

	const formattedHotspots = Object.entries(counties).map(([key, hotspots]) => ({
		countySlug: key,
		countyName: capitalize(key.replaceAll("-", " ")),
		hotspots,
	}));

  return {
    props: { stateSlug: state.slug, stateLabel: state.label, hotspots: formattedHotspots },
  }
}

export default function RoadsideBirding({ stateSlug, stateLabel, hotspots }) {
	return (
		<div className="container pb-16 mt-12">
			<Heading>Birding Day Hikes</Heading>
			<div className="md:flex gap-8 items-start mb-8">
				<div>
					<p className="mb-4">
						<strong>{stateLabel} Birding Day Hikes</strong> are designed to help birders discover places to walk and see bird life. Often when we visit a park for the first time it is a challenge to know where to start. These hikes, recommended by birders and hikers in {stateLabel}, are a way to begin to explore new territory.
Safety first
					</p>
					<p className="mb-4">
					It is sometimes said that “birding is one of the slowest forms of transportation.” Even walking a short distance while observing birds can take lots of time. There are some short hikes in this collection, but many are 2 miles or longer. Often there are options of trails to take or suggestions of ways to shorten or lengthen a hike.
					</p>
					<p className="mb-4">
						If a birder visits your county, what hike would you you suggest? Feedback is especially welcome with suggestions for improving the description of a hike. Tips for birding locations are also welcome. There is no limit to the number of hikes we can have in a county. Feel free to suggest one you like, even if we already have a hike in your county.
					</p>
				</div>
				<figure className="border p-2 bg-gray-200 text-center text-xs mb-4">
					<img src="/irwin-prairie.jpg" className="md:min-w-[200px] mx-auto" />
					<figcaption className="my-3">Irwin Prairie, Ohio<br/>Photo by Ken Ostermiller</figcaption>
				</figure>
			</div>
			<h3 className="text-lg mb-8 font-bold">Day Hikes listed by County</h3>
			<div className="columns-1 sm:columns-3 mb-12">
				{hotspots.map(({countySlug, countyName, hotspots}) => (
					<p key={countySlug} className="mb-4 break-inside-avoid">
						<Link href={`/birding-in-${stateSlug}/${countySlug}-county`}>{countyName}</Link><br/>
						{hotspots.map(({name, slug}) => (
							<>
								<Link key={slug} href={`/birding-in-${stateSlug}/${countySlug}-county/${slug}`}>
									<a className="font-bold">{name}</a>
								</Link>
								<br/>
							</>
						))}
					</p>
				))}
			</div>
		</div>
	)
}
