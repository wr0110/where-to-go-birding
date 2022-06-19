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
import { getHotspotById } from "lib/mongo";
import { slugify, geocode, tinyMceOptions } from "lib/helpers";
import { getStateByCode } from "lib/localData";
import InputLinks from "components/InputLinks";
import Select from "components/Select";
import IBAs from "data/oh-iba.json";
import AdminPage from "components/AdminPage";
import { Hotspot, State } from "lib/types";
import RadioGroup from "components/RadioGroup";
import Field from "components/Field";
import CountySelect from "components/CountySelect";
import FormError from "components/FormError";
import useSecureFetch from "hooks/useSecureFetch";
import ImagesInput from "components/ImagesInput";

const ibaOptions = IBAs.map(({ slug, name }) => ({ value: slug, label: name }));

interface Params extends ParsedUrlQuery {
	id: string,
	state?: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { id, state: stateParam } = query as Params;
	const isNew = id === "new";
	
	const data = isNew ? null : await getHotspotById(id);

	const stateCode = data?.stateCode || stateParam;
	const state = getStateByCode(stateCode);

	return {
    props: {
			id: data?._id || null,
			isNew: !data,
			state,
			data: {
				...data,
				name: data?.name || "",
				slug: data?.slug || "",
				multiCounties: data?.multiCounties || [],
				roadside: data?.roadside || "Unknown",
				restrooms: data?.restrooms || "Unknown",
				accessible: data?.accessible || "Unknown",
				dayhike: data?.dayhike || "No",
			},
			stateCode,
		},
  }
}

type Props = {
	id?: string,
	isNew: boolean,
	data: Hotspot,
	state: State,
}

export default function Edit({ id, isNew, data, state }: Props) {
	const [saving, setSaving] = React.useState<boolean>(false);
	const aboutRef = React.useRef<any>();
	const birdsRef = React.useRef<any>();
	const tipsRef = React.useRef<any>();
	const secureFetch = useSecureFetch();

	const router = useRouter();
	const form = useForm<Hotspot>({ defaultValues: data });
	const isOH = data.stateCode === "OH";

	const handleSubmit: SubmitHandler<Hotspot> = async (formData) => {
		if (!state || !formData?.multiCounties?.length) {
			alert("Missing state and/or counties");
			return;
		}

		setSaving(true);
		const nameChanged =  formData?.name && formData?.name !== data.name;
		let slug = formData?.slug || null;
		if (!slug || nameChanged) {
			slug = slugify(formData.name);
		}

		const url = `/birding-in-${state?.slug}/group/${slug}`;
		const json = await secureFetch(`/api/hotspot/${isNew ? "add" : "update"}`, "POST", {
			id,
			data: {
				...formData,
				stateCode: state.code,
				parent: null,
				countyCode: null,
				iba: data.iba || null,
				slug,
				url,
				about: aboutRef.current.getContent() || "",
				tips: tipsRef.current.getContent() || "",
				birds: birdsRef.current.getContent() || "",
			}
    });
		setSaving(false);
		if (json.success) {
			router.push(url);
		} else {
			console.error(json.error);
			alert("Error saving hotspot");
		}
	}

	const address = form.watch("address");
	const lat = form.watch("lat");
	const lng = form.watch("lng");

	const geocodeCoorinates = async (lat: number, lng: number) => {
		if (address) return;
		const { road, city, state, zip } = await geocode(lat, lng);
		if (road) {
			form.setValue("address", `${road}\r\n${city}, ${state} ${zip}`);
			return;
		}
		if (city && state && zip) {
			form.setValue("address", `${city}, ${state} ${zip}`);
		}
	}

	const handleLatChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
		const lat = Number(e.target.value);
		if (lat && lng) {
			geocodeCoorinates(lat, lng);
		}
	}

	const handleLngChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
		const lng = Number(e.target.value);
		if (lat && lng) {
			geocodeCoorinates(lat, lng);
		}
	}

	return (
		<AdminPage title="Edit Hotspot">
			<div className="container pb-16 my-12">
				<Form form={form} onSubmit={handleSubmit}>
					<div className="max-w-2xl mx-auto">
						<div className="px-4 py-5 bg-white space-y-6 sm:p-6">

							<h2 className="text-xl font-bold text-gray-600 border-b pb-4">Add Group Hotspot</h2>

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
							</Field>

							<Field label="Links">
								<InputLinks />
							</Field>

							<Field label="Tips for Birding">
								<div className="mt-1">
									<Editor id="tips-editor" onInit={(e, editor) => tipsRef.current = editor} initialValue={data?.tips} init={tinyMceOptions} />
								</div>
							</Field>

							<Field label="Birds of Interest">
								<div className="mt-1">
									<Editor id="birds-editor" onInit={(e, editor) => birdsRef.current = editor} initialValue={data?.birds} init={tinyMceOptions} />
								</div>
							</Field>

							<Field label="About this location">
								<div className="mt-1">
									<Editor id="about-editor" onInit={(e, editor) => aboutRef.current = editor} initialValue={data?.about} init={tinyMceOptions} />
								</div>
							</Field>

							<Field label="Counties">
								<CountySelect name="multiCounties" stateCode={state.code} isMulti required />
								<FormError name="multiCounties" />
							</Field>

							{isOH &&
								<Field label="Important Bird Area">
									<Select name="iba" options={ibaOptions} isClearable />
								</Field>
							}

							<RadioGroup name="restrooms" label="Restrooms on site" options={["Yes", "No", "Unknown"]} />
							<RadioGroup name="accessible" label="Accessible facilities" options={["ADA", "Birdability", "No", "Unknown"]} />
							<RadioGroup name="roadside" label="Roadside accessible" options={["Yes", "No", "Unknown"]} />
							<RadioGroup name="dayhike" label="Day Hike" options={["Yes", "No"]} />

							<Field label="Images">
								<ImagesInput />
							</Field>

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
