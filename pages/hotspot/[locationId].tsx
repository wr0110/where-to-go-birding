import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Address from "components/Address";
import EbirdHotspotSummary from "components/EbirdHotspotSummary";
import EbirdBarcharts from "components/EbirdBarcharts";
import Link from "next/link";
import { getHotspotByLocationId, getChildHotspots } from "lib/mongo";
import AboutSection from "components/AboutSection";
import { getCountyByCode, getStateByCode } from "lib/localData";
import { County, State, HotspotsByCounty, Hotspot as HotspotType, GroupMarker } from "lib/types";
import EditorActions from "components/EditorActions";
import HotspotList from "components/HotspotList";
import ListHotspotsByCounty from "components/ListHotspotsByCounty";
import PageHeading from "components/PageHeading";
import DeleteBtn from "components/DeleteBtn";
import Title from "components/Title";
import Slideshow from "components/Slideshow";
import MapList from "components/MapList";
import { accessibleOptions, restroomOptions } from "lib/helpers";
import { restructureHotspotsByCounty } from "lib/helpers";
import GroupMap from "components/GroupMap";
import MapBox from "components/MapBox";
import NearbyHotspots from "components/NearbyHotspots";

const getChildren = async (id: string) => {
  if (!id) return null;
  const data = await getChildHotspots(id);
  return data || [];
};

interface Params extends ParsedUrlQuery {
  locationId: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { locationId } = query as Params;

  const data = await getHotspotByLocationId(locationId, true);
  if (!data) return { notFound: true };

  const state = getStateByCode(data.stateCode);
  if (!state) return { notFound: true };

  const county = getCountyByCode(data.countyCode);

  const childLocations = data?.parent ? [] : await getChildren(data._id);
  const childLocationsByCounty = data?.isGroup ? restructureHotspotsByCounty(childLocations as any) : [];
  const childIds = childLocations?.map((item) => item.locationId) || [];
  let locationIds = childIds?.length > 0 ? childIds : [];
  if (!data?.isGroup) {
    locationIds = [data?.locationId, ...locationIds];
  }

  const groupMarkers =
    childLocations?.map((it: any) => ({
      coordinates: [it.lng, it.lat],
      name: it.name,
      url: it.url,
    })) || [];

  const countySlugs =
    data.multiCounties?.map((item: string) => {
      const county = getCountyByCode(item);
      return county?.slug;
    }) || [];

  return {
    props: {
      state,
      county,
      childLocations: data?.isGroup ? [] : childLocations,
      childLocationsByCounty,
      locationIds,
      groupMarkers,
      countySlugs,
      ...data,
    },
  };
};

interface Props extends HotspotType {
  county: County;
  state: State;
  childLocations: HotspotType[];
  childLocationsByCounty: HotspotsByCounty;
  locationIds: string[];
  countySlugs: string[];
  groupMarkers: GroupMarker[];
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
  childLocationsByCounty,
  locationIds,
  slug,
  iba,
  drive,
  images,
  isGroup,
  groupMarkers,
  countySlugs,
  countryCode,
  markers,
  hideDefaultMarker,
}: Props) {
  const countrySlug = countryCode?.toLowerCase();
  let extraLinks = [];
  if (roadside === "Yes") {
    extraLinks.push({
      label: "Roadside Birding",
      url: `/${countrySlug}/${state.slug}/roadside-birding`,
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
      url: `/${countrySlug}/${state.slug}/important-bird-areas/${iba.value}`,
    });
  }
  if (drive) {
    extraLinks.push({
      label: drive.name,
      url: `/${countrySlug}/${state.slug}/drive/${drive.slug}`,
    });
  }

  const featuredImage = images?.filter((it) => !it.isMap && it?.width && it?.height && it?.width > it?.height)?.[0];
  const mapImages = images?.filter((item) => item.smUrl && item.isMap) || [];

  return (
    <div className="container pb-16">
      <Title>{name}</Title>
      <PageHeading countrySlug={countryCode.toLowerCase()} state={state} county={county}>
        {name}
      </PageHeading>
      {featuredImage && (
        <img
          src={featuredImage.lgUrl || featuredImage.smUrl}
          className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover object-center rounded-lg mb-8 -mt-10"
        />
      )}
      <EditorActions className={featuredImage ? "-mt-2" : "-mt-12"}>
        <Link href={isGroup ? `/edit/group/${_id}` : `/edit/${locationId}`}>Edit Hotspot</Link>
        {(isGroup || !parent) && <Link href={`/add?defaultParentId=${_id}`}>Add Child Hotspot</Link>}
        {!isGroup && (
          <>
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
          </>
        )}
        <DeleteBtn url={`/api/hotspot/delete?id=${_id}`} entity="hotspot" className="ml-auto">
          Delete Hotspot
        </DeleteBtn>
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
          {isGroup ? (
            <EbirdBarcharts portal={state.portal} region={locationIds.join(",")} />
          ) : (
            <EbirdHotspotSummary {...{ state, county, name, locationId, locationIds, lat, lng }} />
          )}

          {childLocations.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-1.5 font-bold text-lg">Locations</h3>
              <HotspotList hotspots={childLocations} />
            </div>
          )}

          {childLocationsByCounty.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-1.5 font-bold text-lg">Locations</h3>
              <ListHotspotsByCounty
                countrySlug={countryCode.toLowerCase()}
                stateSlug={state.slug}
                hotspots={childLocationsByCounty}
              />
            </div>
          )}

          {tips && <AboutSection heading="Tips for Birding" text={tips} />}

          {birds && <AboutSection heading="Birds of Interest" text={birds} />}

          {about && <AboutSection heading="About this Location" text={about} />}

          {parent?.about && parent?.name && <AboutSection heading={`About ${parent.name}`} text={parent.about} />}

          {hikes && <AboutSection heading="Birding Day Hike" text={hikes} />}
          <div className="space-y-1">
            {restrooms !== null && <p>{restroomOptions.find((it) => it.value === restrooms)?.label}</p>}
            {accessible?.map((option) => (
              <p key={option}>{accessibleOptions.find((it) => it.value === option)?.label}</p>
            ))}
            {roadside === "Yes" && <p>Roadside accessible.</p>}
          </div>
        </div>
        <div>
          {lat && lng && isGroup && <GroupMap lat={lat} lng={lng} zoom={zoom} markers={groupMarkers} />}
          {lat && lng && _id && !isGroup && (
            <MapBox
              hideDefault={!!hideDefaultMarker}
              markers={markers || []}
              hotspotId={_id}
              lat={lat}
              lng={lng}
              zoom={zoom}
            />
          )}
          {!!images?.length && <MapList images={mapImages} />}
          {!!images?.length && (
            <div className="mt-6">
              <Slideshow images={images} />
            </div>
          )}
          {lat && lng && !isGroup && <NearbyHotspots lat={lat} lng={lng} limit={4} exclude={[locationId]} />}
        </div>
      </div>
    </div>
  );
}
