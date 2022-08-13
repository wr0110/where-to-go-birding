import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import InputHotspotsWithText from "components/InputHotspotsWithText";
import Form from "components/Form";
import Submit from "components/Submit";
import Input from "components/Input";
import { getArticleById } from "lib/mongo";
import AdminPage from "components/AdminPage";
import { Article, ArticleInputs, State } from "lib/types";
import Field from "components/Field";
import useSecureFetch from "hooks/useSecureFetch";
import FormError from "components/FormError";
import { getState } from "lib/localData";
import { slugify } from "lib/helpers";
import TinyMCE from "components/TinyMCE";
import ImagesInput from "components/ImagesInput";
import HotspotSelect from "components/HotspotSelect";

const tinyConfig = {
  menubar: false,
  plugins: "link autoresize code lists",
  toolbar: "h3 bold italic underline bullist | alignleft aligncenter | removeformat link code",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } cite { font-size: 0.75em; font-style: normal; color: #666; } .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; } .three-columns { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3rem; } .four-columns { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 3rem; }",
  branding: false,
  elementpath: false,
  autoresize_bottom_margin: 0,
  convert_urls: false,
};

interface Params extends ParsedUrlQuery {
  id: string;
  countrySlug: string;
  stateSlug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id, countrySlug, stateSlug } = query as Params;
  const data: Article = id !== "new" ? await getArticleById(id) : null;

  const state = getState(stateSlug);
  if (!state) return { notFound: true };
  const hotspotSelect = data?.hotspots?.map((hotspot) => ({ label: hotspot.name, value: hotspot._id })) || [];

  return {
    props: {
      id: data?._id || null,
      countrySlug,
      state,
      isNew: !data,
      data: { ...data, hotspotSelect },
    },
  };
};

type Props = {
  id?: string;
  countrySlug: string;
  state: State;
  isNew: boolean;
  data: Article;
};

export default function Edit({ isNew, data, id, state, countrySlug }: Props) {
  const [saving, setSaving] = React.useState<boolean>(false);
  const secureFetch = useSecureFetch();

  const router = useRouter();
  const form = useForm<ArticleInputs>({ defaultValues: data });

  const handleSubmit: SubmitHandler<ArticleInputs> = async (data) => {
    setSaving(true);
    const newSlug = slugify(data.name);
    const json = await secureFetch(`/api/article/set?isNew=${isNew}`, "POST", {
      id,
      data: {
        ...data,
        stateCode: state.code,
        countryCode: countrySlug,
        slug: newSlug,
        hotspots: data.hotspotSelect.map(({ value }) => value),
      },
    });
    setSaving(false);
    if (json.success) {
      router.push(`/${countrySlug}/${state.slug}/article/${newSlug}`);
    } else {
      console.error(json.error);
      alert("Error saving article");
    }
  };

  return (
    <AdminPage title={`${isNew ? "Add" : "Edit"} Article`}>
      <div className="container pb-16 my-12">
        <Form form={form} onSubmit={handleSubmit}>
          <div className="max-w-4xl mx-auto">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <h2 className="text-xl font-bold text-gray-600 border-b pb-4">{isNew ? "Add" : "Edit"} Article</h2>
              <Field label="Title">
                <Input type="text" name="name" required />
                <FormError name="name" />
              </Field>
              <Field label="Content">
                <TinyMCE config={tinyConfig} name="content" defaultValue={data?.content} />
                <FormError name="content" />
              </Field>
              <Field label="Images">
                <ImagesInput hideExtraFields />
              </Field>
              <Field label="Attached Hotspots">
                <HotspotSelect name="hotspotSelect" stateCode={state.code} className="mt-1 w-full" isMulti />
              </Field>
            </div>
            <div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded">
              <Submit loading={saving} color="green" className="font-medium">
                Save Article
              </Submit>
            </div>
          </div>
        </Form>
      </div>
    </AdminPage>
  );
}
