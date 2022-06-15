import Link from "next/link";
import { getState } from "lib/localData";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Heading from "components/Heading";
import OhioIBA from "data/oh-iba.json";
import { State, IBA, HotspotsByCounty } from "lib/types";
import { getIBAHotspots } from "lib/mongo";
import { restructureHotspotsByCounty } from "lib/helpers";
import ListHotspotsByCounty from "components/ListHotspotsByCounty";
import EbirdBarcharts from "components/EbirdBarcharts";


interface Params extends ParsedUrlQuery {
	stateSlug: string,
	iba: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { stateSlug, iba } = query as Params;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const hotspots = await getIBAHotspots(iba) || [];
	const hotspotsByCounty = restructureHotspotsByCounty(hotspots as any);

	const data = OhioIBA.find(item => item.slug === iba);

	const locationIds = data?.ebirdCode ? [] : hotspots.map(item => item.locationId);

  return {
    props: { state, hotspots: hotspotsByCounty, locationIds, ...data },
  }
}

interface Props extends IBA {
	state: State,
	locationIds: string[],
	hotspots: HotspotsByCounty,
}

export default function ImportantBirdAreas({ state, name, slug, about, webpage, hotspots, ebirdCode, locationIds }: Props) {
	const region = ebirdCode || locationIds.join(",");
	return (
		<div className="container pb-16 mt-12">
			<Heading>{name} Important Bird Area</Heading>
			<div className="md:grid grid-cols-2 gap-12">
				<div>
					<p className="font-bold mb-6">
						<Link href={`/birding-in-${state?.slug}/important-bird-areas`}><a>{state?.label} Important Bird Areas</a></Link>
					</p>
					<p className="mb-6">
						<h3 className="font-bold text-lg">{name}<br/>Important Bird Area</h3>
						<a href={webpage} target="_blank" rel="noreferrer">{name} Important Bird Area webpage</a>
					</p>
					<EbirdBarcharts region={region} />
					<h3 className="font-bold mb-4 text-lg">Locations</h3>
					<ListHotspotsByCounty stateSlug={state?.slug} hotspots={hotspots} />
				</div>
				<div>
					<img src={`/iba/${slug}.jpg`} className="w-full mb-6" />
					<h3 className="font-bold">About {name} Important Bird Area</h3>
					<div className="formatted" dangerouslySetInnerHTML={{__html: about}} />
					<p className="text-[0.6rem] mt-1">
						From <a href={webpage} target="_blank" rel="noopener noreferrer">{name} Important Bird Area webpage</a>
					</p>
				</div>
			</div>
		</div>
	)
}
