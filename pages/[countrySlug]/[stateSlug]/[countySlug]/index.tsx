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
  countrySlug: string;
  stateSlug: string;
  countySlug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { countrySlug, stateSlug, countySlug } = query as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const county = getCountyBySlug(state.code, countySlug);
  if (!county?.name) return { notFound: true };

  const file = path.join(process.cwd(), "public", "top10", `${county.ebirdCode}.json`);
  const topHotspotFile = fs.readFileSync(file);
  const topHotspots = JSON.parse(topHotspotFile.toString());

  const hotspots = (await getHotspotsByCounty(county.ebirdCode)) || [];
  return {
    props: { countrySlug, state, county, hotspots, topHotspots },
  };
};

type Props = {
  countrySlug: string;
  county: CountyType;
  state: State;
  hotspots: Hotspot[];
  topHotspots: {
    name: string;
    total: number;
    url?: string;
  }[];
};

export default function County({ countrySlug, state, county, hotspots, topHotspots }: Props) {
  const { slug, name, ebirdCode } = county;
  const dayHikeHotspots = hotspots.filter((it) => it.dayhike === "Yes");
  const hotspotIBA = hotspots.filter(({ iba }) => iba?.value).map(({ iba }) => iba);
  const hotspotDrives = hotspots.filter(({ drive }) => drive?.slug).map(({ drive }) => drive);

  //Removes duplicate objects from IBA array
  const iba = hotspotIBA.filter(
    (elem, index, self) =>
      self.findIndex((t) => {
        return t?.value === elem?.value && t?.label === elem?.label;
      }) === index
  );

  //Removes duplicate objects from drive array
  const drives = hotspotDrives.filter(
    (elem, index, self) =>
      self.findIndex((t) => {
        return t?.slug === elem?.slug && t?.name === elem?.name;
      }) === index
  );

  //@ts-ignore
  const sortedIba = iba.sort((a, b) => a.label.localeCompare(b.label));

  //@ts-ignore
  const sortedDrives = drives.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container pb-16">
      <Title>{`${name} County, ${state.label}`}</Title>
      <PageHeading countrySlug={countrySlug} state={state}>
        {name} County
      </PageHeading>
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
            <p>
              <a href="#tophotspots" onClick={scrollToAnchor}>
                Top Hotspots
              </a>
            </p>
            {dayHikeHotspots.length > 0 && (
              <p>
                <a href="#hikes" onClick={scrollToAnchor}>
                  Day Hikes
                </a>
              </p>
            )}
            {iba.length > 0 && (
              <p>
                <a href="#iba" onClick={scrollToAnchor}>
                  Audubon Important Bird Areas
                </a>
              </p>
            )}
            <p>
              <a href="#notable" onClick={scrollToAnchor}>
                Notable Sightings
              </a>
            </p>
          </section>
          <EbirdCountySummary {...{ state, county }} />
          <section>
            <h3 className="text-lg mb-2 font-bold" id="tophotspots">
              Top Hotspots in {name} County
            </h3>
            <TopHotspotList hotspots={topHotspots} />
          </section>
          {dayHikeHotspots.length > 0 && (
            <section>
              <h3 className="text-lg mb-2 font-bold" id="hikes">
                Day Hikes
              </h3>
              <HotspotList hotspots={dayHikeHotspots} />
            </section>
          )}
          {sortedIba.length > 0 && (
            <section>
              <h3 className="text-lg mb-2 font-bold" id="iba">
                Important Bird Areas
              </h3>
              <ul>
                {sortedIba?.map(({ label, value }: any) => (
                  <li key={value}>
                    <Link href={`/${countrySlug}/${state.slug}/important-bird-areas/${value}`}>{label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {sortedDrives.length > 0 && (
            <section>
              <h3 className="text-lg mb-2 font-bold" id="iba">
                Birding Drives
              </h3>
              <ul>
                {sortedDrives?.map(({ name, slug }: any) => (
                  <li key={slug}>
                    <Link href={`/${countrySlug}/${state.slug}/drive/${slug}`}>{name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="flex flex-col gap-8">
          {name && <RegionMap location={`${name} County, ${state.label}`} />}
          <section>
            <h3 className="text-lg mb-2 font-bold" id="hotspots">
              All Hotspots in {name} County
            </h3>
            <HotspotList hotspots={hotspots} />
          </section>
        </div>
      </div>
      <RareBirds region={ebirdCode} label={`${name} County`} className="mt-16" />
    </div>
  );
}
