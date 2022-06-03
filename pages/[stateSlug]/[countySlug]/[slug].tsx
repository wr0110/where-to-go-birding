import * as React from "react";
import Address from "components/Address";
import HotspotSummary from "components/HotspotSummary";
import Map from "components/Map";
import Link from "next/link";
import { getHotspot, getHotspotByLocationId } from "lib/firebase";
import AboutSection from "components/AboutSection";
import { getCounty, getState } from "lib/helpers";

const getParent = async (hotspotId: string) => {
	if (!hotspotId) return null;
	const data = await getHotspotByLocationId(hotspotId);
	if (!data) return null;
	const { name, about, slug } = data;
	return { name, about, slug };

}

export async function getServerSideProps({ query: { stateSlug, countySlug, slug }}) {
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const county = getCounty(state.code, countySlug);
	if (!county) return { notFound: true };

	const data = await getHotspot(county.slug, slug);
	if (!data) return { notFound: true };
	const parent = await getParent(data.parentId);

  return {
    props: { stateSlug: state.slug, county, parent, ...data },
  }
}

export default function Hotspot({ stateSlug,county, name, lat, lng, address, links, about, tips, restrooms, roadside, accessible, locationId, parent }) {	
	const nameParts = name?.split("--");
	const nameShort = nameParts?.length ? nameParts[1] : name;

	let extraLinks = [];
	if (roadside === "Yes") {
		extraLinks.push({
			label: "Roadside Birding",
			url: `/birding-in-${stateSlug}/roadside-birding`
		});
	}
	if (parent) {
		extraLinks.push({
			label: parent.name,
			url: `/birding-in-${stateSlug}/${county.slug}-county/${parent.slug}`
		});
	}

	return (
		<div className="container pb-16">
			<h1 className="font-bold text-white text-2xl header-gradient p-3 my-16" style={{"--county-color": county.color} as React.CSSProperties}>{name}</h1>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<div className="mb-6">
						{ name &&
							<Address line1={nameParts?.length ? nameParts[0] : name} line2={nameShort} {...address} />
						}
						{links?.map(({ url, label }, index) => (
							<a key={index} href={url} target="_blank" rel="noreferrer">{label}</a>
						))}
						{extraLinks.length > 0 &&
							<p className="mt-4">
								Also, see:<br />
								{extraLinks?.map(({ url, label }) => <Link href={url} key={label}>{label}</Link>)}
							</p>
						}
					</div>
					{name &&
						<HotspotSummary stateSlug={stateSlug} countySlug={county.slug} countyName={county.name} name={name} locationId={locationId} lat={lat} lng={lng} />
					}
					{tips?.text &&
						<AboutSection heading={`Tips for birding ${nameShort}`} {...tips} />
					}
					
					{about?.text &&
						<AboutSection heading={`Tips for birding ${nameShort}`} {...about} />
					}

					{(parent?.about?.text && parent?.name) &&
						<AboutSection heading={`Tips for birding ${parent.name}`} {...parent.about} />
					}
					<div className="space-y-1">
						{restrooms === "Yes" && <p>Restrooms on site.</p>}
						{restrooms === "No" && <p>No restrooms on site.</p>}
						{accessible === "ADA" && <p>ADA accessible facilities on site.</p>}
						{accessible === "Birdability" && (
							<p>Accessible facilities on site, listed as a <a href="https://www.birdability.org/" target="_blank" rel="noreferrer">Birdability</a> location.</p>
						)}
						{roadside === "Yes" && <p>Roadside accessible.</p>}
					</div>
				</div>
				<div>
					{stateSlug === "ohio" && <img src={`/oh-maps/${county.slug}.jpg`} width="260" className="mx-auto mb-10" alt={`${county.name} county map`} />}
					{(lat && lng) && <Map lat={lat} lng={lng} />}
				</div>
			</div>
			<p className="mt-4">
				<Link href={`/edit/${locationId}`}>Edit Location</Link>
			</p>
		</div>
	)
}
