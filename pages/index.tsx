import * as React from "react";
import Link from "next/link";
import EbirdLogo from "components/EbirdLogo";
import States from "data/states.json";

export default function Home() {
	return (
		<div className="container pb-16 mt-12">
			<h2 className="text-2xl mb-4 font-bold">Welcome to eBird Hotspots</h2>
			<h3 className="text-lg mb-4 font-bold">United States</h3>
			<p className="mb-4">Links in plain text are to pages in the eBird website. Links in <strong>bold text</strong> are to pages in this website with additional information about hotspots.</p>
			<div className="columns-5 mb-12">
				{States.map(({label, slug, ebirdCode, active}) => (
					<p key={ebirdCode}>
						{active ? (
							<Link href={`/birding-in-${slug}`}><a className="font-bold">{label}</a></Link>
						) : (
							<a href={`https://ebird.org/region/${ebirdCode}/regions?yr=all&m=`} target="_blank" rel="noreferrer">{label}</a>
						)}
					</p>
				))}
			</div>
			<div className="sm:grid grid-cols-2 gap-16">
				<div>
					<p className="mb-4">This website collects tips for birding from local birders and descriptions and maps of eBird hotspots from eBird and other websites. In eBird, hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots provide birders with information about birding locations where birds are being seen.</p>
					<p className="mb-4">Ken Ostermiller, a volunteer hotspot reviewer for eBird, created and manages the website.</p>
					<p className="mb-4">
						<a href="https://ebird.org" target="_blank" rel="noreferrer">
							<EbirdLogo className="border p-4 w-[125px] h-[125px] float-right ml-4 mt-2 mb-4" />
						</a>
						<a href="https://ebird.org" target="_blank" rel="noreferrer">eBird</a> is a real-time, online checklist program that has revolutionized the way that the birding community reports and accesses information about birds. Jointly sponsored by the Laboratory of Ornithology at Cornell University and the National Audubon Society, eBird provides rich data sources for basic information on bird abundance and distribution.
					</p>
					<h3 className="text-lg font-bold mb-4">eBird can help you</h3>
					<p className="mb-4">+ Record the birds you see+ Keep track of your bird lists<br/>+ Explore dynamic maps and graphs<br/>+ Share your sightings and join the eBird community<br/>+ Contribute to science and conservation</p>
				</div>
				<div>
					<p className="mb-4">In eBird, Hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots provide birders with information about birding locations where birds are being seen.</p>
					<h3 className="text-lg font-bold mb-4">Links to eBird website</h3>
					<p className="mb-4">
						<a href="https://birding-in-ohio.com/about-ebird" target="_blank" rel="noreferrer">About eBird</a><br/>
						<a href="https://ebird.org/hotspots" target="_blank" rel="noreferrer">eBird Hotspot Explorer</a><br/>
						<a href="https://support.ebird.org/en/support/home" target="_blank" rel="noreferrer">eBird Help Documents</a><br/>
						<a href="https://confluence.cornell.edu/display/CLOISAPI/eBird-1.1-HotSpotsByRegion" target="_blank" rel="noreferrer">Lists of all eBird Hotspots worldwide</a><br/>
						<a href="https://www.facebook.com/ebird/" target="_blank" rel="noreferrer">eBird Facebook page</a>
					</p>
					<h3 className="text-lg font-bold mb-4">Links to eBird website</h3>
					<p className="mb-4">
						<a href="https://birding-in-ohio.com/change-location-of-a-checklist/" target="_blank" rel="noreferrer">How to change the location of a checklist</a><br/>
						<a href="https://birding-in-ohio.com/merge-personal-location-with-a-hotspot/" target="_blank" rel="noreferrer">How to merge a personal location with an eBird Hotspot</a><br/>
						<a href="https://support.ebird.org/support/solutions/articles/48000625567-checklist-sharing-and-group-accounts" target="_blank" rel="noreferrer">How to share a checklist with other birders</a><br/>
						<a href="https://birding-in-ohio.com/suggest-personal-location-as-a-hotspot/" target="_blank" rel="noreferrer">How to suggest a personal location as a new eBird Hotspot</a><br/>
						<a href="https://birding-in-ohio.com/life-list-personal-location/">How to get a “life list” of bird species at a personal location</a>
					</p>
				</div>
			</div>
		</div>
	)
}
