import * as React from "react";
import Link from "next/link";
import { getHotspotsByState } from "lib/mongo";
import { getState } from "lib/localData";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import PageHeading from "components/PageHeading";
import Title from "components/Title";
import { State } from "lib/types";
import { useUser } from "providers/user";

interface Params extends ParsedUrlQuery {
  stateSlug: string;
  countrySlug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { countrySlug, stateSlug } = query as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const hotspots = (await getHotspotsByState(state.code)) || [];
  let activeLetters = hotspots.map((hotspot) => hotspot.name.charAt(0).toUpperCase());
  activeLetters = [...new Set(activeLetters)];

  return {
    props: { countrySlug, state, hotspots, activeLetters },
  };
};

type Props = {
  countrySlug: string;
  state: State;
  activeLetters: string[];
  hotspots: {
    name: string;
    url: string;
    reviewed: boolean;
  }[];
};

export default function AlphabeticalIndex({ countrySlug, state, hotspots, activeLetters }: Props) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const { user } = useUser(); //TODO: Remove after migration
  return (
    <div className="container pb-16 mt-12">
      <Title>Alphabetical Index</Title>
      <PageHeading countrySlug={countrySlug} state={state}>
        Alphabetical Index
      </PageHeading>
      <p className="mb-4">
        <i>
          Tip: Use your browser’s search function to search this page for all or part of the name of a hotspot. Or click
          on a letter below to move to that portion of the alphabetical index.
        </i>
      </p>
      <p className="my-4">
        Also, see <Link href={`/${countrySlug}/${state.slug}/roadside-birding`}>Roadside Birding</Link> for hotspots
        where you may view birds from your vehicle.
      </p>
      <p className="mb-8">
        Total hotspots: <strong>{hotspots?.length}</strong>
      </p>
      <p>
        {alphabet.map((letter) => {
          if (activeLetters.includes(letter)) {
            return (
              <Link key={letter} href={`#${letter}`}>
                <a className="inline-block mr-3 text-lg">{letter.toUpperCase()}</a>
              </Link>
            );
          }
          return (
            <span className="inline-block mr-3 text-gray-300 text-lg" key={letter}>
              {letter}
            </span>
          );
        })}
      </p>
      {hotspots.map(({ name, url, reviewed }, i, array) => {
        const prev = i === 0 ? null : array[i - 1];
        const isNumber = !isNaN(parseInt(name.charAt(0)));
        const showLetter = prev ? name.charAt(0) !== prev.name.charAt(0) && !isNumber : true;
        return (
          <React.Fragment key={name}>
            {showLetter && (
              <h2 id={name[0]} className="font-bold mt-4 mb-2">
                {isNumber ? "" : name[0].toUpperCase()}
              </h2>
            )}
            <Link href={url}>{name}</Link>
            {reviewed === false &&
              user && ( //TODO: Remove after migration
                <span
                  className="bg-yellow-500 rounded-full text-xs w-4 h-4 text-white font-bold inline-flex justify-center items-center ml-2"
                  title="Not Reviewed"
                >
                  !
                </span>
              )}
            <br />
          </React.Fragment>
        );
      })}
    </div>
  );
}
