import * as React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import EbirdStateSummary from "components/EbirdStateSummary";
import OhioMap from "components/OhioMap";
import ArizonaMap from "components/ArizonaMap";
import { getState, getCounties, getStateLinks } from "lib/localData";
import EbirdDescription from "components/EbirdDescription";
import EbirdHelpLinks from "components/EbirdHelpLinks";
import StateFeatureLinks from "components/StateFeatureLinks";
import RareBirds from "components/RareBirds";
import States from "data/states.json";
import { StateLinks, State as StateType, County as CountyType } from "lib/types";
import Heading from "components/Heading";
import EditorActions from "components/EditorActions";

interface Params extends ParsedUrlQuery {
	stateSlug: string,
}

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = States.filter(({active}) => active).map(({slug}) => ({ params: { stateSlug: slug } }));
  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
	const { stateSlug } = params as Params;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };
	const counties = getCounties(state.code);
	const links = getStateLinks(state.code);

  return { props: { counties, links, ...state }, }
}

interface Props extends StateType {
	counties: CountyType[],
	links: StateLinks,
}

export default function State({label, code, slug, features, rareSid, needsSid, yearNeedsSid, links, portal, counties}: Props) {
	const maps: any = {
		"OH": <OhioMap />,
		"AZ": <ArizonaMap />,
	}

	const map = maps[code];

	return (
		<div className="container pb-16 mt-12">
			<Heading>
				Welcome to Birding in {label}
				{code === "OH" && <><br/><span className="text-sm">From the Ohio Ornithological Society</span></>}
			</Heading>
			<div className="lg:grid grid-cols-2 gap-16">
				<div>
					<h3 className="text-lg mb-4 font-bold">Where to Go Birding in {label}</h3>
					<p className="mb-4">
						<a href="#counties">Alphabetical list of {label} Counties</a><br/>
						<Link href={`/birding-in-${slug}/alphabetical-index`}>{`Alphabetical list of ${label} Hotspots`}</Link><br/>
						<a href="#top-locations">Top Birding Locations in {label}</a><br/>
						<a href="#notable">{label} Notable Bird Sightings</a>
					</p>
					{features?.length > 0 &&
						<StateFeatureLinks slug={slug} features={features} />
					}
					<EbirdStateSummary
						label={label}
						code={`US-${code}`}
						rareSid={rareSid}
						needsSid={needsSid}
						yearNeedsSid={yearNeedsSid}
						portal={portal}
					/>
				</div>
				<div className="flex justify-center items-start">
					{map}
				</div>
			</div>
			<h3 id="counties" className="text-lg mb-4 font-bold">{label} Counties</h3>
			<div className="columns-3 sm:columns-4 lg:columns-6 mb-12">
				{counties?.map(({name, slug: countySlug, ebirdCode, active}) => (
					<p key={name}>
						{active ? (
							<Link href={`/birding-in-${slug}/${countySlug}-county`}><a className="font-bold">{name}</a></Link>
						) : (
							<a href={`https://ebird.org/region/US-${code}-${ebirdCode}?yr=all`} target="_blank" rel="noreferrer">{name}</a>
						)}
					</p>
				))}
			</div>
			<div className="md:grid grid-cols-2 gap-16">
				<div>
					<EbirdDescription />
					<h3 className="text-lg mb-4 font-bold">Finding Birding Locations in {label}</h3>
					<p className="mb-4">
						This website provides descriptions and maps of eBird Hotspots in {label}. In eBird, Hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots provide birders with information about birding locations where birds are being seen.
					</p>

					<p className="mb-4">
						Hotspots are organized by county. If you know the county of a location, click on the county name in the <a href="#counties">Alphabetical list of {label} Counties</a> to access information about birds and all the eBird hotspots in that county.
					</p>

					<p className="mb-4">
						If you do not know the county, select a hotspot from the Alphabetical list of {label} Hotspots.
	Or use the “magnifying glass” search icon on the upper right to find a hotspot. Enter all or part of a hotspot name.
					</p>
				</div>
				<div>
					<EbirdHelpLinks />
					{links?.map(({section, links}) => (
						<React.Fragment key={section}>
							<h3 className="text-lg mb-4 font-bold">{section}</h3>
							<p className="mb-4">
								{links.map(({label, url}) => (
										<React.Fragment key={label}>
										<a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>
										<br />
										</React.Fragment>
									))}
							</p>
						</React.Fragment>
					))}
				</div>
			</div>
			<RareBirds region={`US-${code}`} label={label} />
			<EditorActions>
				<Link href="/add">Add Hotspot</Link>
				<Link href={`/edit/group/new?state=${code}`}>Add Group Hotspot</Link>
			</EditorActions>
		</div>
	)
}
