import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import EbirdStateSummary from "components/EbirdStateSummary";
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
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { getArticlesByState } from "lib/mongo";
import StateMap from "components/StateMap";
import { MapIcon, ViewListIcon } from "@heroicons/react/outline";
import TopHotspots from "components/TopHotspots";

interface Params extends ParsedUrlQuery {
  countrySlug: string;
  stateSlug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { countrySlug, stateSlug } = params as Params;
  const state = getState(stateSlug);
  if (!countrySlug || !state) return { notFound: true };
  const counties = getCounties(state.code);

  const infoFile = path.join(process.cwd(), "data", "state-info", `${state.code.toLowerCase()}.md`);
  const info = fs.readFileSync(infoFile.toString(), "utf8");

  const articles = (await getArticlesByState(state.code)) || [];

  return { props: { countrySlug, counties, state, info, articles } };
};

type Props = {
  countrySlug: string;
  state: StateType;
  counties: CountyType[];
  info: string;
  articles: Article[];
};

export default function State({ countrySlug, state, counties, info, articles }: Props) {
  const [view, setView] = React.useState<string>("map");
  const { label, code, slug, features } = state || ({} as StateType);

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
            <Link href={`/${countrySlug}/${slug}/alphabetical-index`}>Alphabetical list of eBird Hotspots</Link>
            <br />
            <a href="#hotspots" onClick={scrollToAnchor}>
              Top eBird Hotspots
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
          <div className="flex">
            <button
              type="button"
              className="border py-1 px-2.5 text-xs rounded-full text-gray-600 flex items-center gap-2 hover:bg-gray-50/75 transition-all ml-auto mb-2"
              onClick={() => setView((prev) => (prev === "map" ? "list" : "map"))}
            >
              {view === "list" ? (
                <>
                  <MapIcon className="w-4 h-4" /> View Map
                </>
              ) : (
                <>
                  <ViewListIcon className="w-4 h-4" /> View County List
                </>
              )}
            </button>
          </div>
          {view === "map" ? (
            <div className="flex justify-center items-start">
              <StateMap regionCode={`${countrySlug.toUpperCase()}-${code}`} />
            </div>
          ) : (
            <div className="columns-3 sm:columns-4 flex-grow bg-gradient-to-t from-slate-600 to-slate-600/95 px-4 py-2 rounded">
              {counties?.map(({ name, slug: countySlug, ebirdCode, active }) => (
                <p key={name}>
                  {active ? (
                    <Link href={`/${countrySlug}/${slug}/${countySlug}-county`}>
                      <a className="font-bold text-slate-300">{name}</a>
                    </Link>
                  ) : (
                    <a
                      href={`https://ebird.org/region/${ebirdCode}?yr=all`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300"
                    >
                      {name}
                    </a>
                  )}
                </p>
              ))}
            </div>
          )}
          <div className="grid gap-8 grid-cols-2">
            <div className="flex gap-4 items-center">
              <div className="w-6 h-3" />
            </div>
          </div>
        </div>
      </div>

      <section>
        <Heading id="hotspots" color="green" className="mt-12 mb-8">
          Top eBird Hotspots
        </Heading>
        <TopHotspots
          region={`${countrySlug.toUpperCase()}-${code}`}
          label={`${label}, ${countrySlug.toUpperCase()}`}
          className="mt-12"
        />
      </section>

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
