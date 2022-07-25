import * as React from "react";
import Link from "next/link";
import { getDrivesByState } from "lib/mongo";
import { restructureDrivesByCounty } from "lib/helpers";
import { getState } from "lib/localData";
import PageHeading from "components/PageHeading";
import { GetServerSideProps } from "next";
import { DrivesByCounty, State } from "lib/types";
import Title from "components/Title";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const countrySlug = query.countrySlug as string;
  const stateSlug = query.stateSlug as string;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const drives = (await getDrivesByState(state.code)) || [];
  const drivesByCounty = restructureDrivesByCounty(drives as any, countrySlug, stateSlug);

  return {
    props: { countrySlug, state, drives: drivesByCounty },
  };
};

type Props = {
  countrySlug: string;
  state: State;
  drives: DrivesByCounty;
};

export default function Drives({ countrySlug, state, drives }: Props) {
  return (
    <div className="container pb-16 mt-12">
      <Title>Birding Drives</Title>
      <PageHeading countrySlug={countrySlug} state={state}>
        Birding Drives
      </PageHeading>
      <div className="md:flex gap-8 items-start mb-8">
        <div>
          <p className="mb-4">
            <strong>Birding Drives</strong> are routes for birding trips that can be accomplished in one day, stopping
            to walk and bird at various eBird hotspots. For each Birding Drive, a Google map is provided with the route
            and suggested stops at eBird hotspots. You may save the link to the Google map on your smartphone or tablet,
            or print a copy on paper to take with you. Links are provided for each eBird hotspot. Follow those links for
            information about birding each location.
          </p>
          <p className="mb-4">
            Feedback is especially welcome with suggestions for improving the driving directions on these birding
            drives. Additional tips for birding locations are also welcome. Please send us any suggestions for
            additional county drives or edits for existing drives using the&nbsp;
            <Link href={`/contact`}>contact form</Link>.
          </p>
        </div>
        <figure className="border p-2 bg-gray-200 text-center text-xs mb-4">
          <img src="/funk-bottoms.jpg" className="md:min-w-[300px] mx-auto" />
          <figcaption className="my-3">Funk Bottoms Wildlife Area, Ohio</figcaption>
        </figure>
      </div>
      <h3 className="text-lg mb-8 font-bold">Birding Dirves Listed by County</h3>
      <div className="columns-1 sm:columns-3 mb-12">
        {drives.map(({ countySlug, countyName, drives }) => (
          <p key={countySlug} className="mb-4 break-inside-avoid">
            <Link href={`/${countrySlug}/${state.slug}/${countySlug}-county`}>
              <a className="font-bold">{countyName} County</a>
            </Link>
            <br />
            {drives.map(({ name, url }) => (
              <React.Fragment key={url}>
                <Link href={url}>{name}</Link>
                <br />
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
