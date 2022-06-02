import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import EbirdTable from "components/EbirdTable";

export default function County() {
	const router = useRouter();
	const { stateSlug } = router.query;
	const state = (router.query.stateSlug as string)?.replace("birding-in-", "");
	const stateCode = "OH";
	const rareSid = "SN35533";
	const needsSid = "SN10379";
	const yearNeedsSid = "SN33836";

	return (
		<div className="container pb-16 mt-12">
			<h1 className="text-3xl mb-4">Birding in {state}</h1>
			<h3 className="text-lg mb-4 font-bold">Where to Go Birding in {state}</h3>
			<p className="mb-4">
				<a href="#counties">Alphabetical list of {state} Counties</a><br/>
				<Link href={`/${stateSlug}/alphabetical-index`}>{`Alphabetical list of ${state} Hotspots`}</Link><br/>
				<a href="#top-locations">Top Birding Locations in {state}</a><br/>
				<a href="#notable">{state} Notable Bird Sightings</a>
			</p>
			<h3 className="text-lg mb-2 font-bold">Explore {state} in eBird</h3>
			<EbirdTable heading={`${state} Statewide Bar Charts`} stateCode={stateCode} />
			<h4 className="font-bold">eBird Links</h4>
			<p className="mb-4">
				<a href={`https://ebird.org/ebird/subnational1/US-${stateCode}?yr=all&amp;m=&amp;rank=mrec`} target="_blank" rel="noreferrer">Overview</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/subnational1/US-${stateCode}/regions?yr=all&amp;m=&amp;hsStats_sortBy=num_species&amp;hsStats_o=desc`} target="_blank" rel="noreferrer">Counties</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/subnational1/US-${stateCode}/hotspots?yr=all&amp;m=`} target="_blank" rel="noreferrer">Hotspots</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/subnational1/US-${stateCode}/activity?yr=all&amp;m=`} target="_blank" rel="noreferrer">Recent Visits</a><br/>
				<a href={`https://ebird.org/alert/summary?sid=${rareSid}`}>eBird Rare Bird Alert for {state}</a>
			</p>
			<h4 className="font-bold">Top {state} eBirders</h4>
			<p  className="mb-4">
				<a href={`https://ebird.org/ebird/top100?locInfo.regionType=subnational1&amp;locInfo.regionCode=US-${stateCode}&amp;year=AAAA`} target="_blank" rel="noreferrer">All Time</a>
			</p>
			<h4 className="font-bold">My eBird {state} links</h4>
			<p className="mb-4">
				<a href={`https://ebird.org/ebird/MyEBird?cmd=list&amp;rtype=subnational1&amp;r=US-${stateCode}&amp;time=life&amp;sortKey=obs_dt&amp;o=desc`} target="_blank" rel="noreferrer" >Life List</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/MyEBird?cmd=lifeList&amp;listType=US-${stateCode}&amp;listCategory=allStates&amp;time=year`} target="_blank" rel="noreferrer">Year List</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/ebird/MyEBird?cmd=lifeList&amp;listType=US-${stateCode}&amp;listCategory=allStates&amp;time=month`} target="_blank" rel="noreferrer">Month List</a>
			</p>
			<h4 className="font-bold">Needs Alert (birds you have not seen in {state})</h4>
			<p className="mb-4">
				<a href={`https://ebird.org/alert/summary?sid=${needsSid}`} rel="noreferrer" target="_blank">Never Seen</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/alert/summary?sid=${yearNeedsSid}`}  rel="noreferrer" target="_blank">Not Seen This Year</a>
			</p>
		</div>
	)
}
