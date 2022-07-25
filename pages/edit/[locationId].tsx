import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Textarea from "components/Textarea";
import Form from "components/Form";
import Submit from "components/Submit";
import Range from "components/Range";
import { getHotspotByLocationId, getHotspotById } from "lib/mongo";
import { slugify, geocode, getEbirdHotspot, accessibleOptions, restroomOptions } from "lib/helpers";
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
import ParentHotspotSelect from "components/ParentHotspotSelect";
import Error from "next/error";
import ImagesInput from "components/ImagesInput";
import Map from "components/Map";
import TinyMCE from "components/TinyMCE";

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
        zoom: data?.zoom || 15,
        countryCode: ebirdData?.subnational1Code?.split("-")?.[0] || data?.countryCode,
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
  const [isGeocoded, setIsGeocoded] = React.useState(false);
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
    const json = await secureFetch(`/api/hotspot/${isNew ? "add" : "update"}`, "POST", {
      id,
      data: {
        ...data,
        parent: data.parentSelect?.value || null,
        multiCounties: null,
        iba: data.iba || null,
        restrooms: (data.restrooms as any)?.value || null,
        accessible: data.accessible && data.accessible?.length > 0 ? data.accessible : null,
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

  const zoom = form.watch("zoom");
  const { address, lat, lng } = data || {};

  React.useEffect(() => {
    const geocodeAddress = async () => {
      const { road, city, state, zip } = await geocode(lat, lng);
      if (road) {
        setIsGeocoded(true);
        form.setValue("address", `${road}\r\n${city}, ${state} ${zip}`);
        return;
      }
      if (city && state && zip) {
        form.setValue("address", `${city}, ${state} ${zip}`);
        setIsGeocoded(true);
      }
    };
    if (!lat || !lng) return;
    if (isNew || !data?.address) geocodeAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, lat, lng]);

  const handleHikeBlur = () => {
    const value = form.getValues("hikes");
    if (isNew && value) {
      form.setValue("dayhike", "Yes");
    }
  };

  if (error) return <Error statusCode={404} title={error} />;

  return (
    <AdminPage title="Edit Hotspot">
      <div className="container pb-16 my-12">
        <h2 className="text-xl font-bold text-gray-600 border-b pb-4">{data?.name}</h2>
        <Form form={form} onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="pt-5 bg-white space-y-6 flex-1">
              <Input type="hidden" name="slug" />
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

              <Field label="Birding Day Hike">
                <TinyMCE name="hikes" defaultValue={data?.hikes} onBlur={handleHikeBlur} />
              </Field>

              <Field label="Birds of Interest">
                <TinyMCE name="birds" defaultValue={data?.birds} />
              </Field>

              <Field label="About this location">
                <TinyMCE name="about" defaultValue={data?.about} />
              </Field>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Parent Hotspot">
                  <ParentHotspotSelect self={id} countyCode={data.countyCode || ""} name="parentSelect" isClearable />
                </Field>

                {isOH && (
                  <Field label="Important Bird Area">
                    <Select name="iba" options={ibaOptions} isClearable />
                  </Field>
                )}
              </div>

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
              <Field label="Map Zoom">
                <div className="flex gap-2">
                  <Range name="zoom" min={7} max={17} step={1} />
                  {zoom}
                </div>
                <div className="relative aspect-[4/3.5]">
                  <Map
                    lat={lat}
                    lng={lng}
                    zoom={zoom}
                    className="pointer-events-none scale-[.6] sm:scale-100 md:scale-[.6] sm:w-full md:w-[167%] w-[167%] origin-top-left absolute top-0 left-0"
                  />
                </div>
              </Field>
              <Field label="Restrooms">
                <Select name="restrooms" options={restroomOptions} isClearable />
              </Field>
              <CheckboxGroup name="accessible" label="Accessible Facilities" options={accessibleOptions} />
              <RadioGroup name="roadside" label="Roadside accessible" options={["Yes", "No", "Unknown"]} />
              <RadioGroup name="dayhike" label="Show in Day Hike index" options={["Yes", "No"]} />
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
