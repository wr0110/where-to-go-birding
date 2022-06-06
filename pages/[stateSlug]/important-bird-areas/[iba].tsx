import Link from "next/link";
import { getState } from "lib/helpers";
import Heading from "components/Heading";
import OhioIBA from "data/oh-iba.json";


export async function getServerSideProps({ query: { stateSlug, iba }}) {
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const data = OhioIBA.find(item => item.slug === iba);

  return {
    props: { stateLabel: state.label, stateSlug: state.slug, ...data },
  }
}

export default function ImportantBirdAreas({ name, slug, about, stateLabel, stateSlug, webpage, ebirdCode, ebirdLocations }) {
	const links = [];
	return (
		<div className="container pb-16 mt-12">
			<Heading>{name} Important Bird Area</Heading>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<p className="font-bold mb-6">
						<Link href={`/birding-in-${stateSlug}/important-bird-areas`}><a>{stateLabel} Important Bird Areas</a></Link>
					</p>
					<p>
						<strong>{name}</strong>
						<br />
						<strong>Important Bird Area</strong>
						<br />
						<a href={webpage} target="_blank" rel="noreferrer">{name} Important Bird Area webpage</a>
					</p>
					<div className="mb-6">
						{links?.map(({ url, label }, index) => (
							<a key={index} href={url} target="_blank" rel="noreferrer">{label}</a>
						))}
					</div>
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
