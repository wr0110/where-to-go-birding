import Link from "next/link";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getHotspotsByCounty } from "lib/mongo";
import { getState, getCountyBySlug } from "lib/localData";
import RegionMap from "components/RegionMap";
import PageHeading from "components/PageHeading";
import { State, Hotspot, County as CountyType } from "lib/types";
import EbirdCountySummary from "components/EbirdCountySummary";
import HotspotList from "components/HotspotList";
import TopHotspotList from "components/TopHotspotList";
import RareBirds from "components/RareBirds";
import EditorActions from "components/EditorActions";
import Title from "components/Title";
import { scrollToAnchor } from "lib/helpers";
import fs from "fs";
import path from "path";

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

  const file = path.join(process.cwd(), "public", "top10", `${county.ebirdCode}.json`);
  const topHotspotFile = fs.readFileSync(file);
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
  }[];
};

export default function County({ state, county, hotspots, topHotspots }: Props) {
  const { slug, name, ebirdCode } = county;
  const hotspotIBA = hotspots.filter(({ iba }) => iba?.value).map(({ iba }) => iba);

  //Removes duplicate objects from IBA array
  const iba = hotspotIBA.filter(
    (elem, index, self) =>
      self.findIndex((t) => {
        return t?.value === elem?.value && t?.label === elem?.label;
      }) === index
  );

  return (
    <div className="container pb-16">
      <Title isOhio={state.slug === "ohio"}>{`${name} County, ${state.label}`}</Title>
      <PageHeading state={state}>{name} County</PageHeading>
      <EditorActions>
        <Link href="/add">Add Hotspot</Link>
      </EditorActions>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-lg mb-2 font-bold">Where to Go Birding in {name} County</h3>
            <p>
              <a href="#hotspots" onClick={scrollToAnchor}>
                Alphabetical List of Hotspots
              </a>
            </p>
          </section>
          <EbirdCountySummary {...{ state, county }} />
          <section>
            <h3 className="text-lg mb-2 font-bold" id="hotspots">
              Top Hotspots in {name} County
            </h3>
            <TopHotspotList hotspots={topHotspots} />
          </section>
        </div>
        <div className="flex flex-col gap-8">
          {state.code === "OH" && (
            <img src={`/oh-maps/${slug}.jpg`} width="260" className="mx-auto" alt={`${name} county map`} />
          )}
          {name && <RegionMap location={`${name} County, ${state.label}`} />}
          {iba.length > 0 && (
            <section>
              <h3 className="text-lg mb-2 font-bold mt-6" id="dayhikes">
                Important Bird Areas
              </h3>
              <ul>
                {iba?.map(({ label, value }: any) => (
                  <li key={value}>
                    <Link href={`/${state.slug}/important-bird-areas/${value}`}>{label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h3 className="text-lg mb-2 font-bold" id="hotspots">
              All Hotspots in {name} County
            </h3>
            <HotspotList hotspots={hotspots} />
          </section>
        </div>
      </div>
      <RareBirds region={ebirdCode} label={`${name} County Notable Sightings`} className="mt-16" />
    </div>
  );
}
