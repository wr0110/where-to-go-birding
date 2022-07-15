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
import PageHeading from "components/PageHeading";
import DeleteBtn from "components/DeleteBtn";
import Title from "components/Title";
import Slideshow from "components/Slideshow";
import MapList from "components/MapList";
import { accessibleOptions, restroomOptions } from "lib/helpers";
import MapBox from "components/MapBox";
import MapCustomizer from "components/MapCustomizer";

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

  const data = await getHotspotBySlug(state.code, slug);
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
  zoom,
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
  slug,
  iba,
  images,
}: Props) {
  let extraLinks = [];
  if (roadside === "Yes") {
    extraLinks.push({
      label: "Roadside Birding",
      url: `/${state.slug}/roadside-birding`,
    });
  }
  if (parent) {
    extraLinks.push({
      label: parent.name,
      url: parent.url,
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
      <Title isOhio={state.code === "OH"}>{name}</Title>
      <PageHeading state={state} county={county}>
        {name}
      </PageHeading>
      {featuredImage && (
        <img
          src={featuredImage.lgUrl || featuredImage.smUrl}
          className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover object-center rounded-lg mb-8 -mt-10"
        />
      )}
      <EditorActions className={featuredImage ? "-mt-2" : "-mt-12"}>
        <Link href={`/edit/${locationId}`}>Edit Hotspot</Link>
        {!parent && <Link href={`/add?defaultParentId=${_id}`}>Add Child Hotspot</Link>}
        {state.code === "OH" ? (
          <a href={`https://birding-in-ohio.com/${county.slug}-county/${slug}`} target="_blank" rel="noreferrer">
            Old Website
          </a>
        ) : (
          <a
            href={`https://ebirdhotspots.com/birding-in-${state.slug}/us${state.code.toLowerCase()}-${
              county.slug
            }-county/us${state.code.toLowerCase()}-${slug}`}
            target="_blank"
            rel="noreferrer"
          >
            Old Website
          </a>
        )}
        <DeleteBtn id={_id || ""} className="ml-auto" />
      </EditorActions>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="mb-6">
            {name && <Address name={name} address={address} />}
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
              <h3 className="mb-1.5 font-bold text-lg">Locations</h3>
              <HotspotList hotspots={childLocations} />
            </div>
          )}

          {tips && <AboutSection heading="Tips for Birding" text={tips} />}

          {hikes && <AboutSection heading="Birding Day Hike" text={hikes} />}

          {birds && <AboutSection heading="Birds of Interest" text={birds} />}

          {about && <AboutSection heading="About this Location" text={about} />}

          {parent?.about && parent?.name && <AboutSection heading={`About ${parent.name}`} text={parent.about} />}
          <div className="space-y-1">
            {restrooms !== null && <p>{restroomOptions.find((it) => it.value === restrooms)?.label}</p>}
            {accessible?.map((option) => (
              <p key={option}>{accessibleOptions.find((it) => it.value === option)?.label}</p>
            ))}
            {roadside === "Yes" && <p>Roadside accessible.</p>}
          </div>
        </div>
        <div>
          {state.code === "OH" && (
            <Link href={`/${state.slug}/${county.slug}-county`}>
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
          {lat && lng && <Map lat={lat} lng={lng} zoom={zoom} />}
          {/*lat && lng && (
            <>
              <MapCustomizer lat={lat} lng={lng} zoom={zoom} />
              <MapBox lat={lat} lng={lng} zoom={zoom} />
            </>
          )*/}
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
