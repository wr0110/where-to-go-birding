import * as React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import EbirdStateSummary from "components/EbirdStateSummary";
import OhioMap from "components/OhioMap";
import ArizonaMap from "components/ArizonaMap";
import { getState, getCounties, getStateLinks } from "lib/localData";
import EbirdDescription from "components/EbirdDescription";
import EbirdHelpLinks from "components/EbirdHelpLinks";
import StateFeatureLinks from "components/StateFeatureLinks";
import RareBirds from "components/RareBirds";
import States from "data/states.json";
import { StateLinks, State as StateType, County as CountyType } from "lib/types";
import Heading from "components/Heading";
import EditorActions from "components/EditorActions";
import Title from "components/Title";
import { scrollToAnchor } from "lib/helpers";
import TopHotspotList from "components/TopHotspotList";
import fs from "fs";
import path from "path";

interface Params extends ParsedUrlQuery {
  stateSlug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = States.filter(({ active }) => active).map(({ slug }) => ({
    params: { stateSlug: slug },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { stateSlug } = params as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };
  const counties = getCounties(state.code);
  const links = getStateLinks(state.code);

  const file = path.join(process.cwd(), "public", "top10", `US-${state.code}.json`);
  const topHotspotFile = fs.readFileSync(file);
  const topHotspots = JSON.parse(topHotspotFile.toString());

  return { props: { counties, links, state, topHotspots } };
};

type Props = {
  state: StateType;
  counties: CountyType[];
  links: StateLinks;
  topHotspots: {
    name: string;
    total: number;
    url?: string;
  }[];
};

export default function State({ state, counties, links, topHotspots }: Props) {
  const { label, code, slug, features } = state || ({} as StateType);
  const maps: any = {
    OH: <OhioMap />,
    AZ: <ArizonaMap />,
  };

  const map = maps[code];

  const countyListCols = counties?.length > 20 ? "columns-2 xs:columns-3 sm:columns-5" : "columns-3 sm:columns-4";

  return (
    <div className="container pb-16 mt-12">
      <Title isOhio={slug === "ohio"}>{slug === "ohio" ? "" : `Birding in ${label}`}</Title>
      <Heading state={state} hideState>
        Welcome to Birding in {label}
        {code === "OH" && (
          <>
            <br />
            <span className="text-sm">From the Ohio Ornithological Society</span>
          </>
        )}
      </Heading>
      <EditorActions>
        <Link href="/add">Add Hotspot</Link>
        <Link href={`/edit/group/new?state=${code}`}>Add Group Hotspot</Link>
      </EditorActions>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <h3 className="text-lg mb-4 font-bold">Where to Go Birding in {label}</h3>
          <p className="mb-4">
            <a href="#counties" onClick={scrollToAnchor}>
              Alphabetical list of {label} Counties
            </a>
            <br />
            <Link href={`/${slug}/alphabetical-index`}>{`Alphabetical list of ${label} Hotspots`}</Link>
            <br />
            <a href="#top-locations" onClick={scrollToAnchor}>
              Top Birding Locations in {label}
            </a>
            <br />
            <a href="#notable" onClick={scrollToAnchor}>
              {label} Notable Bird Sightings
            </a>
          </p>
          {features?.length > 0 && <StateFeatureLinks slug={slug} features={features} />}
          <EbirdStateSummary {...state} />
        </div>
        <div className="mb-8">
          <div className="flex justify-center items-start md:mt-12">{map}</div>
        </div>
      </div>

      <div className={counties?.length > 20 ? "block" : `grid md:grid-cols-2 gap-12`}>
        <section>
          <h3 className="text-lg mb-2 font-bold" id="hotspots">
            Top Hotspots in {label}
          </h3>
          <TopHotspotList hotspots={topHotspots} className={counties?.length > 20 ? "md:columns-2" : ""} />
        </section>
        <section className="mb-8">
          <h3 id="counties" className="text-lg mb-4 font-bold">
            {label} Counties
          </h3>
          <div className={`${countyListCols}`}>
            {counties?.map(({ name, slug: countySlug, ebirdCode, active }) => (
              <p key={name}>
                {active ? (
                  <Link href={`/${slug}/${countySlug}-county`}>
                    <a className="font-bold">{name}</a>
                  </Link>
                ) : (
                  <a href={`https://ebird.org/region/${ebirdCode}?yr=all`} target="_blank" rel="noreferrer">
                    {name}
                  </a>
                )}
              </p>
            ))}
          </div>
        </section>
      </div>

      <hr className="mt-12" />

      <div className="md:grid grid-cols-2 gap-16 mt-12">
        <div>
          <EbirdDescription />
          <h3 className="text-lg mb-4 font-bold">Finding Birding Locations in {label}</h3>
          <p className="mb-4">
            This website provides descriptions and maps of eBird Hotspots in {label}. In eBird, Hotspots are shared
            locations where birders may report their bird sightings to eBird. Hotspots provide birders with information
            about birding locations where birds are being seen.
          </p>

          <p className="mb-4">
            Hotspots are organized by county. If you know the county of a location, click on the county name in the{" "}
            <a href="#counties" onClick={scrollToAnchor}>
              Alphabetical list of {label} Counties
            </a>{" "}
            to access information about birds and all the eBird hotspots in that county.
          </p>

          <p className="mb-4">
            If you do not know the county, select a hotspot from the Alphabetical list of {label} Hotspots. Or use the
            “magnifying glass” search icon on the upper right to find a hotspot. Enter all or part of a hotspot name.
          </p>
        </div>
        <div>
          <EbirdHelpLinks />
          {links?.map(({ section, links }) => (
            <React.Fragment key={section}>
              <h3 className="text-lg mb-4 font-bold">{section}</h3>
              <p className="mb-4">
                {links.map(({ label, url }) => (
                  <React.Fragment key={label}>
                    <a key={label} href={url} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>
      <RareBirds region={`US-${code}`} label={label} className="mt-6" />
    </div>
  );
}
