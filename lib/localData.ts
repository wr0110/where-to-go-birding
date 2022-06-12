import States from "data/states.json";
import StateLinks from "data/state-links.json";
import OhioRegions from "data/oh-regions.json";
import ArizonaCounties from "data/az-counties.json";
import OhioCounties from "data/oh-counties.json";
import { capitalize } from "./helpers";
import { County, StateLinks as StateLinksType } from "lib/types";

const countyArrays: any = {
	"OH": OhioCounties,
	"AZ": ArizonaCounties,
}

type StateLinksMap = {
	[x:string]: StateLinksType,
}

export function getStateLinks(code: string) {
	const map = StateLinks as StateLinksMap;
	return map[code] || [];
}

export function getState(param: string) {
	const slug = param.replace("birding-in-", "");
	const data = States.find(state => state.slug === slug);
	return data;
}

export function getStateByCode(code: string) {
	code = code.replace("US-", "");
	const data = States.find(state => state.code === code);
	return data;
}

export function getCountyByCode(code: string) {
	const stateCode = code.split("-")[1];
	const array = countyArrays[stateCode];
	if (!array) return null;
	const county = array.find((county: County) => county.ebirdCode === code);
	if (!county) return null;

	return formatCounty(stateCode, county);
}

export function getCountyBySlug(stateCode: string, countySlug: string) {
	const slug = countySlug.replace("-county", "");
	const array = countyArrays[stateCode];
	if (!array) return null;
	const county = array.find((county: County) => county.slug === slug);
	if (!county) return null;
	
	return formatCounty(stateCode, county);
}

function formatCounty(stateCode: string, county: County) {
	const { region: regionCode, ebirdCode, slug } = county;
	const region = (regionCode && stateCode === "OH") ? (OhioRegions as any)[regionCode] : {};
	return {
		slug,
		name: capitalize(slug.replaceAll("-", " ")),
		region: region || null,
		ebirdCode,
		regionLabel: region?.label || null,
		color: region?.color || "#4a84b2",
	}
}

export function getCounties(stateCode: string) {
	return formatCountyArray(countyArrays[stateCode]);
}

export function formatCountyArray(counties: County[]) {
	if (!counties) return null;
	return counties.map(county => ({
		...county,
		name: capitalize(county.slug.replaceAll("-", " ")),
	}))
}