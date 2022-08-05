import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Textarea from "components/Textarea";
import Form from "components/Form";
import Submit from "components/Submit";
import { getHotspotById, getChildHotspots } from "lib/mongo";
import { slugify, geocode, accessibleOptions, restroomOptions, formatMarkerArray } from "lib/helpers";
import { getStateByCode } from "lib/localData";
import InputLinks from "components/InputLinks";
import Select from "components/Select";
import IBAs from "data/oh-iba.json";
import AdminPage from "components/AdminPage";
import { Hotspot, State } from "lib/types";
import RadioGroup from "components/RadioGroup";
import CheckboxGroup from "components/CheckboxGroup";
import Field from "components/Field";
import CountySelect from "components/CountySelect";
import FormError from "components/FormError";
import useSecureFetch from "hooks/useSecureFetch";
import ImagesInput from "components/ImagesInput";
import Map from "components/Map";
import TinyMCE from "components/TinyMCE";
import MapZoomInput from "components/MapZoomInput";

const ibaOptions = IBAs.map(({ slug, name }) => ({ value: slug, label: name }));

interface Params extends ParsedUrlQuery {
  id: string;
  state?: string;
}

const getChildren = async (id: string) => {
  if (!id) return null;
  const data = await getChildHotspots(id);
  return data || [];
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id, state: stateParam, country: countryParam } = query as Params;
  const isNew = id === "new";

  const data = isNew ? null : await getHotspotById(id);

  const countryCode = data?.countryCode || (countryParam as string)?.toUpperCase();
  const stateCode = data?.stateCode || stateParam;
  const state = getStateByCode(stateCode);

  const childLocations = data?._id ? await getChildren(data._id) : [];

  return {
    props: {
      id: data?._id || null,
      isNew: !data,
      state,
      childLocations,
      data: {
        ...data,
        countryCode,
        name: data?.name || "",
        slug: data?.slug || "",
        multiCounties: data?.multiCounties || [],
        roadside: data?.roadside || "Unknown",
        restrooms: restroomOptions.find((it) => it.value === data?.restrooms) || null,
        accessible: data?.accessible || null,
        dayhike: data?.dayhike || "No",
        zoom: data?.zoom || 14,
      },
    },
  };
};

type Props = {
  id?: string;
  isNew: boolean;
  data: Hotspot;
  state: State;
  childLocations: Hotspot[];
};

export default function Edit({ id, isNew, data, state, childLocations }: Props) {
  const [saving, setSaving] = React.useState<boolean>(false);
  const [isGeocoded, setIsGeocoded] = React.useState(false);
  const secureFetch = useSecureFetch();

  const router = useRouter();
  const form = useForm<Hotspot>({ defaultValues: data });
  const isOH = data.stateCode === "OH";

  const latValue = form.watch("lat");
  const lngValue = form.watch("lng");
  const markers = formatMarkerArray({ ...data, lat: latValue, lng: lngValue }, childLocations);

  const handleSubmit: SubmitHandler<Hotspot> = async (formData) => {
    if (!state || !formData?.multiCounties?.length) {
      alert("Missing state and/or counties");
      return;
    }

    setSaving(true);
    const nameChanged = formData?.name && formData?.name !== data.name;
    let slug = formData?.slug || null;
    if (!slug || nameChanged) {
      slug = slugify(formData.name);
    }

    const json = await secureFetch(`/api/hotspot/${isNew ? "add" : "update"}`, "POST", {
      id,
      data: {
        ...formData,
        stateCode: state.code,
        parent: null,
        countyCode: null,
        iba: formData.iba || null,
        slug,
        restrooms: (formData.restrooms as any)?.value || null,
        accessible: formData.accessible && formData.accessible?.length > 0 ? formData.accessible : null,
        isGroup: true,
        reviewed: true, //TODO: Remove after migration
      },
    });
    if (json.success) {
      router.push(json.url);
    } else {
      setSaving(false);
      console.error(json.error);
      alert("Error saving hotspot");
    }
  };

  const address = form.watch("address");
  const lat = form.watch("lat");
  const lng = form.watch("lng");

  const geocodeCoorinates = async (lat: number, lng: number) => {
    if (address) return;
    const { road, city, state, zip } = await geocode(lat, lng);
    if (road) {
      form.setValue("address", `${road}\r\n${city}, ${state} ${zip}`);
      setIsGeocoded(true);
      return;
    }
    if (city && state && zip) {
      form.setValue("address", `${city}, ${state} ${zip}`);
      setIsGeocoded(true);
    }
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = Number(e.target.value);
    if (lat && lng) {
      geocodeCoorinates(lat, lng);
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = Number(e.target.value);
    if (lat && lng) {
      geocodeCoorinates(lat, lng);
    }
  };

  const handleHikeBlur = () => {
    const value = form.getValues("hikes");
    if (isNew && value) {
      form.setValue("dayhike", "Yes");
    }
  };

  return (
    <AdminPage title="Edit Hotspot">
      <div className="container pb-16 my-12">
        <h2 className="text-xl font-bold text-gray-600 border-b pb-4">Add Group Hotspot</h2>
        <Form form={form} onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="pt-5 bg-white space-y-6 flex-1">
              <Field label="Name">
                <Input type="text" name="name" required />
                <FormError name="name" />
              </Field>

              <Input type="hidden" name="slug" />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Latitude">
                  <Input type="text" name="lat" onChange={handleLatChange} />
                </Field>
                <Field label="Longitude">
                  <Input type="text" name="lng" onChange={handleLngChange} />
                </Field>
              </div>

              <Field label="Address">
                <Textarea name="address" rows={2} />
                {isGeocoded && (
                  <small>
                    <span className="text-orange-700">Note</span>: Address is estimated, confirm it is correct.
                  </small>
                )}
              </Field>

              <InputLinks />

              <Field label="Tips for Birding">
                <TinyMCE name="tips" defaultValue={data?.tips} />
              </Field>

              <Field label="Birds of Interest">
                <TinyMCE name="birds" defaultValue={data?.birds} />
              </Field>

              <Field label="About this location">
                <TinyMCE name="about" defaultValue={data?.about} />
              </Field>

              <Field label="Birding Day Hike">
                <TinyMCE name="hikes" defaultValue={data?.hikes} onBlur={handleHikeBlur} />
              </Field>

              <Field label="Counties">
                <CountySelect name="multiCounties" stateCode={state.code} isMulti required />
                <FormError name="multiCounties" />
              </Field>

              {isOH && (
                <Field label="Important Bird Area">
                  <Select name="iba" options={ibaOptions} isClearable />
                </Field>
              )}

              <Field label="Images">
                <ImagesInput />
              </Field>
              <div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded hidden md:block">
                <Submit loading={saving} color="green" className="font-medium">
                  Save Hotspot
                </Submit>
              </div>
            </div>

            <aside className="px-4 md:mt-12 pb-5 pt-3 rounded bg-gray-100 md:w-[350px] space-y-6">
              <Field label="Restrooms">
                <Select name="restrooms" options={restroomOptions} isClearable />
              </Field>
              <CheckboxGroup name="accessible" label="Accessible Facilities" options={accessibleOptions} />
              <RadioGroup name="roadside" label="Roadside accessible" options={["Yes", "No", "Unknown"]} />
              <RadioGroup name="dayhike" label="Show in Day Hike index" options={["Yes", "No"]} />
              {markers.length > 0 && (
                <div className="flex-1">
                  <label className="text-gray-500 font-bold mb-1 block">Hotspot Map</label>
                  <MapZoomInput markers={markers} />
                </div>
              )}
            </aside>
          </div>
          <div className="px-4 py-3 bg-gray-100 text-right rounded mt-4 md:hidden">
            <Submit loading={saving} color="green" className="font-medium">
              Save Hotspot
            </Submit>
          </div>
        </Form>
      </div>
    </AdminPage>
  );
}
