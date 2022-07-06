import States from "data/states.json";
import OhioRegions from "data/oh-regions.json";
import ArizonaCounties from "data/az-counties.json";
import OhioCounties from "data/oh-counties.json";
import VermontCounties from "data/vt-counties.json";
import { capitalize } from "./helpers";
import { County } from "lib/types";

const countyArrays: any = {
  OH: OhioCounties,
  AZ: ArizonaCounties,
  VT: VermontCounties,
};

export function getState(param: string) {
  const data = States.find((state) => state.slug === param);
  return data;
}

export function getStateByCode(code: string) {
  const data = States.find((state) => state.code === code);
  return data;
}

export function getCountyByCode(code: string) {
  if (!code) return null;
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
  const region = regionCode && stateCode === "OH" ? (OhioRegions as any)[regionCode] : {};
  return {
    slug,
    name: capitalize(slug.replaceAll("-", " ")),
    region: region || null,
    ebirdCode,
    regionLabel: region?.label || null,
    color: region?.color || "#4a84b2",
  };
}

export function getCounties(stateCode: string) {
  return formatCountyArray(countyArrays[stateCode]);
}

export function formatCountyArray(counties: County[]) {
  if (!counties) return null;
  return counties.map((county) => ({
    ...county,
    name: capitalize(county.slug.replaceAll("-", " ")),
  }));
}
