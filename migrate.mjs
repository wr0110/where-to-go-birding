import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import Drive from "./models/Drive.mjs";
import dotenv from "dotenv";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import Counties from "./data/oh-counties.json" assert {type: "json"};
dotenv.config();

import { links } from "./migrate-links.mjs";
//const links = ["berlin-lake-birding-drive"];

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const dryRun = false;
const nameExceptions = [];
const skip = [];
const state = "ohio";
const stateCode = "OH";
const base = `https://birding-in-ohio.com/ohio-birding-drives`;

const slugReplace = {
	"caesar-creek-state-park-ward-road": "caesar-creek-state-park-ward-road-area-and-mountain-bike-trail",
	"cuyahoga-valley-national-park": "cuyahoga-valley-np",
	"huron-harbor": "huron-harbor-impoundment",
	"richland-bo-trail-butler": "richland-bo-trail",
	"killbuck-marsh-wildlife-area-willow-road": "killbuck-marsh-wildlife-area-willow-rd",
	"killbuck-marsh-wildlife-area-messner-road": "killbuck-marsh-wildlife-area-messner-rd",
}

if (dryRun) {
	console.log("--------------------Dry run--------------------");
}

const drives = await Drive.find();
console.log(`Fetched ${drives.length} drives from DB`);

const hotspots = await Hotspot.find({ stateCode }, ["slug", "countyCode"]);
console.log(`Fetched ${hotspots.length} hotspots from DB`);

const filteredLinks = links.filter(link => {
	const drive = drives.find(d => d.slug === link);
	if (drive) return false;
	return true;
});

for (const link of filteredLinks) {
	const request = await fetch(`${base}/${link}`);
	const html = await request.text();
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const slug = slugReplace[link] || link;
	console.log(`Fetching ${base}/${link}`);

	const iframeHref = doc.querySelector("iframe")?.getAttribute("src");
	if (!iframeHref) {
		throw new Error(`No iframe found for ${slug}`);
	}
	const googleMapId = iframeHref.split("=")[1];

	const leftCol = doc.querySelector(".et_pb_text_1");
	if (!leftCol) {
		throw new Error(`No left column found for ${link}`);
	}

	const paragraphs = doc.querySelectorAll(".et_pb_text_1 p");

	let description = "";
	const entries = [];
	const hotspotCounties = [];

	Array.from(paragraphs).forEach(async (p, i) => {
		if (i === 0) return;
		if (p.querySelector("a[href$='-county/']")) return;
		const hotspotLink = p.querySelector("a[href^='/']");
		if (hotspotLink) {
			const hotspotSlug = hotspotLink.getAttribute("href").replace(/\/+$/, "").split("/").pop(1);
			const strong = p.querySelector("strong");
			if (strong) {
				strong.remove();
			}
			let content = p.outerHTML;
			const hotspot = hotspots.find(h => h.slug === hotspotSlug);
			if (!hotspot) {
				throw new Error(`Hotspot ${hotspotSlug} not found`);
			}
			const entry = {
				hotspot: hotspot._id.toString(),
				description: content || "",
			};
			entries.push(entry);
			if (!hotspot.countyCode) {
				console.log(`Hotspot ${hotspotSlug} has no county code`);
			}
			hotspotCounties.push(hotspot.countyCode);
			return;
		}
		if (entries.length === 0) {
			description += p.outerHTML;
			return;
		}
		const lastEntry = entries[entries.length - 1];
		lastEntry.description += p.outerHTML;
	});

	const uniqueCounties = [...new Set(hotspotCounties)];


	const data = {
		name: doc.querySelector("h1").textContent,
		counties: uniqueCounties,
		mapId: googleMapId,
		stateCode,
		slug,
		description,
		entries,
	};
	await Drive.create(data);
}



mongoose.connection.close();

//TODO verify that all smUrls are actually small
//TODO: Don't allow "Unknown" in day hike radio button
//TODO: Run scrip to find all hotspots with "--" that don't have a parent assigned
//TODO: search for About headings that match the parent hotspot name
//TODO: Refetch old slugs up to Coshocton county
//TODO: Remove Tips that just have a citation: https://birdinghotspots.org/arizona/coconino-county/grand-canyon-national-park-bright-angel-lodge