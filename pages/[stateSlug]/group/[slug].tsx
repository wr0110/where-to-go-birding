import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { getGroupBySlug, getGroupHotspots } from "lib/mongo";
import AboutSection from "components/AboutSection";
import { getCountyByCode, getState } from "lib/localData";
import { HotspotsByCounty, Hotspot as HotspotType } from "lib/types";
import EditorActions from "components/EditorActions";
import Heading from "components/Heading";
import EbirdBarcharts from "components/EbirdBarcharts";
import { restructureHotspotsByCounty } from "lib/helpers";
import ListHotspotsByCounty from "components/ListHotspotsByCounty";
import DeleteBtn from "components/DeleteBtn";

const getChildren = async (id: string) => {
	if (!id) return null;
	return await getGroupHotspots(id) || [];
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

	const children = await getChildren(data._id);
	const hikes = children?.filter(item => item.dayhike === "Yes");
	const childLocations = restructureHotspotsByCounty(children as any);
	const hikesStructured = restructureHotspotsByCounty(hikes as any);
	const childIds = children?.map((item: any) => item.locationId) || [];

	const countySlugs = data.multiCounties?.map((item: string) => {
		const county = getCountyByCode(item)
		return county?.slug;
	});

  return {
    props: {
			stateSlug: state.slug,
			portal: state.portal || null,
			childLocations,
			hikes: hikesStructured,
			childIds,
			countySlugs,
			...data,
		},
  }
}

interface Props extends HotspotType {
	stateSlug: string,
	portal: string,
	childLocations: HotspotsByCounty,
	hikes: HotspotsByCounty,
	childIds: string[],
	countySlugs: string[],
}

export default function GroupHotspot({ stateSlug, portal, _id, name, links, iba, about, restrooms, roadside, accessible, childLocations, hikes, countySlugs, childIds }: Props) {
	let extraLinks = [];
	if (roadside === "Yes") {
		extraLinks.push({
			label: "Roadside Birding",
			url: `/birding-in-${stateSlug}/roadside-birding`
		});
	}

	if (iba) {
		extraLinks.push({
			label: `${iba.label} Important Bird Area`,
			url: `/birding-in-${stateSlug}/important-birding-areas/${iba.value}`
		});
	}

	return (
		<div className="container pb-16">
			<Heading>{name}</Heading>
			<div className="md:grid grid-cols-2 gap-12">
				<div>
					<div className="mb-6">
						<h3 className="font-bold text-lg">{name}</h3>
						{links?.map(({ url, label }, index) => (
							<>
								<a key={index} href={url} target="_blank" rel="noreferrer">{label}</a><br />
							</>
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

					<EbirdBarcharts portal={portal} region={childIds.join(",")} />

					{childLocations.length > 0 && 
						<div className="mb-6">
							<h3 className="mb-4 font-bold text-lg">Locations</h3>
							<ListHotspotsByCounty stateSlug={stateSlug} hotspots={childLocations} />
						</div>
					}

					{hikes.length > 0 && 
						<div className="mb-6">
							<h3 className="mb-4 font-bold text-lg">Birding Day Hikes</h3>
							<ListHotspotsByCounty stateSlug={stateSlug} hotspots={hikes} />
						</div>
					}

					{about &&
						<AboutSection heading={`About ${name}`} text={about} />
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
					<div className="xs:grid md:block lg:grid grid-cols-2 gap-12">
						{stateSlug === "ohio" && countySlugs?.map(slug => (
							<Link key={slug} href={`/birding-in-${stateSlug}/${slug}-county`}>
								<a>
									<img src={`/oh-maps/${slug}.jpg`} width="260" className="w-full" alt="County map" />
								</a>
							</Link>
						))}
					</div>
				</div>
			</div>
			<EditorActions>
				<Link href={`/edit/group/${_id}`}>Edit Hotspot</Link>
				<DeleteBtn id={_id || ""} className="ml-auto" />
			</EditorActions>
		</div>
	)
}
