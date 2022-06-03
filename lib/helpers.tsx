import Geocode from "react-geocode";
import States from "data/states.json";

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

export async function geocode(lat: number, lng: number) {
	console.log("Geocoding", lat, lng);
	Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_KEY);
	Geocode.setRegion("us");
	Geocode.setLocationType("ROOFTOP");
	const response = await Geocode.fromLatLng(lat, lng);
	
	let city: string, state: string, zip:string, road: string;
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

export function getState(param: string) {
	const slug = param.replace("birding-in-", "");
	const data = States.find(state => state.slug === slug);
	return data;
}

export function formatCountyArray(countyObject: object) {
	if (!countyObject) return null;
	return Object.entries(countyObject).map(([key, value]) => ({
		slug: key,
		ebirdCode: value[1],
		name: capitalize(key.replace("-", " ")),
		active: value[2],
	}))
}