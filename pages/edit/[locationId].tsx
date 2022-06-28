import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Textarea from "components/Textarea";
import Form from "components/Form";
import Submit from "components/Submit";
import { Editor } from "@tinymce/tinymce-react";
import { getHotspotByLocationId, getHotspotById } from "lib/mongo";
import { slugify, tinyConfig, geocode, getEbirdHotspot, accessibleOptions, restroomOptions } from "lib/helpers";
import { getStateByCode, getCountyByCode } from "lib/localData";
import InputLinks from "components/InputLinks";
import Select from "components/Select";
import IBAs from "data/oh-iba.json";
import AdminPage from "components/AdminPage";
import { Hotspot, HotspotInputs, EbirdHotspot } from "lib/types";
import RadioGroup from "components/RadioGroup";
import CheckboxGroup from "components/CheckboxGroup";
import Field from "components/Field";
import useSecureFetch from "hooks/useSecureFetch";
import HotspotSelect from "components/HotspotSelect";
import Error from "next/error";
import ImagesInput from "components/ImagesInput";

const ibaOptions = IBAs.map(({ slug, name }) => ({ value: slug, label: name }));

interface Params extends ParsedUrlQuery {
  locationId: string;
}

const getParent = async (id: string) => {
  if (!id) return null;
  const data = await getHotspotById(id);
  return data || null;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { locationId, defaultParentId } = query as Params;
  const data = await getHotspotByLocationId(locationId);
  const ebirdData: EbirdHotspot = await getEbirdHotspot(locationId);
  if (!ebirdData?.name) {
    return {
      props: { error: `Hotspot "${locationId}" not found in eBird` },
    };
  }
  const parentId = data?.parent || defaultParentId;
  const parent = parentId ? await getParent(parentId) : null;
  const nameChanged = data?.name && data?.name !== ebirdData.name;

  let slug = data?.slug;
  if (!slug || nameChanged) {
    slug = slugify(ebirdData.name);
  }

  return {
    props: {
      id: data?._id || null,
      isNew: !data,
      data: {
        ...data,
        slug,
        iba: data?.iba || parent?.iba || null,
        links: data?.links || parent?.links || null,
        parentSelect: parent ? { label: parent.name, value: parent._id } : null,
        name: ebirdData?.name || data?.name,
        lat: ebirdData?.latitude || data?.lat,
        lng: ebirdData?.longitude || data?.lng,
        stateCode: data?.stateCode || ebirdData?.subnational1Code?.replace("US-", ""),
        countyCode: data?.countyCode || ebirdData?.subnational2Code,
        locationId: locationId,
        roadside: data?.roadside || "Unknown",
        restrooms: restroomOptions.find((it) => it.value === data?.restrooms) || null,
        accessible: data?.accessible || null,
        dayhike: data?.dayhike || "No",
      },
    },
  };
};

type Props = {
  id?: string;
  isNew: boolean;
  data: Hotspot;
  error?: string;
};

export default function Edit({ id, isNew, data, error }: Props) {
  const [saving, setSaving] = React.useState<boolean>(false);
  const aboutRef = React.useRef<any>();
  const birdsRef = React.useRef<any>();
  const tipsRef = React.useRef<any>();
  const hikesRef = React.useRef<any>();
  const secureFetch = useSecureFetch();

  const router = useRouter();
  const form = useForm<HotspotInputs>({ defaultValues: data });
  const isOH = data?.stateCode === "OH";

  const handleSubmit: SubmitHandler<HotspotInputs> = async (data) => {
    const state = getStateByCode(data?.stateCode);
    const county = getCountyByCode(data?.countyCode || "");

    if (!state || !county) {
      alert("Error getting state and county data");
      return;
    }

    setSaving(true);
    const url = `/${state?.slug}/${county?.slug}-county/${data?.slug}`;
    const json = await secureFetch(`/api/hotspot/${isNew ? "add" : "update"}`, "POST", {
      id,
      data: {
        ...data,
        url,
        parent: data.parentSelect?.value || null,
        multiCounties: null,
        iba: data.iba || null,
        about: aboutRef.current.getContent() || "",
        tips: tipsRef.current.getContent() || "",
        birds: birdsRef.current.getContent() || "",
        hikes: hikesRef.current.getContent() || "",
        restrooms: (data.restrooms as any)?.value || null,
        accessible: data.accessible && data.accessible?.length > 0 ? data.accessible : null,
        reviewed: true, //TODO: Remove after migration
      },
    });
    setSaving(false);
    if (json.success) {
      router.push(url);
    } else {
      console.error(json.error);
      alert("Error saving hotspot");
    }
  };

  const { address, lat, lng } = data || {};

  React.useEffect(() => {
    const geocodeAddress = async () => {
      const { road, city, state, zip } = await geocode(lat, lng);
      if (road) {
        form.setValue("address", `${road}\r\n${city}, ${state} ${zip}`);
        return;
      }
      if (city && state && zip) {
        form.setValue("address", `${city}, ${state} ${zip}`);
      }
    };
    if (!lat || !lng) return;
    if (isNew || !data?.address) geocodeAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, lat, lng]);

  const handleHikeBlur = () => {
    if (isNew && hikesRef.current.getContent()) {
      form.setValue("dayhike", "Yes");
    }
  };

  if (error) return <Error statusCode={404} title={error} />;

  return (
    <AdminPage title="Edit Hotspot">
      <div className="container pb-16 my-12">
        <Form form={form} onSubmit={handleSubmit}>
          <div className="max-w-2xl mx-auto">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <h2 className="text-xl font-bold text-gray-600 border-b pb-4">{data?.name}</h2>
              <Input type="hidden" name="slug" />

              <Field label="Address">
                <Textarea name="address" rows={2} />
              </Field>

              <Field label="Links">
                <InputLinks />
              </Field>

              <Field label="Tips for Birding">
                <div className="mt-1">
                  <Editor
                    id="tips-editor"
                    onInit={(e, editor) => (tipsRef.current = editor)}
                    initialValue={data?.tips}
                    init={tinyConfig}
                  />
                </div>
              </Field>

              <Field label="Birding Day Hike">
                <div className="mt-1">
                  <Editor
                    id="hikes-editor"
                    onInit={(e, editor) => (hikesRef.current = editor)}
                    initialValue={data?.hikes}
                    init={tinyConfig}
                    onBlur={handleHikeBlur}
                  />
                </div>
              </Field>

              <Field label="Birds of Interest">
                <div className="mt-1">
                  <Editor
                    id="birds-editor"
                    onInit={(e, editor) => (birdsRef.current = editor)}
                    initialValue={data?.birds}
                    init={tinyConfig}
                  />
                </div>
              </Field>

              <Field label="About this location">
                <div className="mt-1">
                  <Editor
                    id="about-editor"
                    onInit={(e, editor) => (aboutRef.current = editor)}
                    initialValue={data?.about}
                    init={tinyConfig}
                  />
                </div>
              </Field>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Parent Hotspot">
                  <HotspotSelect self={id} countyCode={data.countyCode || ""} name="parentSelect" isClearable />
                </Field>

                {isOH && (
                  <Field label="Important Bird Area">
                    <Select name="iba" options={ibaOptions} isClearable />
                  </Field>
                )}
              </div>
              <Field label="Restrooms">
                <Select name="restrooms" options={restroomOptions} isClearable />
              </Field>
              <CheckboxGroup name="accessible" label="Accessible Facilities" options={accessibleOptions} />
              <RadioGroup name="roadside" label="Roadside accessible" options={["Yes", "No", "Unknown"]} />
              <RadioGroup name="dayhike" label="Show in Day Hike index" options={["Yes", "No"]} />

              <Field label="Images">
                <ImagesInput />
              </Field>
            </div>
            <div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded">
              <Submit loading={saving} color="green" className="font-medium">
                Save Hotspot
              </Submit>
            </div>
          </div>
        </Form>
      </div>
    </AdminPage>
  );
}
