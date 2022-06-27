import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import dotenv from "dotenv";
dotenv.config();

import Counties from "./data/oh-counties.json" assert {type: "json"};
import IBA from "./data/oh-iba.json" assert {type: "json"};

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const county = "mercer";
const state = "ohio";
const stateCode = "OH";
const base = "https://birding-in-ohio.com";

async function getEbirdHotspot(locationId) {
  const key = process.env.NEXT_PUBLIC_EBIRD_API;
  const response = await fetch(`https://api.ebird.org/v2/ref/hotspot/info/${locationId}?key=${key}`);
  if (response.status === 200) {
    return await response.json();
  }
}

const getHotspots = async () => {
	const request = await fetch(`https://birding-in-ohio.com/${county}-county/`);
	const html = await request.text();
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const links = doc.querySelectorAll(".et_pb_column_2 a");
	return Array.from(links).map(link => link.href.replace(/\/$/, ""));
}

const hotspots = await Hotspot.find({ state: stateCode }, ["slug", "locationId"]);
console.log(`Fetched ${hotspots.length} hotspots from DB`);

const links = await getHotspots();
console.log(`Found ${links.length} hotspot links`);

let filteredLinks = links.filter(link => {
	const slug = link.split("/").pop();
	return !hotspots.find(hotspot => hotspot.slug === slug);
});

console.log(`Filtered out ${links.length - filteredLinks.length} links`);

if (filteredLinks?.length === 0) {
	throw new Error("No links found");
}

const getLocationId = (url) => {
	const segments = url.split("locID=")[1];
	return segments.split("&")[0];
}

const processAbout = (html) => {
	let data = {
		tips: "",
		birds: "",
		hikes: "",
		about: ""
	}
	let current = "about";
	let aboutStarted = false;
	const paragraphs = html.querySelectorAll("p");
	for (const p of paragraphs) {
		const spanCite = p.querySelector(`span[style*='xx-small']`);
		if (spanCite) {
			spanCite.replaceWith(`<cite>${spanCite.innerHTML}</cite>`);
		}
		const strong = p.querySelector("strong");
		if (strong?.textContent?.trim()?.startsWith("About ") && aboutStarted === true) {
			return { tips: data.tips, birds: data.birds, about: data.about, hikes: data.hikes }
		}
		if (strong?.textContent?.toLowerCase()?.includes("birding day hike")) {
			strong.remove();
			current = "hikes";
		}
		if (strong?.textContent?.toLowerCase()?.includes("birds of interest")) {
			strong.remove();
			current = "hikes";
		}
		if (strong?.textContent?.trim()?.startsWith("About ")) {
			strong.remove();
			aboutStarted = true;
			current = "about";
		}
		if (strong?.textContent?.toLowerCase()?.includes("tips for birding")) {
			strong.remove();
			current = "tips";
		}
		let content = p.outerHTML;
		if (content.startsWith("<p><br>")) {
			content = content.replace("<p><br>", "<p>");
		}
		content = content.replaceAll('href="/', `href="/${state}/`);
		content = content.replaceAll('&lt;', "<");
		content = content.replaceAll('&gt;', ">");
		if (!p.textContent.includes("restroom facilities") && !p.textContent.includes("handicap accessible facilities")) {
			data[current] += content?.trim() || "";
		}
	}

	return { tips: data.tips, birds: data.birds, about: data.about, hikes: data.hikes }
}

const processImages = (maps, images, photographer) => {
	const mapArray = maps ? Array.from(maps).filter(img => !img.src.includes(`${county}-county-map.jpg`)).map(map => ({
		smUrl: map.src,
		lgUrl: null,
		by: null,
		width: parseInt(map.getAttribute("width")) || null,
		height: parseInt(map.getAttribute("height")) || null,
		legacy: true,
		isMap: true,
	})) : [];

	const imgArray = images ? Array.from(images).map(img => ({
		smUrl: img.src,
		lgUrl: null,
		by: photographer,
		width: img.getAttribute("width"),
		height: img.getAttribute("height"),
		legacy: true,
		isMap: false,
	})) : [];

	return [...mapArray, ...imgArray];
}

let counter = 1;

await Promise.all(filteredLinks.map(async (link) => {
	console.log(`${counter}. Scraping`, link);
	const request = await fetch(`${base}/${link}`);
	const html = await request.text();
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const slug = link.split("/").pop();
	const locLink = doc.querySelector(`a[href*='submit/effort?locID']`);
	const isGroup = !link.startsWith(`/${county}-county/`);
	const locationId = isGroup ? null : getLocationId(locLink.href);

	let name = null;
	let lat = null;
	let lng = null;
	let countyCode = null;
	let multiCounties = null;

	if (locationId) {
		const alreadyExists = hotspots.find(hotspot => hotspot.locationId === locationId);
		if (alreadyExists) {
			console.log(`${counter}. Skipping, "${slug}" with eBird ID "${locationId}" already exists`);
			return;
		}
		const ebirdData = await getEbirdHotspot(locationId);
		if (!ebirdData) {
			console.log("No ebird data found");
		}
		name = ebirdData?.name || null;
		lat = ebirdData?.latitude || null
		lng = ebirdData?.longitude || null;
		countyCode = ebirdData?.subnational2Code || null;
	} else {
		if (!locationId) console.log("No locID");
		name = doc.querySelector("h1")?.textContent?.trim() || null;

		const countyImages = doc.querySelectorAll("img[src$='-county-map.jpg']");
		multiCounties = Array.from(countyImages).map(img => {
			const slug = img.src.split("/").pop()?.replace("-county-map.jpg", "");
			if (!slug) return;
			return Counties.find(it => it.slug === slug);
		}).filter(item => item);
	}

	const intro = doc.querySelector(".et_pb_text_inner");
	const externalLinks = intro.querySelectorAll(`a[href*='http']:not(a[href*='ebird.org']):not(a[href*='birding-in-ohio.com'])`);
	const links = Array.from(externalLinks).map(link => ({
		label: link.textContent?.trim() || null,
		url: link.href,
	}));

	const parentLink = intro.querySelector(`a[href^='/${county}-county/']`);
	const parentSlug = parentLink?.href?.split("/${county}-county/")?.pop()?.replace("/", "");

	const internalLinks = intro.querySelectorAll(`a[href^='/`);
	let migrateParentGroupSlug = null;
	Array.from(internalLinks).forEach(link => {
		const slug = link.href.replace(/\/$/, "");
		if (links.find(it => it === slug)) {
			migrateParentGroupSlug = slug;
		}
	});

	const ibaLink = intro.querySelector(`a[href*='ohio-important-bird-areas/']`);
	let ibaSlug = ibaLink?.href?.split("ohio-important-bird-areas/").pop();
	ibaSlug = ibaSlug?.replace("/", "")?.replace("-important-bird-area", "");
	ibaSlug = ibaSlug?.replaceAll(".", "");
	const ibaName = IBA.find(iba => iba.slug === ibaSlug)?.name;
	if (ibaSlug && !ibaName) console.error(`No IBA match: ${ibaSlug}`);

	const driveLink = intro.querySelector(`a[href*='ohio-birding-drives/']`);
	let driveSlug = driveLink?.href?.split("ohio-birding-drives/")?.pop();
	driveSlug = driveSlug?.replace("/", "");

	const strongs = intro.querySelectorAll("strong");
	for (const strong of strongs) {
		strong.remove();
	}
	const paragraphs = intro.querySelectorAll("p");
	for (const p of paragraphs) {
		p.remove();
	}
	const anchors = intro.querySelectorAll("a");
	for (const a of anchors) {
		a.remove();
	}
	const address = intro.textContent.trim();

	const aboutHtml = doc.querySelector(".et_pb_column_2 .et_pb_text_9 .et_pb_text_inner");
	if (!aboutHtml) console.log("No about");
	const { tips, birds, about, hikes } = processAbout(aboutHtml);

	const maps = doc.querySelectorAll(".et_pb_column_2 img");
	const galleryImages = doc.querySelectorAll(".et_pb_column_1 .et_pb_gallery_0 img");
	const photographer = doc.querySelector(".et_pb_column_1 .et_pb_gallery_0 + div")?.textContent?.trim()?.replace("Photos by ", "")?.replace("Photo by ", "");
	const images = processImages(maps, galleryImages, photographer);

	const url = locationId ? `/${state}/${county}-county/${slug}` : `/${state}/group/${slug}`;

	const data = {
		name,
		url,
		slug,
		lat,
		lng,
		stateCode,
		multiCounties,
		countyCode,
		address: address || "",
		tips,
		birds,
		about,
		hikes,
		slug,
		images: images || [],
		links: links.length > 0 ? links : [],
		locationId: locationId || null,
		iba: ibaName && ibaSlug ? {
			label: ibaName,
			value: ibaSlug,
		} : null,
		drive: driveLink && driveSlug ? {
			label: driveLink.textContent.trim(),
			value: driveSlug,
		} : null,
		migrateParentSlug: parentSlug || null,
		migrateParentGroupSlug: migrateParentGroupSlug || null,
		reviewed: false,
	}
	await Hotspot.create(data);
	console.log(`${counter}. Saved`, name);
	counter++;
}));

mongoose.connection.close();

//TODO sync with index pages
//TODO assign multiCounties
//TODO verify that all smUrls are actually small
//TODO: Don't allow "Unknown" in day hike radio button