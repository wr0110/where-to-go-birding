import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { getGroupBySlug, getGroupHotspots } from "lib/mongo";
import AboutSection from "components/AboutSection";
import { getCountyByCode, getState } from "lib/localData";
import { State, HotspotsByCounty, Hotspot as HotspotType, Marker } from "lib/types";
import EditorActions from "components/EditorActions";
import PageHeading from "components/PageHeading";
import EbirdBarcharts from "components/EbirdBarcharts";
import { restructureHotspotsByCounty } from "lib/helpers";
import ListHotspotsByCounty from "components/ListHotspotsByCounty";
import DeleteBtn from "components/DeleteBtn";
import Title from "components/Title";
import Slideshow from "components/Slideshow";
import MapList from "components/MapList";
import { accessibleOptions, restroomOptions } from "lib/helpers";
import GroupMap from "components/GroupMap";

const getChildren = async (id: string) => {
  if (!id) return null;
  return (await getGroupHotspots(id)) || [];
};

interface Params extends ParsedUrlQuery {
  stateSlug: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { stateSlug, slug } = query as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const data = await getGroupBySlug(state.code, slug);
  if (!data) return { notFound: true };

  const children = await getChildren(data._id);
  const childLocations = restructureHotspotsByCounty(children as any);
  const childIds = children?.map((item: any) => item.locationId) || [];

  const markers =
    children?.map((it: any) => ({
      coordinates: [it.lng, it.lat],
      name: it.name,
      url: it.url,
    })) || [];

  const countySlugs = data.multiCounties?.map((item: string) => {
    const county = getCountyByCode(item);
    return county?.slug;
  });

  return {
    props: {
      state,
      portal: state.portal || null,
      childLocations,
      childIds,
      markers,
      countySlugs,
      ...data,
    },
  };
};

interface Props extends HotspotType {
  state: State;
  portal: string;
  childLocations: HotspotsByCounty;
  childIds: string[];
  countySlugs: string[];
  markers: Marker[];
}

export default function GroupHotspot({
  state,
  portal,
  _id,
  name,
  lat,
  lng,
  zoom,
  address,
  links,
  iba,
  about,
  tips,
  birds,
  hikes,
  restrooms,
  roadside,
  accessible,
  childLocations,
  countySlugs,
  images,
  childIds,
  slug,
  markers,
}: Props) {
  let extraLinks = [];
  if (roadside === "Yes") {
    extraLinks.push({
      label: "Roadside Birding",
      url: `/${state.slug}/roadside-birding`,
    });
  }

  if (iba) {
    extraLinks.push({
      label: `${iba.label} Important Bird Area`,
      url: `/${state.slug}/important-bird-areas/${iba.value}`,
    });
  }

  const featuredImage = images?.filter((it) => !it.isMap && it?.width && it?.height && it?.width > it?.height)?.[0];

  return (
    <div className="container pb-16">
      <Title>{name}</Title>
      <PageHeading state={state}>{name}</PageHeading>
      {featuredImage && (
        <img
          src={featuredImage.lgUrl || featuredImage.smUrl}
          className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover object-center rounded-lg mb-8 -mt-10"
        />
      )}
      <EditorActions className={featuredImage ? "-mt-2" : "-mt-12"}>
        <Link href={`/edit/group/${_id}`}>Edit Hotspot</Link>
        <Link href={`/add?defaultParentId=${_id}`}>Add Child Hotspot</Link>
        <a href={`https://birding-in-ohio.com/${slug}`} target="_blank" rel="noreferrer">
          Old Website
        </a>
        <DeleteBtn url={`/api/hotspot/delete?id=${_id}`} entity="hotspot" className="ml-auto">
          Delete Hotspot
        </DeleteBtn>
      </EditorActions>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="mb-6">
            <h3 className="font-bold text-lg">{name}</h3>
            {address && <p className="whitespace-pre-line mb-2" dangerouslySetInnerHTML={{ __html: address }} />}
            {links?.map(({ url, label }, index) => (
              <React.Fragment key={url}>
                <a key={index} href={url} target="_blank" rel="noreferrer">
                  {label}
                </a>
                <br />
              </React.Fragment>
            ))}
            {extraLinks.length > 0 && (
              <p className="mt-4">
                Also, see:
                <br />
                {extraLinks?.map(({ url, label }) => (
                  <React.Fragment key={label}>
                    <Link href={url}>{label}</Link>
                    <br />
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>

          <EbirdBarcharts portal={portal} region={childIds.join(",")} />

          {childLocations.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-1.5 font-bold text-lg">Locations</h3>
              <ListHotspotsByCounty stateSlug={state.slug} hotspots={childLocations} />
            </div>
          )}

          {tips && <AboutSection heading="Tips for Birding" text={tips} />}

          {hikes && <AboutSection heading="Birding Day Hike" text={hikes} />}

          {birds && <AboutSection heading="Birds of Interest" text={birds} />}

          {about && <AboutSection heading="About this Location" text={about} />}

          <div className="space-y-1">
            {restrooms !== null && <p>{restroomOptions.find((it) => it.value === restrooms)?.label}</p>}
            {accessible?.map((option) => (
              <p key={option}>{accessibleOptions.find((it) => it.value === option)?.label}</p>
            ))}
            {roadside === "Yes" && <p>Roadside accessible.</p>}
          </div>
        </div>
        <div>
          <div
            className={`xs:grid md:block lg:grid ${countySlugs?.length > 1 ? "grid-cols-2" : "px-[25%]"} gap-12 mb-16`}
          >
            {state.slug === "ohio" &&
              countySlugs?.map((slug) => (
                <Link key={slug} href={`/${state.slug}/${slug}-county`}>
                  <a>
                    <img src={`/oh-maps/${slug}.jpg`} width="260" className="w-full" alt="County map" />
                  </a>
                </Link>
              ))}
          </div>
          {lat && lng && <GroupMap lat={lat} lng={lng} zoom={zoom} markers={markers} />}
          {!!images?.length && <MapList images={images} />}
          {!!images?.length && (
            <div className="mt-6">
              <Slideshow images={images} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
