import * as React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Form from "components/Form";
import Submit from "components/Submit";
import FormError from "components/FormError";
import { Editor } from "@tinymce/tinymce-react";
import { getHotspotByLocationId } from "lib/mongo";
import { slugify, tinyMceOptions, geocode, getEbirdHotspot } from "lib/helpers";
import { getStateByCode, getCountyByCode } from "lib/localData";
import InputLinks from "components/InputLinks";
import Select from "components/Select";
import IBAs from "data/oh-iba.json";
import AdminPage from "components/AdminPage";
import { Hotspot, EbirdHotspot } from "lib/types";

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
				name: data?.name || ebirdData?.name,
				slug: data?.slug || slugify(ebirdData?.name),
				lat: data?.lat || ebirdData?.latitude,
				lng: data?.lng || ebirdData?.longitude,
				stateCode: data?.stateCode || ebirdData?.subnational1Code?.replace("US-", ""),
				countyCode: data?.countyCode || ebirdData?.subnational2Code,
				locationId: data?.locationId || ebirdData?.locationId,
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
	const locationId = router.query.locationId as string;
	const form = useForm<Hotspot>({ defaultValues: data });
	const isOH = data.stateCode === "OH";

	const handleSubmit: SubmitHandler<Hotspot> = async (data) => {
		const state = getStateByCode(data?.stateCode);
		const county = getCountyByCode(data?.countyCode);

		if (!state || !county) {
			alert("Error getting state and county data");
			return;
		}

		setSaving(true);
		console.log({
			id,
			data: {
				...data,
				iba: data.iba || null,
				about:  aboutRef.current.getContent(),
			}
		});
		const response = await fetch(`/api/hotspot/${isNew ? "add" : "update"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
				id,
				data: {
					...data,
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
		const fetchHotspotData = async () => {
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
		if (locationId) fetchHotspotData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locationId]);

	return (
		<AdminPage title="Edit Hotspot">
			<div className="container pb-16 my-12">
				<Form form={form} onSubmit={handleSubmit}>
					<div className="max-w-2xl mx-auto">
						<div className="px-4 py-5 bg-white space-y-6 sm:p-6">

							<h2 className="text-xl font-bold text-gray-600 border-b pb-4">{data?.name}</h2>
							<Input type="hidden" name="slug" />
							
							<div>
								<label className="text-gray-500 font-bold">
									Address<br/>
									<Input type="text" name="address.street" placeholder="Street" />
								</label>
								<div className="grid grid-cols-3 gap-4 mt-2">
									<div>
										<Input type="text" name="address.city" placeholder="City" required />
										<FormError name="address.city" />
									</div>
									<div>
										<Input type="text" name="address.state" placeholder="State" required />
										<FormError name="address.state" />
									</div>
									<div>
										<Input type="text" name="address.zip" placeholder="Zip" required />
										<FormError name="address.zip" />
									</div>
								</div>
							</div>

							<div>
								<label className="text-gray-500 font-bold">
									Parent Hotspot ID<br/>
									<Input type="text" name="parentId" />
									<span className="text-xs text-gray-500 font-normal">Example: L12345678</span>
								</label>
							</div>

							<div>
								<label className="text-gray-500 font-bold">Links</label>
								<InputLinks />
							</div>

							<div>
								<label className="text-gray-500 font-bold">
									About the location<br/>
									<div className="mt-1">
										<Editor id="about-editor" onInit={(e, editor) => aboutRef.current = editor} initialValue={data?.about} init={tinyMceOptions} />
									</div>
								</label>
							</div>

							{isOH &&
								<div>
									<label className="text-gray-500 font-bold">
										Important Bird Area<br/>
										<Select name="iba" options={ibaOptions} />
									</label>
								</div>
							}

							<div>
								<label className="text-gray-500 font-bold">
									Restrooms on site
								</label><br/>
								<div className="mt-1 flex gap-2">
									<label>
										<input {...form.register("restrooms")} type="radio" name="restrooms" value="Yes"/> Yes
									</label>
									<br/>
									<label>
										<input {...form.register("restrooms")} type="radio" name="restrooms" value="No"/> No
									</label>
									<br/>
									<label>
										<input {...form.register("restrooms")} type="radio" name="restrooms" value="Unknown"/> Unknown
									</label>
								</div>
							</div>

							<div>
								<label className="text-gray-500 font-bold">
									Accessible facilities
								</label><br/>
								<div className="mt-1 flex gap-2">
									<label>
										<input {...form.register("accessible")} type="radio" name="accessible" value="ADA"/> ADA
									</label>
									<br/>
									<label>
										<input {...form.register("accessible")} type="radio" name="accessible" value="Birdability"/> Birdability
									</label>
									<br/>
									<label>
										<input {...form.register("accessible")} type="radio" name="accessible" value="No"/> None
									</label>
									<br/>
									<label>
										<input {...form.register("accessible")} type="radio" name="accessible" value="Unknown"/> Unknown
									</label>
								</div>
							</div>

							<div>
								<label className="text-gray-500 font-bold">
									Roadside accessible
								</label><br/>
								<div className="mt-1 flex gap-2">
									<label>
										<input {...form.register("roadside")} type="radio" name="roadside" value="Yes"/> Yes
									</label>
									<br/>
									<label>
										<input {...form.register("roadside")} type="radio" name="roadside" value="No"/> No
									</label>
									<br/>
									<label>
										<input {...form.register("roadside")} type="radio" name="roadside" value="Unknown"/> Unknown
									</label>
								</div>
							</div>

							<div>
								<label className="text-gray-500 font-bold">
									Day Hike
								</label><br/>
								<div className="mt-1 flex gap-2">
									<label>
										<input {...form.register("dayhike")} type="radio" name="dayhike" value="Yes"/> Yes
									</label>
									<br/>
									<label>
										<input {...form.register("dayhike")} type="radio" name="dayhike" value="No"/> No
									</label>
								</div>
							</div>

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
