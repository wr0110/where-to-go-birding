import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { getArticleBySlug } from "lib/mongo";
import { getState } from "lib/localData";
import { State, HotspotsByCounty, Article as ArticleType } from "lib/types";
import PageHeading from "components/PageHeading";
import Title from "components/Title";
import EditorActions from "components/EditorActions";
import DeleteBtn from "components/DeleteBtn";
import MapList from "components/MapList";
import parse from "html-react-parser";
import ListHotspotsByCounty from "components/ListHotspotsByCounty";
import { restructureHotspotsByCounty } from "lib/helpers";

interface Params extends ParsedUrlQuery {
  countrySlug: string;
  stateSlug: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { countrySlug, stateSlug, slug } = query as Params;
  const state = getState(stateSlug);
  if (!state) return { notFound: true };

  const data = await getArticleBySlug(state.code, slug);
  if (!data) return { notFound: true };
  const hotspotsByCounty = data.hotspots ? restructureHotspotsByCounty(data.hotspots) : [];

  return {
    props: {
      countrySlug,
      state,
      portal: state.portal || null,
      hotspotsByCounty,
      ...data,
    },
  };
};

interface Props extends ArticleType {
  countrySlug: string;
  state: State;
  portal: string;
  hotspotsByCounty: HotspotsByCounty;
}

export default function Article({ countrySlug, name, content, hotspotsByCounty, state, images, _id }: Props) {
  return (
    <div className="container pb-16">
      <Title>{name}</Title>
      <PageHeading countrySlug={countrySlug} state={state}>
        {name}
      </PageHeading>
      <EditorActions className="-mt-12">
        <Link href={`/${countrySlug}/${state.slug}/article/edit/${_id}`}>Edit Article</Link>
        <Link href={`/${countrySlug}/${state.slug}/article/edit/new`}>Add Article</Link>
        <DeleteBtn url={`/api/article/delete?id=${_id}`} entity="article" className="ml-auto">
          Delete Article
        </DeleteBtn>
      </EditorActions>
      <div className="overflow-auto">
        <div className="formatted">
          <div className="float-right max-w-[50%] ml-12 -mt-6 mb-6">
            {!!images?.length && <MapList images={images} />}
          </div>
          {parse(content || "")}
        </div>
        {hotspotsByCounty.length > 0 && (
          <ListHotspotsByCounty countrySlug={countrySlug} stateSlug={state.slug} hotspots={hotspotsByCounty} />
        )}
      </div>
    </div>
  );
}
