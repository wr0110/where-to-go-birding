import * as React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Form from "components/Form";
import Submit from "components/Submit";
import { getSettings, getHotspotById } from "lib/mongo";
import AdminPage from "components/AdminPage";
import Field from "components/Field";
import useSecureFetch from "hooks/useSecureFetch";
import HotspotSelect from "components/HotspotSelect";

type Inputs = {
  selectedHotspots: {
    value: string;
    label: string;
  }[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const settings = await getSettings();
  const featuredIds = settings?.featuredIds || [];

  const selectedHotspots = await Promise.all(
    featuredIds.map(async (id: string) => {
      const hotspot = await getHotspotById(id);
      return {
        label: hotspot?.name || "",
        value: id,
      };
    })
  );

  return {
    props: {
      selectedHotspots,
    },
  };
};

type Props = {
  selectedHotspots: {
    value: string;
    label: string;
  }[];
};

export default function Featured({ selectedHotspots }: Props) {
  const [saving, setSaving] = React.useState<boolean>(false);
  const secureFetch = useSecureFetch();

  const router = useRouter();
  const form = useForm<Inputs>({ defaultValues: { selectedHotspots } });

  const handleSubmit: SubmitHandler<Inputs> = async ({ selectedHotspots }) => {
    if (selectedHotspots.length !== 8) {
      alert("You must select 8 hotspots");
      return;
    }
    setSaving(true);
    const json = await secureFetch("/api/settings/set", "POST", {
      featuredIds: selectedHotspots?.map((it) => it.value) || [],
    });
    setSaving(false);
    if (json.success) {
      router.push("/");
    } else {
      console.error(json.error);
      alert("Error saving drive");
    }
  };

  const value = form.watch("selectedHotspots");

  return (
    <AdminPage title="Edit Featured Hotspots">
      <div className="container pb-16 my-12">
        <Form form={form} onSubmit={handleSubmit}>
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Field label="Featured Hotspots (choose 8)">
                <HotspotSelect name="selectedHotspots" isMulti isOptionDisabled={() => value.length === 8} required />
                <span className="text-xs text-gray-500 font-normal">Hotspots will be sorted alphabetically</span>
              </Field>
            </div>
            <div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded">
              <Submit loading={saving} color="green" className="font-medium">
                Save
              </Submit>
            </div>
          </div>
        </Form>
      </div>
    </AdminPage>
  );
}
