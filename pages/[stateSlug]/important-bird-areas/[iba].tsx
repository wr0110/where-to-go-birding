import Link from "next/link";
import { getState } from "lib/localData";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Heading from "components/Heading";
import OhioIBA from "data/oh-iba.json";
import { State, IBA } from "lib/types";

interface Params extends ParsedUrlQuery {
	stateSlug: string,
	iba: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { stateSlug, iba } = query as Params;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const data = OhioIBA.find(item => item.slug === iba);

  return {
    props: { state, ...data },
  }
}

interface Props extends IBA {
	state: State,
}

export default function ImportantBirdAreas({ state, name, slug, about, webpage, ebirdCode, ebirdLocations }: Props) {
	return (
		<div className="container pb-16 mt-12">
			<Heading>{name} Important Bird Area</Heading>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<p className="font-bold mb-6">
						<Link href={`/birding-in-${state?.slug}/important-bird-areas`}><a>{state?.label} Important Bird Areas</a></Link>
					</p>
					<p>
						<strong>{name}</strong>
						<br />
						<strong>Important Bird Area</strong>
						<br />
						<a href={webpage} target="_blank" rel="noreferrer">{name} Important Bird Area webpage</a>
					</p>
				</div>
				<div>
					<img src={`/iba/${slug}.jpg`} className="w-full mb-6" />
					<h3 className="font-bold">About {name} Important Bird Area</h3>
					<div dangerouslySetInnerHTML={{__html: about}} />
					<p className="text-[0.6rem] mt-1">
						From <a href={webpage} target="_blank" rel="noopener noreferrer">{name} Important Bird Area webpage</a>
					</p>
				</div>
			</div>
		</div>
	)
}
