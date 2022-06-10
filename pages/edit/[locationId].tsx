import * as React from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Form from "components/Form";
import Submit from "components/Submit";
import FormError from "components/FormError";
import { Editor } from "@tinymce/tinymce-react";
import { getHotspotByLocationId } from "lib/firebase";
import { slugify, tinyMceOptions, geocode } from "lib/helpers";
import { getStateByCode } from "lib/localData";
import InputLinks from "components/InputLinks";
import Select from "components/Select";
import IBAs from "data/oh-iba.json";

type Hotspot = {
	locationId: string,
	name: string,
	latitude: number,
	longitude: number,
	subnational1Code: string,
	subnational2Code: string,
	subnational2Name: string,
}

type Inputs = {
	tips: {
		text: string,
		source: string,
		link: string,	
	},
	about: {
		text: string,
		source: string,
		link: string,
	},
	address: {
		street: string,
		city: string,
		state: string,
		zip: string,
	},
	links: {
		label: string,
		url: string,
	}[],
	restrooms: string,
	roadside: string,
	accessible: string,
	dayhike: string,
	slug: string,
	parentId: string,
	iba: {
		value: string,
		label: string,
	},
};

const ibaOptions = IBAs.map(({ slug, name }) => ({ value: slug, label: name }));

export default function Edit() {
	const [hotspot, setHotspot] = React.useState<Hotspot>();
	const [saving, setSaving] = React.useState<boolean>(false);
	const [initialTips, setInitialTips] = React.useState<string>();
	const [initialAbout, setInitialAbout] = React.useState<string>();
	const aboutRef = React.useRef<any>();
	const tipsRef = React.useRef<any>();

	const router = useRouter();
	const locationId = router.query.locationId as string;
	const form = useForm<Inputs>({
		defaultValues: {
			roadside: "Unknown",
			restrooms: "Unknown",
			accessible: "Unknown",
			dayhike: "No",
		}
	});
	const { name, latitude, longitude, subnational1Code, subnational2Code, subnational2Name } = hotspot || {};
	const isOH = subnational1Code === "OH";

	const handleSubmit: SubmitHandler<Inputs> = async (data) => {
		setSaving(true);
		const slug = data.slug || slugify(name);
		const countySlug = slugify(subnational2Name);
		const response = await fetch("/api/hotspot/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
				...data,
				locationId,
				name,
				slug,
				stateCode: subnational1Code,
				countyCode: subnational2Code,
				countySlug: countySlug,
				lat: latitude,
				lng: longitude,
				iba: data.iba || null,
				tips: {
					...data.tips,
					text: tipsRef.current.getContent(),
				},
				about: {
					...data.about,
					text: aboutRef.current.getContent(),
				},
			}),
    });
		setSaving(false);
		const json = await response.json();
		if (json.success) {
			const state = subnational1Code ? getStateByCode(subnational1Code.replace("US-", "")) : null;
			router.push(`/birding-in-${state?.slug}/${countySlug}-county/${slug}`);
		} else {
			console.error(json.error);
			alert("Error saving hotspot");
		}
	}

	React.useEffect(() => {
		const fetchHotspotData = async () => {
			const key = process.env.NEXT_PUBLIC_EBIRD_API;
			const response = await fetch(`https://api.ebird.org/v2/ref/hotspot/info/${locationId}?key=${key}`);
			const data = await response.json();
			setHotspot(data);

			const hotspotData = await getHotspotByLocationId(locationId);
			if (hotspotData) {
				form.reset(hotspotData, { keepDefaultValues: true });
				setInitialTips(hotspotData.tips);
				setInitialAbout(hotspotData.about.text);
			}
			if (!hotspotData || !hotspotData.address.city || !hotspotData.address.state || !hotspotData.address.zip) {
				const { road, city, state, zip } = await geocode(data.latitude, data.longitude);
				form.setValue("address.city", city || "");
				form.setValue("address.state", state || "");
				form.setValue("address.zip", zip || "");
				if (!hotspotData) {
					form.setValue("address.street", road || "");
				}
			}
		}
		if (locationId) fetchHotspotData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locationId]);

	return (
		<div className="container pb-16 my-12">
			<Form form={form} onSubmit={handleSubmit}>
				<div className="max-w-2xl mx-auto">
					<div className="px-4 py-5 bg-white space-y-6 sm:p-6">

						<h2 className="text-xl font-bold text-gray-600 border-b pb-4">{name}</h2>
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
								Tips for birding<br/>
								<div className="mt-1">
									<Editor id="tips-editor" onInit={(e, editor) => tipsRef.current = editor} initialValue={initialTips} init={tinyMceOptions} />
								</div>
							</label>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<Input type="text" name="tips.source" placeholder="Source Title" className="text-sm"/>
								<Input type="text" name="tips.link" placeholder="Source URL" className="text-sm"/>
							</div>
						</div>

						<div>
							<label className="text-gray-500 font-bold">
								About the location<br/>
								<div className="mt-1">
									<Editor id="about-editor" onInit={(e, editor) => aboutRef.current = editor} initialValue={initialAbout} init={tinyMceOptions} />
								</div>
							</label>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<Input type="text" name="about.source" placeholder="Source Title" className="text-sm"/>
								<Input type="text" name="about.link" placeholder="Source URL" className="text-sm"/>
							</div>
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
	)
}
