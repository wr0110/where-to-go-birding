import { GetStaticProps, GetStaticPaths } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import EbirdStateSummary from "components/EbirdStateSummary";
import OhioMap from "components/OhioMap";
import ArizonaMap from "components/ArizonaMap";
import VermontMap from "components/VermontMap";
import RhodeIslandMap from "components/RhodeIslandMap";
import { getState, getCounties } from "lib/localData";
import EbirdDescription from "components/EbirdDescription";
import EbirdHelpLinks from "components/EbirdHelpLinks";
import StateFeatureLinks from "components/StateFeatureLinks";
import RareBirds from "components/RareBirds";
import States from "data/states.json";
import { State as StateType, County as CountyType } from "lib/types";
import Heading from "components/Heading";
import PageHeading from "components/PageHeading";
import EditorActions from "components/EditorActions";
import Title from "components/Title";
import { scrollToAnchor } from "lib/helpers";
import TopHotspotList from "components/TopHotspotList";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

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

  const top10File = path.join(process.cwd(), "public", "top10", `US-${state.code}.json`);
  const topHotspotFile = fs.readFileSync(top10File);
  const topHotspots = JSON.parse(topHotspotFile.toString());

  const infoFile = path.join(process.cwd(), "data", "state-info", `${state.code.toLowerCase()}.md`);
  const info = fs.readFileSync(infoFile.toString(), "utf8");

  return { props: { counties, state, topHotspots, info } };
};

type Props = {
  state: StateType;
  counties: CountyType[];
  info: string;
  topHotspots: {
    name: string;
    total: number;
    url?: string;
  }[];
};

export default function State({ state, counties, topHotspots, info }: Props) {
  const { label, code, slug, features } = state || ({} as StateType);
  const maps: any = {
    OH: <OhioMap />,
    AZ: <ArizonaMap />,
    VT: <VermontMap />,
    RI: <RhodeIslandMap />,
  };

  const map = maps[code];

  return (
    <div className="container pb-16 mt-12">
      <Title isOhio={slug === "ohio"}>{slug === "ohio" ? "" : `Birding in ${label}`}</Title>
      <PageHeading state={state} hideState>
        Welcome to Birding in {label}
        {code === "OH" && (
          <>
            <br />
            <span className="text-sm">From the Ohio Ornithological Society</span>
          </>
        )}
      </PageHeading>
      <EditorActions>
        <Link href="/add">Add Hotspot</Link>
        <Link href={`/edit/group/new?state=${code}`}>Add Group Hotspot</Link>
      </EditorActions>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <h3 className="text-lg mb-1.5 font-bold">Where to Go Birding in {label}</h3>
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

      <div className="grid md:grid-cols-2 gap-12">
        <section>
          <Heading id="hotspots" color="green" className="mt-12 mb-8">
            Top Hotspots in {label}
          </Heading>
          <TopHotspotList hotspots={topHotspots} />
        </section>
        <section className="mb-8 flex flex-col">
          <Heading id="hotspots" color="green" className="mt-12 mb-8">
            {label} Counties
          </Heading>
          <div className="columns-3 sm:columns-4 flex-grow">
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

      <Heading id="hotspots" color="yellow" className="mt-12 mb-8">
        More Information
      </Heading>

      <div className="md:columns-2 gap-16 formatted">
        <ReactMarkdown>{info}</ReactMarkdown>
      </div>
      <hr className="my-8 opacity-70" />
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-lg mb-1.5 font-bold">Finding Birding Locations in {label}</h3>
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
          <h3 className="text-lg mb-1.5 font-bold">Resources</h3>
          <a href="https://www.allaboutbirds.org/" target="_blank" rel="noreferrer">
            All About Birds
          </a>{" "}
          – online bird guide
          <br />
          <a href="https://birdsoftheworld.org/bow/home" target="_blank" rel="noreferrer">
            Birds of the World
          </a>
          <br />
          <a href="http://www.pwrc.usgs.gov/BBL/MANUAL/speclist.cfm" target="_blank" rel="noreferrer">
            Alpha Codes (4-letter)
          </a>
          <br />
          <a href="http://www.aba.org/about/ethics.html" target="_blank" rel="noreferrer">
            Code of Birding Ethics
          </a>
          <br />
        </div>
        <div>
          <EbirdDescription />
          <EbirdHelpLinks />
        </div>
      </div>
      <RareBirds region={`US-${code}`} label={label} className="mt-12" />
    </div>
  );
}
