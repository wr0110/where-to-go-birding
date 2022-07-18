import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { getDriveBySlug } from "lib/mongo";
import { getCountyByCode, getState } from "lib/localData";
import { State, Drive as DriveType } from "lib/types";
import PageHeading from "components/PageHeading";
import Title from "components/Title";
import EditorActions from "components/EditorActions";
import DeleteBtn from "components/DeleteBtn";

interface Params extends ParsedUrlQuery {
  stateSlug: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { stateSlug, slug } = query as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const data = await getDriveBySlug(state.code, slug);
  if (!data) return { notFound: true };

  const countySlugs = data.counties?.map((item: string) => {
    const county = getCountyByCode(item);
    return county?.slug;
  });

  return {
    props: {
      state,
      portal: state.portal || null,
      countySlugs,
      ...data,
    },
  };
};

interface Props extends DriveType {
  state: State;
  portal: string;
  countySlugs: string[];
}

export default function Drive({ name, description, state, mapId, countySlugs, entries, _id }: Props) {
  return (
    <div className="container pb-16">
      <Title>{name}</Title>
      <PageHeading state={state}>{name}</PageHeading>
      <EditorActions className="-mt-12">
        <Link href={`/${state.slug}/drive/edit/${_id}`}>Edit Drive</Link>
        <Link href={`/${state.slug}/drive/edit/new`}>Add Drive</Link>
        <DeleteBtn url={`/api/drive/delete?id=${_id}`} entity="drive" className="ml-auto">
          Delete Drive
        </DeleteBtn>
      </EditorActions>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="mb-4">
            <strong>Birding Drives</strong> are routes for birding trips which can be accomplished in one day, stopping
            to walk and bird at various eBird hotspots. For each birding drive, a Google map is provided with the route
            and suggested stops at eBird hotspots. You may save the link to the Google map on your smartphone or tablet,
            or print a copy on paper to take with you. Links are provided with information about each eBird hotspot.
            Follow those links for more information about birding each location.
          </p>
          <p className="mb-4">
            <strong>{name}</strong>
            <br />
            Click on the hotspot names below to view the page about that hotspot.
          </p>
          <div dangerouslySetInnerHTML={{ __html: description }} className="formatted" />
          {entries.map(({ description, hotspot }: any) => (
            <div key={hotspot._id} className="mb-4">
              <strong>
                <Link href={hotspot.url}>{hotspot.name}</Link>
              </strong>
              <br />
              {hotspot.address && (
                <p className="whitespace-pre-line mb-4" dangerouslySetInnerHTML={{ __html: hotspot.address }} />
              )}
              <div dangerouslySetInnerHTML={{ __html: description }} className="formatted" />
            </div>
          ))}
        </div>
        <div>
          <div
            className={`xs:grid md:block lg:grid ${countySlugs?.length > 1 ? "grid-cols-2" : "px-[25%]"} gap-12 mb-16`}
          >
            {state.slug === "ohio" &&
              countySlugs?.map((slug) => (
                <Link key={slug} href={`/${state.slug}/${slug}-county`}>
                  <a>
                    <img src={`/oh-maps/${slug}.jpg`} width="260" className="w-full" alt="County map" />
                  </a>
                </Link>
              ))}
          </div>
          <iframe
            src={`https://www.google.com/maps/d/embed?mid=${mapId}&z=10`}
            key={mapId}
            width="510"
            height="480"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
