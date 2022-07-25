import * as React from "react";
import { getHikeHotspotsByState } from "lib/mongo";
import { restructureHotspotsByCounty } from "lib/helpers";
import { getState } from "lib/localData";
import PageHeading from "components/PageHeading";
import { GetServerSideProps } from "next";
import { HotspotsByCounty } from "lib/types";
import ListHotspotsByCounty from "components/ListHotspotsByCounty";
import Title from "components/Title";
import { State } from "lib/types";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const countrySlug = query.countrySlug as string;
  const stateSlug = query.stateSlug as string;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const hotspots = (await getHikeHotspotsByState(state.code)) || [];
  const hotspotsByCounty = restructureHotspotsByCounty(hotspots as any);

  return {
    props: { countrySlug, state, hotspots: hotspotsByCounty },
  };
};

type Props = {
  countrySlug: string;
  state: State;
  hotspots: HotspotsByCounty;
};

export default function BirdingDayHikes({ countrySlug, state, hotspots }: Props) {
  return (
    <div className="container pb-16 mt-12">
      <Title>Birding Day Hikes</Title>
      <PageHeading countrySlug={countrySlug} state={state}>
        Birding Day Hikes
      </PageHeading>
      <div className="md:flex gap-8 items-start mb-8">
        <div>
          <p className="mb-4">
            <strong>{state.label} Birding Day Hikes</strong> are designed to help birders discover places to walk and
            see bird life. Often when we visit a park for the first time it is a challenge to know where to start. These
            hikes, recommended by birders and hikers in {state.label}, are a way to begin to explore new territory.
            Safety first
          </p>
          <p className="mb-4">
            It is sometimes said that “birding is one of the slowest forms of transportation.” Even walking a short
            distance while observing birds can take lots of time. There are some short hikes in this collection, but
            many are 2 miles or longer. Often there are options of trails to take or suggestions of ways to shorten or
            lengthen a hike.
          </p>
          <p className="mb-4">
            If a birder visits your county, what hike would you you suggest? Feedback is especially welcome with
            suggestions for improving the description of a hike. Tips for birding locations are also welcome. There is
            no limit to the number of hikes we can have in a county. Feel free to suggest one you like, even if we
            already have a hike in your county.
          </p>
        </div>
        <figure className="border p-2 bg-gray-200 text-center text-xs mb-4">
          <img src="/irwin-prairie.jpg" className="md:min-w-[200px] mx-auto" alt="Boardwalk across marsh" />
          <figcaption className="my-3">
            Irwin Prairie, Ohio
            <br />
            Photo by Ken Ostermiller
          </figcaption>
        </figure>
      </div>
      <h3 className="text-lg mb-8 font-bold">Day Hikes listed by County</h3>
      <div className="columns-1 sm:columns-3 mb-12">
        <ListHotspotsByCounty stateSlug={state.slug} hotspots={hotspots} />
      </div>
    </div>
  );
}
