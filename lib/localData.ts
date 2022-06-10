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
	const data = States.find(state => state.code === code);
	return data;
}

export function getCounty(stateCode: string, countySlug: string) {
	const slug = countySlug.replace("-county", "");
	const array = countyArrays[stateCode];
	if (!array) return {}
	const county = array.find((county: any) => county.slug === slug);
	if (!county) return {}
	const { region: regionCode, ebirdCode } = county;
	const region = stateCode === "OH" ? (OhioRegions as any)[regionCode] : {};
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