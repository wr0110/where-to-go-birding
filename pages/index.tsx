import Link from "next/link";
import States from "data/states.json";
import EbirdDescription from "components/EbirdDescription";
import Heading from "components/Heading";
import Title from "components/Title";

export default function Home() {
	return (
		<div className="container pb-16 mt-12">
			<Title/>
			<Heading breadcrumbs={false}>Welcome to eBird Hotspots</Heading>
			<h3 className="text-lg mb-4 font-bold">United States</h3>
			<p className="mb-4">Links in plain text are to pages in the eBird website. Links in <strong>bold text</strong> are to pages in this website with additional information about hotspots.</p>
			<div className="columns-2 xs:columns-3 sm:columns-5 mb-12">
				{States.map(({label, slug, code, active}) => (
					<p key={code}>
						{active ? (
							<Link href={`/birding-in-${slug}`}><a className="font-bold">{label}</a></Link>
						) : (
							<a href={`https://ebird.org/region/US-${code}/regions?yr=all&m=`} target="_blank" rel="noreferrer">{label}</a>
						)}
					</p>
				))}
			</div>
			<div className="sm:grid grid-cols-2 gap-16">
				<div>
					<p className="mb-4">This website collects tips for birding from local birders and descriptions and maps of eBird hotspots from eBird and other websites. In eBird, hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots provide birders with information about birding locations where birds are being seen.</p>
					<p className="mb-4">Ken Ostermiller, a volunteer hotspot reviewer for eBird, created and manages the website.</p>
					<EbirdDescription />
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
