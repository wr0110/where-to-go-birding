import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import EbirdStateSummary from "components/EbirdStateSummary";
import OhioMap from "components/state-maps/OhioMap";
import ArizonaMap from "components/state-maps/ArizonaMap";
import VermontMap from "components/VermontMap";
import NewMexicoMap from "components/NewMexicoMap";
import RhodeIslandMap from "components/RhodeIslandMap";
import MichiganMap from "components/MichiganMap";
import MassachusettsMap from "components/state-maps/MassachusettsMap";
import KentuckyMap from "components/KentuckyMap";
import GeorgiaMap from "components/GeorgiaMap";
import NewHampshireMap from "components/state-maps/NewHampshireMap";
import { getState, getCounties } from "lib/localData";
import EbirdDescription from "components/EbirdDescription";
import EbirdHelpLinks from "components/EbirdHelpLinks";
import StateFeatureLinks from "components/StateFeatureLinks";
import RareBirds from "components/RareBirds";
import { State as StateType, Article, County as CountyType } from "lib/types";
import Heading from "components/Heading";
import PageHeading from "components/PageHeading";
import EditorActions from "components/EditorActions";
import Title from "components/Title";
import { scrollToAnchor } from "lib/helpers";
import TopHotspotList from "components/TopHotspotList";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { getArticlesByState } from "lib/mongo";

interface Params extends ParsedUrlQuery {
  countrySlug: string;
  stateSlug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { countrySlug, stateSlug } = params as Params;
  const state = getState(stateSlug);
  if (!countrySlug || !state) return { notFound: true };
  const counties = getCounties(state.code);

  const top10File = path.join(process.cwd(), "public", "top10", `US-${state.code}.json`);
  const topHotspotFile = fs.readFileSync(top10File);
  const topHotspots = JSON.parse(topHotspotFile.toString());

  const infoFile = path.join(process.cwd(), "data", "state-info", `${state.code.toLowerCase()}.md`);
  const info = fs.readFileSync(infoFile.toString(), "utf8");

  const articles = (await getArticlesByState(state.code)) || [];

  return { props: { countrySlug, counties, state, topHotspots, info, articles } };
};

type Props = {
  countrySlug: string;
  state: StateType;
  counties: CountyType[];
  info: string;
  articles: Article[];
  topHotspots: {
    name: string;
    total: number;
    url?: string;
  }[];
};

export default function State({ countrySlug, state, counties, topHotspots, info, articles }: Props) {
  const { label, code, slug, features } = state || ({} as StateType);
  const maps: any = {
    OH: <OhioMap />,
    AZ: <ArizonaMap />,
    VT: <VermontMap />,
    RI: <RhodeIslandMap />,
    NM: <NewMexicoMap />,
    MI: <MichiganMap />,
    MA: <MassachusettsMap />,
    KY: <KentuckyMap />,
    GA: <GeorgiaMap />,
    NH: <NewHampshireMap />,
  };

  const map = maps[code];

  return (
    <div className="container pb-16 mt-12">
      <Title>{slug === "ohio" ? "" : `Birding in ${label}`}</Title>
      <PageHeading countrySlug={countrySlug} state={state} hideState>
        Welcome to Birding in {label}
        {code === "OH" && (
          <>
            <br />
            <span className="text-sm">From the Ohio Ornithological Society</span>
          </>
        )}
      </PageHeading>
      <EditorActions className="-mt-10">
        <Link href="/add">Add Hotspot</Link>
        <Link href={`/edit/group/new?state=${code}&country=${countrySlug}`}>Add Group Hotspot</Link>
        <Link href={`/${countrySlug}/${slug}/article/edit/new`}>Add Article</Link>
      </EditorActions>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <h3 className="text-lg mb-1.5 font-bold">Where to Go Birding in {label}</h3>
          <p className="mb-4">
            <a href="#counties" onClick={scrollToAnchor}>
              Alphabetical list of {label} Counties
            </a>
            <br />
            <Link href={`/${countrySlug}/${slug}/alphabetical-index`}>{`Alphabetical list of ${label} Hotspots`}</Link>
            <br />
            <a href="#hotspots" onClick={scrollToAnchor}>
              Top Hotspots
            </a>
            <br />
            <a href="#notable" onClick={scrollToAnchor}>
              {label} Notable Bird Sightings
            </a>
          </p>
          {features?.length > 0 && <StateFeatureLinks countrySlug={countrySlug} slug={slug} features={features} />}
          <EbirdStateSummary {...state} code={`${countrySlug?.toUpperCase()}-${state?.code}`} />
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
          <Heading id="counties" color="green" className="mt-12 mb-8">
            {label} Counties
          </Heading>
          <div className="columns-3 sm:columns-4 flex-grow">
            {counties?.map(({ name, slug: countySlug, ebirdCode, active }) => (
              <p key={name}>
                {active ? (
                  <Link href={`/${countrySlug}/${slug}/${countySlug}-county`}>
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
        {articles.length > 0 && (
          <>
            <h3 className="text-lg mb-1.5 font-bold">Birding in {label} Articles</h3>
            <p className="mb-4">
              {articles.map(({ name, slug: articleSlug }) => (
                <React.Fragment key={articleSlug}>
                  <Link href={`/${countrySlug}/${slug}/article/${articleSlug}`}>{name}</Link>
                  <br />
                </React.Fragment>
              ))}
            </p>
          </>
        )}
        <ReactMarkdown linkTarget="_blank">{info}</ReactMarkdown>
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
