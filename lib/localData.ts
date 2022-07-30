import States from "data/states.json";
import OhioRegions from "data/oh-regions.json";
import ArizonaCounties from "data/az-counties.json";
import OhioCounties from "data/oh-counties.json";
import VermontCounties from "data/vt-counties.json";
import RhodeIslandCounties from "data/ri-counties.json";
import NewMexicoCounties from "data/nm-counties.json";
import MichiganCounties from "data/mi-counties.json";
import MassachusettsCounties from "data/ma-counties.json";
import KentuckyCounties from "data/ky-counties.json";
import GeorgiaCounties from "data/ga-counties.json";
import NewHampshireCounties from "data/nh-counties.json";
import { capitalize } from "./helpers";
import { County } from "lib/types";

const countyArrays: any = {
  OH: OhioCounties,
  AZ: ArizonaCounties,
  VT: VermontCounties,
  RI: RhodeIslandCounties,
  NM: NewMexicoCounties,
  MI: MichiganCounties,
  MA: MassachusettsCounties,
  KY: KentuckyCounties,
  GA: GeorgiaCounties,
  NH: NewHampshireCounties,
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

export function getAllCounties() {
  const counties: any = [];
  Object.entries(countyArrays).forEach(([stateCode, array]: any) => {
    const stateSlug = getStateByCode(stateCode)?.slug;
    array.forEach(({ slug }: County) => {
      const name = capitalize(slug.replaceAll("-", " "));
      counties.push({ slug, name: `${name}, ${stateCode}, US`, stateSlug });
    });
  });
  return counties;
}

export function formatCountyArray(counties: County[]) {
  if (!counties) return null;
  return counties.map((county) => ({
    ...county,
    name: capitalize(county.slug.replaceAll("-", " ")),
  }));
}
