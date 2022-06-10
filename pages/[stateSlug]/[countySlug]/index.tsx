import Link from "next/link";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getHotspots } from "lib/firebase";
import { getState, getCounty } from "lib/localData";
import Map from "components/Map";
import Heading from "components/Heading";
import { State, Hotspot, County as CountyType } from "lib/types";
import EbirdCountySummary from "components/EbirdCountySummary";
import HotspotList from "components/HotspotList";

interface Params extends ParsedUrlQuery {
	stateSlug: string,
	countySlug: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { stateSlug, countySlug } = query as Params;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const county = getCounty(state.code, countySlug);
	if (!county?.name) return { notFound: true };
	
	const hotspots = await getHotspots(county.slug) || [];
  return {
    props: { state, hotspots, ...county },
  }
}

interface Props extends CountyType {
	state: State,
	hotspots: Hotspot[],
}

export default function County({ state, slug, hotspots, name, ebirdCode, color }: Props) {
	const hikes = hotspots.filter(({ dayhike }) => dayhike === "Yes");
	const hotspotIBA = hotspots.filter(({ iba }) => iba?.value).map(({ iba }) => iba);

	//Removes duplicate objects from IBA array
	const iba = hotspotIBA.filter((elem, index, self) => self.findIndex((t) => {
		return (t?.value === elem?.value && t?.label === elem?.label)
	}) === index);

	return (
		<div className="container pb-16">
			<Heading color={color}>{name}</Heading>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<h3 className="text-lg mb-2 font-bold">Where to Go Birding in {name} County</h3>
					<p className="mb-4">
						<a href="#hotspots">Alphabetical list of Hotspots</a><br/>
						<a href="#dayhikes">Birding Day Hikes</a><br/>
					</p>
					<h3 className="text-lg mb-2 font-bold">Explore {name} County in eBird</h3>
					<EbirdCountySummary label={name} code={`US-${state.code}-${ebirdCode}`} />
					<h3 className="text-lg mb-2 font-bold" id="hotspots">All Hotspots in {name} County</h3>
					<HotspotList stateSlug={state.slug} countySlug={slug} hotspots={hotspots} />
				</div>
				<div>
					{state.code === "OH" &&
						<img src={`/oh-maps/${slug}.jpg`} width="260" className="mx-auto mb-10" alt={`${name} county map`} />
					}
					<Map address={`${name} County, ${state.label}`} zoom={null} type="roadmap" />
					{hikes.length > 0 && (
						<>
							<h3 className="text-lg mb-2 font-bold mt-6" id="dayhikes">Birding Day Hikes</h3>
							<HotspotList stateSlug={state.slug} countySlug={slug} hotspots={hikes} />
						</>
					)}
					{iba.length > 0 && (
						<>
							<h3 className="text-lg mb-2 font-bold mt-6" id="dayhikes">Important Bird Areas</h3>
							<ul>
								{iba?.map(({ label, value }: any) => (
									<li key={value}>
										<Link href={`/birding-in-${state.slug}/important-bird-areas/${value}`}>{label}</Link>
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
