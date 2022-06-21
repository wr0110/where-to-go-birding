import Link from "next/link";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getHotspotsByCounty } from "lib/mongo";
import { getState, getCountyBySlug } from "lib/localData";
import RegionMap from "components/RegionMap";
import Heading from "components/Heading";
import { State, Hotspot, County as CountyType } from "lib/types";
import EbirdCountySummary from "components/EbirdCountySummary";
import HotspotList from "components/HotspotList";
import TopHotspotList from "components/TopHotspotList";
import RareBirds from "components/RareBirds";
import EditorActions from "components/EditorActions";
import Title from "components/Title";
import { scrollToAnchor } from "lib/helpers";
import fs from "fs";

interface Params extends ParsedUrlQuery {
  stateSlug: string;
  countySlug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { stateSlug, countySlug } = query as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const county = getCountyBySlug(state.code, countySlug);
  if (!county?.name) return { notFound: true };

  const topHotspotFile = fs.readFileSync(`./top10/${county.ebirdCode}.json`);
  const topHotspots = JSON.parse(topHotspotFile.toString());

  const hotspots = (await getHotspotsByCounty(county.ebirdCode)) || [];
  return {
    props: { state, county, hotspots, topHotspots },
  };
};

type Props = {
  county: CountyType;
  state: State;
  hotspots: Hotspot[];
  topHotspots: {
    name: string;
    total: number;
    url?: string;
    id?: string;
  }[];
};

export default function County({
  state,
  county,
  hotspots,
  topHotspots,
}: Props) {
  const { slug, name, ebirdCode } = county;
  const hikes = hotspots.filter(({ dayhike }) => dayhike === "Yes");
  const hotspotIBA = hotspots
    .filter(({ iba }) => iba?.value)
    .map(({ iba }) => iba);

  //Removes duplicate objects from IBA array
  const iba = hotspotIBA.filter(
    (elem, index, self) =>
      self.findIndex((t) => {
        return t?.value === elem?.value && t?.label === elem?.label;
      }) === index
  );

  return (
    <div className="container pb-16">
      <Title
        isOhio={state.slug === "ohio"}
      >{`${name} County, ${state.label}`}</Title>
      <Heading state={state}>{name} County</Heading>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-lg mb-2 font-bold">
            Where to Go Birding in {name} County
          </h3>
          <p className="mb-4">
            <a href="#hotspots" onClick={scrollToAnchor}>
              Alphabetical List of Hotspots
            </a>
            <br />
            <a href="#dayhikes" onClick={scrollToAnchor}>
              Birding Day Hikes
            </a>
            <br />
          </p>
          <EbirdCountySummary {...{ state, county }} />
          <h3 className="text-lg mb-2 font-bold" id="hotspots">
            Top Hotspots in {name} County
          </h3>
          <HotspotList hotspots={hotspots} />
          <h3 className="text-lg mb-2 font-bold" id="hotspots">
            All Hotspots in {name} County
          </h3>
          <TopHotspotList hotspots={topHotspots} />
        </div>
        <div>
          {state.code === "OH" && (
            <img
              src={`/oh-maps/${slug}.jpg`}
              width="260"
              className="mx-auto mb-10"
              alt={`${name} county map`}
            />
          )}
          {name && <RegionMap location={`${name} County, ${state.label}`} />}
          {hikes.length > 0 && (
            <>
              <h3 className="text-lg mb-2 font-bold mt-6" id="dayhikes">
                Birding Day Hikes
              </h3>
              <HotspotList hotspots={hikes} />
            </>
          )}
          {iba.length > 0 && (
            <>
              <h3 className="text-lg mb-2 font-bold mt-6" id="dayhikes">
                Important Bird Areas
              </h3>
              <ul>
                {iba?.map(({ label, value }: any) => (
                  <li key={value}>
                    <Link
                      href={`/birding-in-${state.slug}/important-bird-areas/${value}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <RareBirds
        region={ebirdCode}
        label={`${name} County Notable Sightings`}
        className="mt-16"
      />
      <EditorActions>
        <Link href="/add">Add Hotspot</Link>
      </EditorActions>
    </div>
  );
}
