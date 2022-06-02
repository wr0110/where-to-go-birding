import * as React from "react";
import Address from "components/Address";
import HotspotSummary from "components/HotspotSummary";
import Map from "components/Map";
import Link from "next/link";
import { getHotspot, getHotspotByLocationId } from "lib/firebase";
import useCounty from "hooks/useCounty";
import AboutSection from "components/AboutSection";

const getParent = async (hotspotId: string) => {
	if (!hotspotId) return null;
	const data = await getHotspotByLocationId(hotspotId);
	if (!data) return null;
	const { name, about, slug } = data;
	return { name, about, slug };

}

export async function getServerSideProps({ query: { slug, countySlug }}) {
	countySlug = countySlug.replace("-county", "");
	const data = await getHotspot(countySlug, slug);
	const parent = await getParent(data.parentId);

  return {
    props: { countySlug, parent, ...data },
  }
}

export default function Hotspot({ countySlug, name, lat, lng, address, links, about, tips, restrooms, locationId, parent }) {	
	const { countyColor, countyName } = useCounty(countySlug);
	const nameParts = name?.split("--");
	const nameShort = nameParts?.length ? nameParts[1] : name;

	return (
		<div className="container pb-16">
			<h1 className="font-bold text-white text-2xl header-gradient p-3 my-16" style={{"--county-color": countyColor} as React.CSSProperties}>{name}</h1>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<div className="mb-6">
						{ name &&
							<Address line1={nameParts?.length ? nameParts[0] : name} line2={nameShort} {...address} />
						}
						{links?.map(({ url, label }, index) => (
							<a key={index} href={url} target="_blank" rel="noreferrer">{label}</a>
						))}
						{parent &&
							<p className="mt-4">
								Also, see <Link href={`/${countySlug}-county/${parent.slug}`}>{parent.name}</Link>
							</p>
						}
					</div>
					{name &&
						<HotspotSummary countySlug={countySlug} countyName={countyName} name={name} locationId={locationId} lat={lat} lng={lng} />
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
					{restrooms && <span>Restrooms on site.</span>}
				</div>
				<div>
					<img src={`/maps/${countySlug}.jpg`} width="260" className="mx-auto mb-10" alt={`${countyName} county map`} />
					{(lat && lng) && <Map lat={lat} lng={lng} />}
				</div>
			</div>
			<p className="mt-4">
				<Link href={`/edit/${locationId}`}>Edit Location</Link>
			</p>
		</div>
	)
}
