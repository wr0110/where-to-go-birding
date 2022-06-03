import Link from "next/link";
import EbirdTable from "components/EbirdTable";
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
					<EbirdTable heading={`${label} Statewide Bar Charts`} stateCode={code} />
					<h4 className="font-bold">eBird Links</h4>
					<p className="mb-4">
						<a href={`https://ebird.org/ebird/subnational1/US-${code}?yr=all&amp;m=&amp;rank=mrec`} target="_blank" rel="noreferrer">Overview</a>
						&nbsp;–&nbsp;
						<a href={`https://ebird.org/ebird/subnational1/US-${code}/regions?yr=all&amp;m=&amp;hsStats_sortBy=num_species&amp;hsStats_o=desc`} target="_blank" rel="noreferrer">Counties</a>
						&nbsp;–&nbsp;
						<a href={`https://ebird.org/ebird/subnational1/US-${code}/hotspots?yr=all&amp;m=`} target="_blank" rel="noreferrer">Hotspots</a>
						&nbsp;–&nbsp;
						<a href={`https://ebird.org/ebird/subnational1/US-${code}/activity?yr=all&amp;m=`} target="_blank" rel="noreferrer">Recent Visits</a><br/>
						<a href={`https://ebird.org/alert/summary?sid=${rareSid}`}>eBird Rare Bird Alert for {label}</a>
					</p>
					<h4 className="font-bold">Top {label} eBirders</h4>
					<p  className="mb-4">
						<a href={`https://ebird.org/ebird/top100?locInfo.regionType=subnational1&amp;locInfo.regionCode=US-${code}&amp;year=AAAA`} target="_blank" rel="noreferrer">All Time</a>
					</p>
					<h4 className="font-bold">My eBird {label} links</h4>
					<p className="mb-4">
						<a href={`https://ebird.org/ebird/MyEBird?cmd=list&amp;rtype=subnational1&amp;r=US-${code}&amp;time=life&amp;sortKey=obs_dt&amp;o=desc`} target="_blank" rel="noreferrer" >Life List</a>
						&nbsp;–&nbsp;
						<a href={`https://ebird.org/ebird/MyEBird?cmd=lifeList&amp;listType=US-${code}&amp;listCategory=allStates&amp;time=year`} target="_blank" rel="noreferrer">Year List</a>
						&nbsp;–&nbsp;
						<a href={`https://ebird.org/ebird/MyEBird?cmd=lifeList&amp;listType=US-${code}&amp;listCategory=allStates&amp;time=month`} target="_blank" rel="noreferrer">Month List</a>
					</p>
					<h4 className="font-bold">Needs Alert (birds you have not seen in {label})</h4>
					<p className="mb-4">
						<a href={`https://ebird.org/alert/summary?sid=${needsSid}`} rel="noreferrer" target="_blank">Never Seen</a>
						&nbsp;–&nbsp;
						<a href={`https://ebird.org/alert/summary?sid=${yearNeedsSid}`}  rel="noreferrer" target="_blank">Not Seen This Year</a>
					</p>
				</div>
				<div className="flex justify-center items-start">
					{map}
				</div>
			</div>
			<h3 id="counties" className="text-lg mb-4 font-bold">{label} Counties</h3>
			<div className="columns-3 sm:columns-4 lg:columns-6 mb-12">
				{counties?.map(({name, slug, ebirdCode, active}) => (
					<p key={name}>
						{active ? (
							<Link href={`/birding-in-${slug}`}><a className="font-bold">{name}</a></Link>
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
