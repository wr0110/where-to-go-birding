import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Address from "components/Address";
import EbirdHotspotSummary from "components/EbirdHotspotSummary";
import Map from "components/Map";
import Link from "next/link";
import { getGroupBySlug, getChildHotspots } from "lib/mongo";
import AboutSection from "components/AboutSection";
import { getCountyBySlug, getState } from "lib/localData";
import { County, Hotspot as HotspotType } from "lib/types";
import EditorActions from "components/EditorActions";
import HotspotList from "components/HotspotList";
import Heading from "components/Heading";

const getChildren = async (locationId: string) => {
	if (!locationId) return null;
	const data = await getChildHotspots(locationId);
	return data || [];
}

interface Params extends ParsedUrlQuery {
	stateSlug: string,
	slug: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { stateSlug, slug } = query as Params;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };

	const data = await getGroupBySlug(`US-${state.code}`, slug);
	if (!data) return { notFound: true };

	const childLocations = await getChildren(data._id);
	const childIds = childLocations?.map(item => item.locationId) || [];

  return {
    props: { stateSlug: state.slug, childLocations, childIds, ...data },
  }
}

interface Props extends HotspotType {
	stateSlug: string,
	childLocations: HotspotType[],
	childIds: string[],
}

export default function GroupHotspot({ stateSlug, _id, name, links, about, restrooms, roadside, accessible, childLocations, multiCounties, childIds }: Props) {	
	const nameParts = name?.split("--");
	const nameShort = nameParts?.length === 2 ? nameParts[1] : name;

	let extraLinks = [];
	if (roadside === "Yes") {
		extraLinks.push({
			label: "Roadside Birding",
			url: `/birding-in-${stateSlug}/roadside-birding`
		});
	}

	return (
		<div className="container pb-16">
			<Heading>{name}</Heading>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<div className="mb-6">
						{links?.map(({ url, label }, index) => (
							<a key={index} href={url} target="_blank" rel="noreferrer">{label}</a>
						))}
						{extraLinks.length > 0 &&
							<p className="mt-4">
								Also, see:<br />
								{extraLinks?.map(({ url, label }) => (
									<React.Fragment key={label}>
										<Link href={url}>{label}</Link>
										<br />
									</React.Fragment>
								))}
							</p>
						}
					</div>

					{childLocations.length > 0 && 
						<div className="mb-6">
							<h3 className="mb-4 font-bold">Sub-locations</h3>
							<HotspotList hotspots={childLocations} />
						</div>
					}

					{about &&
						<AboutSection heading={`About ${nameShort}`} text={about} />
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
			</div>
			<EditorActions>
				<Link href={`/edit/group/${_id}`}>Edit Location</Link>
			</EditorActions>
		</div>
	)
}
