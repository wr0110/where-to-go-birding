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

const county = "coshocton";
const dryRun = false;
const nameExceptions = ["Woodbury Wildlife Area--Bedford Township Roads 56 and 58", "Kokosing River--Newcastle Township Rd. 423 Access", "Woodbury Wildlife Area--Jackson Township Rd. 403", "Woodbury Wildlife Area--Jackson Township Rd. 302"];
const processWithoutLocationId = ["Little Beaver Creek Greenway Trail"];
const skip = ["piedmont-lake-piedmont-lake-road"];
const state = "ohio";
const stateCode = "OH";
const base = "https://birding-in-ohio.com";

if (dryRun) {
	console.log("--------------------Dry run--------------------");
}

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
	const links = doc.querySelectorAll(".et_pb_column_2 a:not(a[href^='https://ebird.org'])");
	return Array.from(links).map(link => link.href.replace(/\/$/, ""));
}

const hotspots = await Hotspot.find({ state: stateCode }, ["slug", "locationId"]);
console.log(`Fetched ${hotspots.length} hotspots from DB`);

const links = await getHotspots();
console.log(`Found ${links.length} hotspot links`);

let filteredLinks = links.filter(link => {
	const slug = link.split("/").pop();
	return !hotspots.find(hotspot => hotspot.slug === slug) && !skip.includes(slug);
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
		content = content.replaceAll('<small>', "");
		content = content.replaceAll('</small>', "");
		data[current] += content?.trim() || "";
	}

	return { tips: data.tips, birds: data.birds, about: data.about, hikes: data.hikes }
}

const processImages = (maps, images, photographer) => {
	const mapArray = maps ? Array.from(maps).filter(img => !img.src.includes(`-county-map.jpg`) && !img.src.includes(`-county-map-g.jpg`)).map(map => ({
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

const checkIfNamesMatch = (ebird, h1) => {
	if (!ebird || !h1) return false;
	if (ebird === h1) return true;
	h1 = h1.replaceAll(" State Park", " SP");
	if (ebird === h1) return true;
	h1 = h1.replaceAll("Road", "Rd.");
	if (ebird === h1) return true;
	h1 = h1.replaceAll("Street", "St.");
	if (ebird === h1) return true;
	h1 = h1.replaceAll("Township", "Twp.");
	if (ebird === h1) return true;
	h1 = h1.replaceAll("-", "--");
	if (ebird === h1) return true;
	h1 = h1.replaceAll("–", "--"); //en dash
	if (ebird === h1) return true;
	h1 = h1.replaceAll("County", "Co.");
	if (ebird === h1) return true;
	const newH1 = `${h1} (view from roadside only)`;
	if (ebird === newH1) return true;
	const newH1Again = `${h1} (restricted access)`;
	if (ebird === newH1Again) return true;
	if (ebird.replace(/[^\w\s]/gi, "") === h1.replace(/[^\w\s]/gi, "")) return true;
	if (nameExceptions.includes(ebird) || nameExceptions.includes(h1)) return true;
	return false;
}

let counter = 1;

await Promise.all(filteredLinks.map(async (link) => {
	const request = await fetch(`${base}/${link}`);
	console.log(`${counter}. Scraping`, link);
	const html = await request.text();
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const slug = link.split("/").pop();
	const locLink = doc.querySelector(`a[href*='submit/effort?locID']`);
	const isGroup = !link.startsWith(`/${county}-county/`);
	if (isGroup && !locLink) {
		throw new Error(`No locID found for ${link}`);
	}
	const h1Name = doc.querySelector("h1")?.textContent?.trim()?.replace("National Park", "NP") || null;
	let locationId = isGroup ? null : getLocationId(locLink.href);

	let name = null;
	let lat = null;
	let lng = null;
	let countyCode = null;
	let multiCounties = null;

	if (locationId) {
		const ebirdData = await getEbirdHotspot(locationId);
		if (!ebirdData) {
			console.log(`WARNING: No ebird data found for ${slug}`);
		}
		if (!checkIfNamesMatch(ebirdData?.name, h1Name)) {
			console.log(`WARNING: mismatch: ${h1Name} vs ${ebirdData.name}`);
			if (processWithoutLocationId.includes(h1Name)) {
				console.log("Setting locationId to null");
				locationId = null;
			} else {
				throw new Error("Couldn't resolve mismatch");
			}
		} else {
			const alreadyExists = await Hotspot.findOne({ locationId });
			if (alreadyExists) {
				console.log(`WARNING: Skipping "${slug}" with eBird ID "${locationId}" already exists`);
				return;
			}
			name = ebirdData?.name || null;
			lat = ebirdData?.latitude || null
			lng = ebirdData?.longitude || null;
			countyCode = ebirdData?.subnational2Code || null;
		}
	}
	if (!locationId) {
		if (!locationId) console.log("No locID");
		name = h1Name;

		const countyImages = doc.querySelectorAll("img[src$='-county-map.jpg']");
		multiCounties = Array.from(countyImages).map(img => {
			const slug = img.src.split("/").pop()?.replace("-county-map.jpg", "");
			if (!slug) return;
			return Counties.find(it => it.slug === slug)?.ebirdCode;
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

	const aboutHtmlAttempt1 = doc.querySelector(".et_pb_column_2 .et_pb_text_9 .et_pb_text_inner");
	const aboutHtmlAttempt2 = doc.querySelector(".et_pb_column_2 .et_pb_text_10 .et_pb_text_inner");
	const aboutHtmlAttempt3 = doc.querySelector(".et_pb_column_2 .et_pb_text_11 .et_pb_text_inner");
	const aboutHtml = aboutHtmlAttempt1 || aboutHtmlAttempt2 || aboutHtmlAttempt3;
	if (!aboutHtml) console.log(`WARNING: No about for ${slug}`);
	const { tips, birds, about, hikes } = aboutHtml ? processAbout(aboutHtml) : {};

	const maps = doc.querySelectorAll(".et_pb_column_2 img");
	const galleryImages = doc.querySelectorAll(".et_pb_column_1 .et_pb_gallery_0 img");

	let photographerAttempt = doc.querySelector(".et_pb_column_1 .et_pb_gallery_0 + div")?.textContent?.trim();
	if (!photographerAttempt?.includes("Photo")) {
		photographerAttempt = null;
	}
	const photographer = photographerAttempt?.replace("Photos by ", "")?.replace("Photo by ", "");
	let images = processImages(maps, galleryImages, photographer);

	const extraImage1 = doc.querySelector(".et_pb_column_1 .et_pb_image_0");
	const extraImage1By = doc.querySelector(".et_pb_column_1 .et_pb_image_0 + div")?.textContent?.trim();
	const extraImage2 = doc.querySelector(".et_pb_column_1 .et_pb_image_1");
	const extraImage2By = doc.querySelector(".et_pb_column_1 .et_pb_image_1 + div")?.textContent?.trim();

	if (extraImage1) {
		const image = extraImage1.querySelector("img");
		if (image) {
			images.push({
				smUrl: image.src,
				lgUrl: null,
				by: extraImage1By?.includes("Photo") ? extraImage1By?.replace("Photos by ", "")?.replace("Photo by ", "") : null,
				width: image?.getAttribute("width") || null,
				height: image?.getAttribute("height") || null,
				legacy: true,
				isMap: false,
			});
		}
	}

	if (extraImage2) {
		const image = extraImage1.querySelector("img");
		if (image) {
			images.push({
				smUrl: image.src,
				lgUrl: null,
				by: extraImage2By?.includes("Photo") ? extraImage2By?.replace("Photos by ", "")?.replace("Photo by ", "") : null,
				width: image.getAttribute("width") || null,
				height: image.getAttribute("height") || null,
				legacy: true,
				isMap: false,
			});
		}
	}

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
		tips: tips || "",
		birds: birds || "",
		about: about || "",
		hikes: hikes || "",
		slug,
		images: images || [],
		links: links.length > 0 ? links : [],
		locationId: locationId || null,
		iba: ibaName && ibaSlug ? {
			label: ibaName,
			value: ibaSlug,
		} : null,
		migrateParentSlug: name.includes("--") ? parentSlug || null : null,
		migrateParentGroupSlug: name.includes("--") ? migrateParentGroupSlug || null : null,
		reviewed: false,
	}
	if (!dryRun) await Hotspot.create(data);
	if (!dryRun) console.log(`${counter}. Saved`, name);
	counter++;
}));

mongoose.connection.close();

//TODO verify that all smUrls are actually small
//TODO: Don't allow "Unknown" in day hike radio button
//TODO: Run scrip to find all hotspots with "--" that don't have a parent assigned
//TODO: search for About headings that match the parent hotspot name