import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import dotenv from "dotenv";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import Counties from "./data/ky-counties.json" assert {type: "json"}; // IMPORTANT: ------------------------------------------------- Update for each state
dotenv.config();

import { links } from "./migrate-links.mjs";
//const links = ["usvt-addison-county/usvt-adams-mountain"];

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const dryRun = false;
const slice = 50;
const nameExceptions = [];
const skip = [];
const state = "kentucky";
const stateCode = "KY";
const base = `https://ebirdhotspots.com/birding-in-${state}`;
const locationIds = [
];

if (dryRun) {
	console.log("--------------------Dry run--------------------");
}

const cleanSlug = (value) => {
	return value.replace(`us${stateCode.toLowerCase()}-`, "");
}

async function getEbirdHotspot(locationId) {
  const key = process.env.NEXT_PUBLIC_EBIRD_API;
  const response = await fetch(`https://api.ebird.org/v2/ref/hotspot/info/${locationId}?key=${key}`);
  if (response.status === 200) {
    return await response.json();
  }
}

const hotspots = await Hotspot.find({ stateCode }, ["slug", "locationId"]);
console.log(`Fetched ${hotspots.length} hotspots from DB`);

let filteredLinks = links.filter(link => {
	if (!link.includes("/")) {
		return false;
	}
	const slug = cleanSlug(link.split("/").pop());
	return !hotspots.find(hotspot => hotspot.slug === slug) && !skip.includes(slug);
});

console.log(`Filtered out ${links.length - filteredLinks.length} links`);

if (filteredLinks?.length === 0) {
	throw new Error("No links found");
}

filteredLinks = filteredLinks.slice(0, slice);
filteredLinks = filteredLinks.reverse();

console.log(`Scraping ${filteredLinks.length} links`);

const processAbout = (html, parentName) => {
	let data = {
		trash: "",
		tips: "",
		birds: "",
		about: ""
	}
	let current = "about";
	let aboutStarted = false;

	const children = Array.from(html.childNodes);

	if (children?.length && (children[0].nodeName === "STRONG" || children[1].nodeName === "STRONG")) {
		const slicedChildren = children.slice(1);
		const strong = children[0].nodeName === "STRONG" ? children[0] : children[1];
		if (strong?.textContent?.trim() === `About ${parentName}`) {
			current = "trash";
		} else if (strong?.textContent?.trim()?.startsWith("About ")) {
			aboutStarted = true;
			current = "about";
		}
		if (strong?.textContent?.toLowerCase()?.includes("tips for birding")) {
			current = "tips";
		}

		if (strong?.textContent?.toLowerCase()?.includes("birds of interest")) {
			current = "birds";
		}

		let content = "";
		let done = false;

		slicedChildren.forEach((child) => {
			if ((child.nodeName === "BR" || child.nodeName === "#text" || child.nodeName === "SPAN" || child.nodeName === "STRONG" || child.nodeName === "A") && !done) {
				if (child.nodeName === "BR") {
					content += "\n";
				} else if (child.nodeName === "A") {
					content += ` ${child.outerHTML} `;
				} else if (child.nodeName === "STRONG" && (child.textContent?.trim()?.startsWith("About ") || child.textContent?.trim()?.startsWith("Tips"))) {
					// do nothing
				} else if (child.nodeName === "SPAN") {
					content += `<cite>${child.textContent?.trim()}</cite>`;
				} else {
					content += child.textContent?.trim() || "";
				}
			} else {
				done = true;
			}
		});
		
		content = content.replaceAll('&lt;', "<");
		content = content.replaceAll('&gt;', ">");
		content = content.replaceAll('<small>', "");
		content = content.replaceAll('</small>', "");
		data[current] += content?.trim() || "";
	}

	const paragraphs = html.querySelectorAll("p");
	for (const p of paragraphs) {
		const spanCite = p.querySelector(`span[style*='xx-small']`);
		if (spanCite) {
			spanCite.replaceWith(`<cite>${spanCite.innerHTML}</cite>`);
		}
		const iframe = p.querySelector("iframe");
		if (iframe) {
			return { tips: data.tips, birds: data.birds, about: data.about }
		}
		const strong = p.querySelector("strong");
		if (strong?.textContent?.trim()?.startsWith("About ") && aboutStarted === true) {
			return { tips: data.tips, birds: data.birds, about: data.about }
		}
		if (strong?.textContent?.trim() === `About ${parentName}`.trim()) {
			current = "trash";
		} else if (strong?.textContent?.trim()?.startsWith("About ")) {
			strong.remove();
			aboutStarted = true;
			current = "about";
		}
		if (strong?.textContent?.toLowerCase()?.includes("tips for birding")) {
			strong.remove();
			current = "tips";
		}
		if (strong?.textContent?.toLowerCase()?.includes("birds of interest")) {
			strong.remove();
			current = "birds";
		}
		let content = p.outerHTML;
		if (content.startsWith("<p><br>")) {
			content = content.replace("<p><br>", "<p>");
		}
		content = content.replaceAll("<p></p>", "");
		content = content.replaceAll("<p>\n", "<p>");
		content = content.replaceAll('&lt;', "<");
		content = content.replaceAll('&gt;', ">");
		content = content.replaceAll('<small>', "");
		content = content.replaceAll('</small>', "");
		data[current] += content?.trim() || "";
	}

	return { tips: data.tips, birds: data.birds, about: data.about }
}

const processImages = (maps, images, photographer) => {
	const mapArray = maps ? Array.from(maps).map(map => ({
		smUrl: `https://ebirdhotspots.com${map.src}`,
		lgUrl: null,
		by: null,
		width: parseInt(map.getAttribute("width")) || null,
		height: parseInt(map.getAttribute("height")) || null,
		legacy: true,
		isMap: true,
	})) : [];

	const imgArray = images ? Array.from(images).map(img => ({
		smUrl: `https://ebirdhotspots.com${img.src}`,
		lgUrl: null,
		by: photographer,
		width: img.getAttribute("width"),
		height: img.getAttribute("height"),
		legacy: true,
		isMap: false,
	})) : [];

	return [...mapArray, ...imgArray];
}

const softCompare = (string1, string2) => {
	string1 = string1.replace(/[^a-z0-9]/gi, '').toLowerCase().trim();
	string2 = string2.replace(/[^a-z0-9]/gi, '').toLowerCase().trim();
	return string1 === string2;
}

const checkIfNamesMatch = (ebird, h1) => {
	ebird = ebird.trim();
	h1 = h1.trim();
	if (!ebird || !h1) return false;
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll(" State Park", " SP");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll(" National Wildlife Refuge", " NWR");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll(" National Monument", " NM");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Wildlife Management Area", "WMA");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll(" National Park", " NP");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll(" Wildlife Area", " WA");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Road", "Rd.");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Drive", "Dr.");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Avenue", "Ave.");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Boulevard", "Blvd.");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Street", "St.");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Township", "Twp.");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Mount ", " Mt.");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Wastewater Treatment Plant", "WTP");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Sewer Treatment Plant", "STP");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("-", "--");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("–", "--"); //en dash
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("County", "Co.");
	if (softCompare(ebird, h1)) return true;
	const newH1 = `${h1} (view from roadside only)`;
	if (ebird === newH1) return true;
	const newH1Again = `${h1} (restricted access)`;
	if (ebird === newH1Again) return true;
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Campground", "CG");
	if (softCompare(ebird, h1)) return true;
	h1 = h1.replaceAll("Boston Harbor Islands", "BHI");
	if (ebird.replace(/[^\w\s]/gi, "") === h1.replace(/[^\w\s]/gi, "")) return true;
	if (nameExceptions.includes(ebird) || nameExceptions.includes(h1)) return true;
	if (ebird.endsWith(" acres)")) return true;
	return false;
}

let counter = 1;

for (const link of filteredLinks) {
	const request = await fetch(`${base}/${link}`);
	//console.log(`${counter}. Scraping`, link);
	const html = await request.text();
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const slug = link.split("/").pop();
	let address = "";
	let addressLines = 0;
	let parentSlug = null;
	let parentName = null;

	const leftCol = doc.querySelector(".csColumn");
	if (!leftCol) {
		throw new Error(`No left column found for ${link}`);
	}

	const children = Array.from(leftCol.childNodes);

	children.forEach((child) => {
		if ((child.nodeName === "#text" || child.nodeName === "BR") && addressLines < 3) {
			if (child.nodeName === "BR") {
				address += "\n";
			} else {
				address += child.textContent?.trim() || "";
			}
			addressLines++;
		}
	});
	const firstP = leftCol.querySelector("p:not(:empty)");
	if (firstP) {
		const firstPText = firstP.textContent?.trim();
		if (firstPText.startsWith("Also, see")) {
			parentSlug = firstP.querySelector("a")?.getAttribute("href")?.replace(/\/$/, "")?.split("/")?.pop() || null;
			parentName = firstP.querySelector("a")?.textContent?.trim() || null;
		}
	}

	const externalLinks = leftCol.querySelectorAll(`a[href*='http']:not(a[href*='ebird.org']):not(a[href*='ebirdhotspots.com'])`);
	const links = Array.from(externalLinks).map(link => ({
		label: link.textContent?.trim() || null,
		url: link.href,
	}));

	const rightCol = doc.querySelectorAll(".csColumn")[1];
	const h4 = rightCol.querySelector("h4");
	if (h4) h4.remove();


	if (!rightCol) {
		throw new Error(`No right column found for ${link}`);
	}

	const maps = rightCol.querySelectorAll("img");
	const images = processImages(maps);

	const { tips, about, birds } = rightCol ? processAbout(rightCol, parentName) : {};

	const locationLink = leftCol.querySelector(`table a[href*='ebird.org']`)?.href;
	let locationId = null;
	locationId = locationIds.find(it => it.slug === cleanSlug(slug))?.locationId || locationLink?.split("hotspots=")?.[1]?.split("&")?.[0]?.split(",")?.[0] || null;
	if (!locationId) {
		throw new Error(`No location link found for ${link}`);
	}
	const h1Name = doc.querySelector("h1")?.textContent?.trim()?.replace("National Park", "NP") || null;
	let name = null;
	let lat = null;
	let lng = null;
	let countyCode = null;
	let nameMismatch = false;

	const ebirdData = await getEbirdHotspot(locationId);
	if (!ebirdData) {
		throw new Error(`No ebird data found for link: ${link} and locationId: ${locationId}`);
	}
	if (!checkIfNamesMatch(ebirdData?.name, h1Name)) {
		console.log(`\n\x1b[31m${h1Name}\x1b[30m vs \x1b[32m${ebirdData.name}\x1b[34m\nhttps://ebirdhotspots.com/birding-in-${state}/${link}\x1b[30m`);
		const rl = readline.createInterface({ input, output });
		const answer = await rl.question("Mismatch ok (y/n)? ");
		if (answer !== "y") {
			throw new Error("Exiting...");
		}
		nameMismatch = true;
		rl.close();
		//process.stdout.write(`\nMISMATCH: '${h1Name}' vs '${ebirdData.name}'`);
	}
	const alreadyExists = await Hotspot.findOne({ locationId });
	if (alreadyExists) {
		console.log(`\nWARNING: Skipping "${slug}" with eBird ID "${locationId}" already exists`);
		break;
	}
	name = ebirdData?.name || null;
	lat = ebirdData?.latitude || null
	lng = ebirdData?.longitude || null;
	countyCode = ebirdData?.subnational2Code || null;

	const county = Counties.find(it => it.ebirdCode === countyCode)?.slug;
	if (!county) {
		throw new Error(`No county found for ${countyCode}`);
	}

	const url = `/${state}/${county}-county/${cleanSlug(slug)}`;

	const data = {
		name,
		url,
		slug: cleanSlug(slug),
		lat,
		lng,
		stateCode,
		multiCounties: null,
		countyCode,
		address: address.trim() || "",
		tips: tips.trim() || "",
		birds: birds.trim() || "",
		about: about.trim() || "",
		hikes: "",
		oldSlug: slug,
		images: images || [],
		links: links.length > 0 ? links : [],
		locationId: locationId || null,
		iba: null,
		migrateParentSlug: parentSlug ? cleanSlug(parentSlug) : null,
		reviewed: false,
		nameMismatch,
	}
	if (!dryRun) await Hotspot.create(data);
	if (dryRun) console.log(data);
	process.stdout.write(".");
	//console.log(`${counter}. Saved`, name);
	counter++;
};

mongoose.connection.close();

//TODO verify that all smUrls are actually small
//TODO: Don't allow "Unknown" in day hike radio button
//TODO: Run scrip to find all hotspots with "--" that don't have a parent assigned
//TODO: search for About headings that match the parent hotspot name
//TODO: Refetch old slugs up to Coshocton county
//TODO: Remove Tips that just have a citation: https://birdinghotspots.org/arizona/coconino-county/grand-canyon-national-park-bright-angel-lodge