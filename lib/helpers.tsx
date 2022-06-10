import Geocode from "react-geocode";
import { Hotspot } from "lib/types";

export function slugify(title?: string) {
	if (!title) return null;
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const tinyMceOptions = {
	height: 250,
	menubar: false,
	plugins: "link",
	toolbar: "bold italic underline | link",
	content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
	branding: false,
	elementpath: false,
}

export function capitalize(str: string) {
	if (typeof str !== "string") return str;
	const words = str.split(" ");
	for (let i = 0; i < words.length; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].substr(1);
	}

	return words.join(" ");
}

type HotspotMap = {
	[x:string]: {
		name: string,
		slug: string,
	}[]
}

export function restructureHotspotsByCounty(hotspots: Hotspot[]) {
	let counties: HotspotMap = {}
	hotspots.forEach(({countySlug, slug, name}) => {
		if (!countySlug) return;
		if (!counties[countySlug]) {
			counties[countySlug] = []
		}
		counties[countySlug].push({ name, slug });
	});

	return Object.entries(counties).map(([key, hotspots]) => ({
		countySlug: key,
		countyName: capitalize(key.replaceAll("-", " ")),
		hotspots,
	}));
}

export async function geocode(lat: number, lng: number) {
	console.log("Geocoding", lat, lng);
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_KEY;
	if (!apiKey) return {};
	Geocode.setApiKey(apiKey);
	Geocode.setRegion("us");
	// @ts-expect-error
	Geocode.setLocationType("ROOFTOP");
	const response = await Geocode.fromLatLng(lat.toString(), lng.toString());
	
	let city = "";
	let state = "";
	let zip = "";
	let road = "";
	for (let i = 0; i < response.results[0].address_components.length; i++) {
		for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
			switch (response.results[0].address_components[i].types[j]) {
				case "locality":
					city = response.results[0].address_components[i].long_name;
					break;
				case "administrative_area_level_1":
					state = response.results[0].address_components[i].long_name;
					break;
				case "postal_code":
					zip = response.results[0].address_components[i].long_name;
					break;
				case "route":
					road = response.results[0].address_components[i].long_name;
					break;
			}
		}
	}
	return { road, city, state, zip };
}