import Link from "next/link";
import { getAccessibleHotspots } from "lib/firebase";
import { getState, capitalize } from "lib/helpers";

export async function getServerSideProps({ query: { stateSlug }}) {
	const state = getState(stateSlug);
	if (!state) return { notFound: true };
	
	const hotspots = await getAccessibleHotspots(state.code) || [];
	console.log(hotspots);

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
    props: { stateSlug: state.slug, hotspots: formattedHotspots },
  }
}

export default function AccessibleFacilities({ stateSlug, hotspots }) {
	return (
		<div className="container pb-16 mt-12">
			<h1 className="text-3xl mb-12">Accessible Facilities</h1>
			<p className="mb-4">
				<strong>Below are listed, alphabetically by county, eBird hotspots which have facilities which are ADA accessible.</strong><br/>
				You can use your browser’s search function to search for the name of a location of interest.<br/>
Safety first
			</p>
			<p className="mb-4">
				Also, see <Link href={`/${stateSlug}/roadside-birding`}>Roadside Birding</Link> for hotspots where you may view birds from your vehicle.
			</p>
			<h3 className="text-lg mb-8 font-bold">Accessible Facilities Listed by County</h3>
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
