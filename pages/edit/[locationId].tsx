import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Form from "components/Form";
import Submit from "components/Submit";
import { Editor } from "@tinymce/tinymce-react";
import { getHotspotByLocationId } from "lib/mongo";
import { slugify, tinyMceOptions, geocode, getEbirdHotspot } from "lib/helpers";
import { getStateByCode, getCountyByCode } from "lib/localData";
import InputLinks from "components/InputLinks";
import Select from "components/Select";
import IBAs from "data/oh-iba.json";
import AdminPage from "components/AdminPage";
import { Hotspot, EbirdHotspot } from "lib/types";
import RadioGroup from "components/RadioGroup";
import Field from "components/Field";
import AddressInput from "components/AddressInput";

const ibaOptions = IBAs.map(({ slug, name }) => ({ value: slug, label: name }));

interface Params extends ParsedUrlQuery {
	locationId: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { locationId } = query as Params;
	const data = await getHotspotByLocationId(locationId);
	const ebirdData: EbirdHotspot = await getEbirdHotspot(locationId);
	return {
    props: {
			id: data?._id,
			isNew: !data,
			data: {
				...data,
				name: ebirdData?.name || data?.name,
				slug: data?.slug || slugify(ebirdData?.name),
				lat: ebirdData?.latitude ||  data?.lat,
				lng: ebirdData?.longitude || data?.lng,
				stateCode: data?.stateCode || ebirdData?.subnational1Code,
				countyCode: data?.countyCode || ebirdData?.subnational2Code,
				locationId: locationId,
				roadside: data?.roadside || "Unknown",
				restrooms: data?.restrooms || "Unknown",
				accessible: data?.accessible || "Unknown",
				dayhike: data?.dayhike || "No",
			}
		},
  }
}

type Props = {
	id?: string,
	isNew: boolean,
	data: Hotspot,
}

export default function Edit({ id, isNew, data }: Props) {
	const [saving, setSaving] = React.useState<boolean>(false);
	const aboutRef = React.useRef<any>();

	const router = useRouter();
	const form = useForm<Hotspot>({ defaultValues: data });
	const isOH = data.stateCode === "US-OH";

	const handleSubmit: SubmitHandler<Hotspot> = async (data) => {
		const state = getStateByCode(data?.stateCode);
		const county = getCountyByCode(data?.countyCode || "");

		if (!state || !county) {
			alert("Error getting state and county data");
			return;
		}

		setSaving(true);
		const url = `/birding-in-${state?.slug}/${county?.slug}-county/${data?.slug}`;
		const response = await fetch(`/api/hotspot/${isNew ? "add" : "update"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
				id,
				data: {
					...data,
					url,
					multiCounties: null,
					iba: data.iba || null,
					about:  aboutRef.current.getContent(),
				}
			}),
    });
		setSaving(false);
		const json = await response.json();
		if (json.success) {
			router.push(data.url);
		} else {
			console.error(json.error);
			alert("Error saving hotspot");
		}
	}

	React.useEffect(() => {
		const geocodeAddress = async () => {
			if (isNew || !data?.address?.city || !data?.address?.state || !data?.address?.zip) {
				const { road, city, state, zip } = await geocode(data?.lat, data?.lng);
				form.setValue("address.city", city || "");
				form.setValue("address.state", state || "");
				form.setValue("address.zip", zip || "");
				if (isNew) {
					form.setValue("address.street", road || "");
				}
			}
		}
		geocodeAddress();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AdminPage title="Edit Hotspot">
			<div className="container pb-16 my-12">
				<Form form={form} onSubmit={handleSubmit}>
					<div className="max-w-2xl mx-auto">
						<div className="px-4 py-5 bg-white space-y-6 sm:p-6">

							<h2 className="text-xl font-bold text-gray-600 border-b pb-4">{data?.name}</h2>
							<Input type="hidden" name="slug" />
							
							<AddressInput />

							<Field label="Parent Hotspot ID">
								<Input type="text" name="parentId" />
								<span className="text-xs text-gray-500 font-normal">Example: L12345678</span>
							</Field>

							<Field label="Links">
								<InputLinks />
							</Field>

							<Field label="About the location">
								<div className="mt-1">
									<Editor id="about-editor" onInit={(e, editor) => aboutRef.current = editor} initialValue={data?.about} init={tinyMceOptions} />
								</div>
							</Field>

							{isOH &&
								<Field label="Important Bird Area">
									<Select name="iba" options={ibaOptions} />
								</Field>
							}

							<RadioGroup name="restrooms" label="Restrooms on site" options={["Yes", "No", "Unknown"]} />
							<RadioGroup name="accessible" label="Accessible facilities" options={["ADA", "Birdability", "No", "Unknown"]} />
							<RadioGroup name="roadside" label="Roadside accessible" options={["Yes", "No", "Unknown"]} />
							<RadioGroup name="dayhike" label="Day Hike" options={["Yes", "No"]} />

						</div>
						<div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded">
							<Submit loading={saving} color="green" className="font-medium">Save Hotspot</Submit>	
						</div>
					</div>
				</Form>
			</div>
		</AdminPage>
	)
}
