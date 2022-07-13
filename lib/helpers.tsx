import Geocode from "react-geocode";
import { Hotspot } from "lib/types";
import { getCountyByCode } from "lib/localData";

export function slugify(title?: string) {
  if (!title) return null;
  const slug = title
    .toLowerCase()
    .replace("’s", "s")
    .replace("'s", "s")
    .replace(/[^a-z0-9]+/g, "-");
  return slug.endsWith("-") ? slug.slice(0, -1) : slug;
}

export const tinyConfig = {
  menubar: false,
  plugins: "link autoresize",
  toolbar: "bold italic underline | link | cite",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } cite { font-size: 0.75em; font-style: normal; color: #666; }",
  branding: false,
  elementpath: false,
  valid_elements: "p,a[href|rel|target=_blank],strong/b,em/i,u,strike,br,ul,ol,li,cite",
  autoresize_bottom_margin: 0,
  formats: {
    citation: { inline: "cite" },
  },
  convert_urls: false,
  setup: (editor: any) => {
    editor.ui.registry.addToggleButton("cite", {
      text: "Cite",
      onAction: (api: any) => {
        editor.formatter.toggle("citation");
        api.setActive(!api.isActive());
      },
    });
  },
};

export function capitalize(str: string) {
  if (typeof str !== "string") return str;
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
}

type HotspotMap = {
  [x: string]: {
    name: string;
    url: string;
  }[];
};

export function restructureHotspotsByCounty(hotspots: Hotspot[]) {
  let counties: HotspotMap = {};
  hotspots.forEach(({ countyCode, multiCounties, url, name }) => {
    if (countyCode) {
      if (!countyCode) return;
      if (!counties[countyCode]) {
        counties[countyCode] = [];
      }
      counties[countyCode].push({ name, url });
    } else if (multiCounties?.length) {
      multiCounties.forEach((countyCode) => {
        if (!countyCode) return;
        if (!counties[countyCode]) {
          counties[countyCode] = [];
        }
        counties[countyCode].push({ name, url });
      });
    }
  });

  return (
    Object.entries(counties).map(([key, hotspots]) => {
      const county = getCountyByCode(key);
      return {
        countySlug: county?.slug,
        countyName: county?.name,
        hotspots,
      };
    }) || []
  );
}

export async function geocode(lat: number, lng: number) {
  console.log("Geocoding", lat, lng);
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;
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
  } catch (error) {
    console.error(error);
    return { road: "", city: "", state: "", zip: "" };
  }
}

export async function getEbirdHotspot(locationId: string) {
  const key = process.env.NEXT_PUBLIC_EBIRD_API;
  const response = await fetch(`https://api.ebird.org/v2/ref/hotspot/info/${locationId}?key=${key}`);
  if (response.status === 200) {
    return await response.json();
  }
}

export function scrollToAnchor(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const anchor = e.currentTarget.getAttribute("href");
  if (!anchor) return;
  const element = document.querySelector(anchor);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

export const restroomOptions = [
  { value: "no", label: "No restroom facilities." },
  { value: "yes", label: "Restroom on site." },
  { value: "nearby", label: "Restrooms at nearby restaurants or businesses." },
  { value: "portable", label: "Restroom on site, portable toilet." },
  { value: "vault", label: "Restroom on site, vault toilet." },
  { value: "flush", label: "Restroom on site, flush toilet." },
  { value: "map", label: "Restrooms at locations identified on park map." },
];

export const accessibleOptions = [
  { value: "trail", label: "Wheelchair accessible trail." },
  { value: "ada", label: "ADA accessible facilities on site." },
  { value: "map", label: "ADA accessible facilities at locations identified on park map." },
  { value: "pier", label: "ADA accessible fishing pier." },
  { value: "blind", label: "ADA accessible bird blind." },
];
