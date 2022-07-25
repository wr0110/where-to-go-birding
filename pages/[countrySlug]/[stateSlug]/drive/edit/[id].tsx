import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import InputDrive from "components/InputDrive";
import Form from "components/Form";
import Submit from "components/Submit";
import Input from "components/Input";
import CountySelect from "components/CountySelect";
import { getDriveById } from "lib/mongo";
import AdminPage from "components/AdminPage";
import { Drive, DriveInputs, State } from "lib/types";
import Field from "components/Field";
import useSecureFetch from "hooks/useSecureFetch";
import FormError from "components/FormError";
import { getState } from "lib/localData";
import { slugify } from "lib/helpers";
import TinyMCE from "components/TinyMCE";
import ImagesInput from "components/ImagesInput";

interface Params extends ParsedUrlQuery {
  id: string;
  countrySlug: string;
  stateSlug: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id, countrySlug, stateSlug } = query as Params;
  const data: Drive = id !== "new" ? await getDriveById(id) : null;

  const state = getState(stateSlug);
  if (!state) return { notFound: true };
  const entries =
    data?.entries?.map((entry) => ({ ...entry, hotspotSelect: { label: entry.hotspot.name, value: entry.hotspot } })) ??
    [];
  return {
    props: {
      id: data?._id || null,
      countrySlug,
      state,
      isNew: !data,
      data: { ...data, entries, counties: data?.counties || [] },
    },
  };
};

type Props = {
  id?: string;
  countrySlug: string;
  state: State;
  isNew: boolean;
  data: Drive;
};

export default function Edit({ isNew, data, id, state, countrySlug }: Props) {
  const [saving, setSaving] = React.useState<boolean>(false);
  const secureFetch = useSecureFetch();

  const router = useRouter();
  const form = useForm<DriveInputs>({ defaultValues: data });

  const handleSubmit: SubmitHandler<DriveInputs> = async (data) => {
    setSaving(true);
    const newSlug = slugify(data.name);
    const json = await secureFetch(`/api/drive/set?isNew=${isNew}`, "POST", {
      id,
      data: {
        ...data,
        stateCode: state.code,
        slug: newSlug,
        entries: data.entries.map((it) => ({ ...it, hotspot: it.hotspotSelect.value })),
      },
    });
    setSaving(false);
    if (json.success) {
      router.push(`/${countrySlug}/${state.slug}/drive/${newSlug}`);
    } else {
      console.error(json.error);
      alert("Error saving drive");
    }
  };

  return (
    <AdminPage title={`${isNew ? "Add" : "Edit"} Drive`}>
      <div className="container pb-16 my-12">
        <Form form={form} onSubmit={handleSubmit}>
          <div className="max-w-2xl mx-auto">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <h2 className="text-xl font-bold text-gray-600 border-b pb-4">{isNew ? "Add" : "Edit"} Drive</h2>
              <Field label="Name">
                <Input type="text" name="name" required />
                <FormError name="name" />
              </Field>
              <Field label="Description">
                <TinyMCE name="description" defaultValue={data?.description} />
                <FormError name="description" />
              </Field>
              <Field label="Google Map ID">
                <Input type="text" name="mapId" required />
                <FormError name="mapId" />
              </Field>
              <Field label="Counties">
                <CountySelect name="counties" stateCode={state.code} isMulti required />
                <FormError name="counties" />
              </Field>
              <Field label="Images">
                <ImagesInput hideExtraFields />
              </Field>
              <InputDrive stateCode={state.code} />
            </div>
            <div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded">
              <Submit loading={saving} color="green" className="font-medium">
                Save Drive
              </Submit>
            </div>
          </div>
        </Form>
      </div>
    </AdminPage>
  );
}
