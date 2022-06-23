import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Address from "components/Address";
import EbirdHotspotSummary from "components/EbirdHotspotSummary";
import Map from "components/Map";
import Link from "next/link";
import { getHotspotBySlug, getChildHotspots } from "lib/mongo";
import AboutSection from "components/AboutSection";
import { getCountyBySlug, getState } from "lib/localData";
import { County, State, Hotspot as HotspotType } from "lib/types";
import EditorActions from "components/EditorActions";
import HotspotList from "components/HotspotList";
import Heading from "components/Heading";
import DeleteBtn from "components/DeleteBtn";
import Title from "components/Title";
import Slideshow from "components/Slideshow";
import MapList from "components/MapList";

const getChildren = async (id: string) => {
  if (!id) return null;
  const data = await getChildHotspots(id);
  return data || [];
};

interface Params extends ParsedUrlQuery {
  stateSlug: string;
  countySlug: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { stateSlug, countySlug, slug } = query as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const county = getCountyBySlug(state.code, countySlug);
  if (!county?.slug) return { notFound: true };

  const data = await getHotspotBySlug(county.ebirdCode, slug);
  if (!data) return { notFound: true };

  const childLocations = data?.parent ? [] : await getChildren(data._id);
  const childIds = childLocations?.map((item) => item.locationId) || [];
  const locationIds = childIds?.length > 0 ? [data?.locationId, ...childIds] : [data?.locationId];

  return {
    props: { state, county, childLocations, locationIds, ...data },
  };
};

interface Props extends HotspotType {
  county: County;
  state: State;
  childLocations: HotspotType[];
  locationIds: string[];
}

export default function Hotspot({
  state,
  county,
  name,
  _id,
  lat,
  lng,
  address,
  links,
  about,
  tips,
  birds,
  hikes,
  restrooms,
  roadside,
  accessible,
  locationId,
  parent,
  childLocations,
  locationIds,
  images,
}: Props) {
  const nameParts = name?.split("--");
  const nameShort = nameParts?.length === 2 ? nameParts[1] : name;

  let extraLinks = [];
  if (roadside === "Yes") {
    extraLinks.push({
      label: "Roadside Birding",
      url: `/birding-in-${state.slug}/roadside-birding`,
    });
  }
  if (parent) {
    extraLinks.push({
      label: parent.name,
      url: parent.url,
    });
  }

  return (
    <div className="container pb-16">
      <Title isOhio={state.code === "OH"}>{name}</Title>
      <Heading state={state} county={county}>
        {name}
      </Heading>
      <EditorActions>
        <Link href={`/edit/${locationId}`}>Edit Hotspot</Link>
        {!parent && <Link href={`/add?defaultParentId=${_id}`}>Add Child Hotspot</Link>}
        <DeleteBtn id={_id || ""} className="ml-auto" />
      </EditorActions>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="mb-6">
            {name && (
              <Address
                line1={nameParts?.length === 2 ? nameParts[0] : name}
                line2={nameParts?.length === 2 ? nameShort : ""}
                address={address}
              />
            )}
            {links?.map(({ url, label }, index) => (
              <React.Fragment key={label}>
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
          {name && <EbirdHotspotSummary {...{ state, county, name, locationId, locationIds, lat, lng }} />}

          {childLocations.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 font-bold">Locations</h3>
              <HotspotList hotspots={childLocations} />
            </div>
          )}

          {tips && <AboutSection heading="Tips for Birding" text={tips} />}

          {hikes && <AboutSection heading="Birding Day Hike" text={hikes} />}

          {birds && <AboutSection heading="Birds of Interest" text={birds} />}

          {about && <AboutSection heading="About this Location" text={about} />}

          {parent?.about && parent?.name && <AboutSection heading={`About ${parent.name}`} text={parent.about} />}
          <div className="space-y-1">
            {restrooms === "Yes" && <p>Restrooms on site.</p>}
            {restrooms === "No" && <p>No restrooms on site.</p>}
            {accessible === "ADA" && <p>ADA accessible facilities on site.</p>}
            {accessible === "Birdability" && (
              <p>
                Accessible facilities on site, listed as a{" "}
                <a href="https://www.birdability.org/" target="_blank" rel="noreferrer">
                  Birdability
                </a>{" "}
                location.
              </p>
            )}
            {roadside === "Yes" && <p>Roadside accessible.</p>}
          </div>
        </div>
        <div>
          {state.code === "OH" && (
            <Link href={`/birding-in-${state.slug}/${county.slug}-county`}>
              <a>
                <img
                  src={`/oh-maps/${county.slug}.jpg`}
                  width="260"
                  className="mx-auto mb-10"
                  alt={`${county.name} county map`}
                />
              </a>
            </Link>
          )}
          {lat && lng && <Map lat={lat} lng={lng} />}
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
