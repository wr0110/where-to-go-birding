import Link from "next/link";
import EbirdStateSummary from "components/EbirdStateSummary";
import OhioMap from "components/OhioMap";
import ArizonaMap from "components/ArizonaMap";
import OhioCounties from "data/oh-counties.json";
import ArizonaCounties from "data/az-counties.json";
import { getState, formatCountyArray } from "lib/helpers";
import EbirdDescription from "components/EbirdDescription";
import EbirdHelpLinks from "components/EbirdHelpLinks";
import States from "data/states.json";

export async function getStaticPaths() {
	const paths = States.filter(({active}) => active).map(({slug}) => ({ params: { stateSlug: slug } }));
  return { paths, fallback: true }
}

export async function getStaticProps({ params: { stateSlug }}) {
	const countyArrays = {
		"OH": OhioCounties,
		"AZ": ArizonaCounties,
	}

	const state = getState(stateSlug);
	if (!state) return { notFound: true };
	const counties = formatCountyArray(countyArrays[state.code]) || [];

  return {
    props: { counties, ...state},
  }
}

export default function State({label, code, slug, rareSid, needsSid, yearNeedsSid, links, counties}) {
	const maps = {
		"OH": <OhioMap />,
		"AZ": <ArizonaMap />,
	}

	const map = maps[code];

	return (
		<div className="container pb-16 mt-12">
			<h1 className="text-3xl mb-4">Birding in {label}</h1>
			<div className="lg:grid grid-cols-2 gap-16">
				<div>
					<h3 className="text-lg mb-4 font-bold">Where to Go Birding in {label}</h3>
					<p className="mb-4">
						<a href="#counties">Alphabetical list of {label} Counties</a><br/>
						<Link href={`/birding-in-${slug}/alphabetical-index`}>{`Alphabetical list of ${label} Hotspots`}</Link><br/>
						<a href="#top-locations">Top Birding Locations in {label}</a><br/>
						<a href="#notable">{label} Notable Bird Sightings</a>
					</p>
					<h3 className="text-lg mb-2 font-bold">Explore {label} in eBird</h3>
					<EbirdStateSummary code={code} rareSid={rareSid} needsSid={needsSid} yearNeedsSid={yearNeedsSid} />					
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
						<>
							<h3 className="text-lg mb-4 font-bold">{section}</h3>
							<p className="mb-4">
								{links.map(({label, url}) => (
									<>
										<a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>
										<br />
										</>
									))}
							</p>
						</>
					))}
				</div>
			</div>
		</div>
	)
}
