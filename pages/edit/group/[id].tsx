import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Form from "components/Form";
import Submit from "components/Submit";
import { Editor } from "@tinymce/tinymce-react";
import { getHotspotById } from "lib/mongo";
import { slugify, tinyMceOptions } from "lib/helpers";
import { getStateByCode, getCountyByCode } from "lib/localData";
import InputLinks from "components/InputLinks";
import Select from "components/Select";
import IBAs from "data/oh-iba.json";
import AdminPage from "components/AdminPage";
import { Hotspot } from "lib/types";
import RadioGroup from "components/RadioGroup";
import Field from "components/Field";
import CountySelect from "components/CountySelect";
import FormError from "components/FormError";
import useSecureFetch from "hooks/useSecureFetch";

const ibaOptions = IBAs.map(({ slug, name }) => ({ value: slug, label: name }));

interface Params extends ParsedUrlQuery {
	id: string,
	state?: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { id, state } = query as Params;
	const isNew = id === "new";
	
	const data = isNew ? null : await getHotspotById(id);
	const stateCode = data?.stateCode || `US-${state?.replace("US-", "")}`;

	return {
    props: {
			id: data?._id || null,
			isNew: !data,
			data: {
				...data,
				name: data?.name || "",
				slug: data?.slug || "",
				stateCode: data?.stateCode || stateCode,
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
	stateCode: string,
}

export default function Edit({ id, isNew, data, stateCode }: Props) {
	const [saving, setSaving] = React.useState<boolean>(false);
	const aboutRef = React.useRef<any>();
	const secureFetch = useSecureFetch();

	const router = useRouter();
	const form = useForm<Hotspot>({ defaultValues: data });
	const isOH = data.stateCode === "US-OH";

	const handleSubmit: SubmitHandler<Hotspot> = async (data) => {
		const state = getStateByCode(data?.stateCode);

		if (!state || !data?.multiCounties?.length) {
			alert("Missing state and/or counties");
			return;
		}

		setSaving(true);
		const slug =  data.slug || slugify(data.name);
		const url = `/birding-in-${state?.slug}/group/${slug}`;
		const json = await secureFetch(`/api/hotspot/${isNew ? "add" : "update"}`, "POST", {
			id,
			data: {
				...data,
				parentId: null,
				countyCode: null,
				iba: data.iba || null,
				slug,
				url,
				about:  aboutRef.current.getContent() || "",
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

	return (
		<AdminPage title="Edit Hotspot">
			<div className="container pb-16 my-12">
				<Form form={form} onSubmit={handleSubmit}>
					<div className="max-w-2xl mx-auto">
						<div className="px-4 py-5 bg-white space-y-6 sm:p-6">

							<h2 className="text-xl font-bold text-gray-600 border-b pb-4">Add Group Hotspot</h2>

							<div>
								<label className="text-gray-500 font-bold">
									Name<br/>
									<Input type="text" name="name" required />
								</label>
								<FormError name="name" />
							</div>

							<Input type="hidden" name="slug" />

							<Field label="Links">
								<InputLinks />
							</Field>

							<Field label="About the location">
								<div className="mt-1">
									<Editor id="about-editor" onInit={(e, editor) => aboutRef.current = editor} initialValue={data?.about} init={tinyMceOptions} />
								</div>
							</Field>

							<Field label="Counties">
								<CountySelect name="multiCounties" stateCode={stateCode} isMulti required />
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
