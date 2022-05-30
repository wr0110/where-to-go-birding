import * as React from "react";
import Address from "components/Address";
import HotspotSummary from "components/HotspotSummary";
import Map from "components/Map";
import Link from "next/link";
import { useRouter } from "next/router";
import { getHotspot } from "lib/firebase";
import useCounty from "hooks/useCounty";


export default function Hotspot() {
	const [data, setData] = React.useState<any>();
	const router = useRouter();
	const slug = router.query.slug as string;
	const countySlug = (router.query.countySlug as string)?.replace("-county", "");
	const { countyColor, countyName } = useCounty(countySlug);
	const { name, lat, lng, address, links, about, tips, restrooms, locationId } = data || {};

	const nameParts = name?.split("--");
	const nameShort = nameParts?.length ? nameParts[1] : name;

	React.useEffect(() => {
		const fetchData = async () => {
			const hotspotData = await getHotspot(countySlug, slug);
			setData(hotspotData);
		}
		if (countySlug && slug) fetchData();
	}, [countySlug, slug]);

	return (
		<div className="container pb-16">
			<h1 className="font-bold text-white text-2xl header-gradient p-3 my-16" style={{"--county-color": countyColor} as React.CSSProperties}>{name}</h1>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<div className="mb-6">
						{ name &&
							<Address line1={nameParts?.length ? nameParts[0] : name} line2={nameShort} {...address} />
						}
						{links?.map(({ href, title }, index) => (
							<a key={index} href={href} target="_blank" rel="noopener noreferrer">{title}</a>
						))}
					</div>
					{name &&
						<HotspotSummary countySlug={countySlug} countyName={countyName} name={name} locationId={locationId} lat={lat} lng={lng} />
					}
					{tips &&
						<div className="mb-4">
							<h3 className="font-bold">Tips for birding {nameShort}</h3>
							<p dangerouslySetInnerHTML={{__html: tips}} />
						</div>
					}
					
					{about?.text &&
						<div className="mb-4">
							<h3 className="font-bold">About {nameShort}</h3>
							<p dangerouslySetInnerHTML={{__html: about.text}} />
							<p className="text-[0.6rem] mt-1">
								{(about?.source && about?.link) &&
									<>
										From&nbsp;
										<a href={about.link} target="_blank" rel="noopener noreferrer">{about.source}</a>
									</>
								}
								{(about?.source && ! about?.link) && <span className="text-xs">From {about.source}</span>}
							</p>
						</div>
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
