import fetch from "node-fetch";
import fs from "fs";
import mongoose from "mongoose";
import Hotspot from "./models/Hotspot.mjs";
import dotenv from "dotenv";
dotenv.config();

import ArizonaCounties from "./data/az-counties.json" assert {type: "json"};
import OhioCounties from "./data/oh-counties.json" assert {type: "json"};
import VermontCounties from "./data/vt-counties.json" assert {type: "json"};
import RhodeIslandCounties from "./data/ri-counties.json" assert {type: "json"};
import NewMexicoCounties from "./data/nm-counties.json" assert {type: "json"};
import MichiganCounties from "./data/mi-counties.json" assert {type: "json"};
import MassachusettsCounties from "./data/ma-counties.json" assert {type: "json"};
import states from "./data/states.json" assert {type: "json"};

const countyArrays = {
	"OH": OhioCounties,
	"AZ": ArizonaCounties,
	"VT": VermontCounties,
	"RI": RhodeIslandCounties,
	"NM": NewMexicoCounties,
	"MI": MichiganCounties,
	"MA": MassachusettsCounties,
}

const activeStates = states.filter(state => state.active);

const URI = process.env.MONGO_URI;
mongoose.connect(URI);

const dbHotspots = await Hotspot
	.find({ location: { $ne: null } }, ["-_id", "locationId", "url"])
	.lean()
	.exec();
const getHotspotsForRegion = async (region) => {
	console.log(`Fetching eBird hotspots for ${region}`);
	const response = await fetch(`https://api.ebird.org/v2/ref/hotspot/${region}?fmt=json`);
	const json = await response.json()
	
	if ("errors" in json) {
		throw "Error fetching eBird photos";
	}

	return json.map(hotspot => ({
		id: hotspot.locId,
		name: hotspot.locName,
		county: hotspot.subnational2Code,
		total: hotspot.numSpeciesAllTime,
	}));
}

activeStates.forEach(async (state) => {
	const hotspots = await getHotspotsForRegion(`US-${state.code}`);
	const hotspotsFiltered = hotspots.filter(hotspot => hotspot.total > 100);
	const hotspotsWithUrl = hotspotsFiltered.map(hotspot => {
		const dbHotspot = dbHotspots.find(dbHotspot => dbHotspot.locationId === hotspot.id) || null;
		if (!dbHotspot) return {
			county: hotspot.county,
			name: hotspot.name,
			total: hotspot.total,
		};
		return {
			county: hotspot.county,
			name: hotspot.name,
			total: hotspot.total,
			url: dbHotspots.find(dbHotspot => dbHotspot.locationId === hotspot.id)?.url || null,
		}
	});
	const hotspotsSorted = hotspotsWithUrl.sort((a, b) => b.total - a.total);
	const counties = countyArrays[state.code];
	counties?.forEach(county => {
		console.log(`Processing top hotspots for ${county.ebirdCode}`);
		const countyHotspots = hotspotsSorted.filter(item => item.county === county.ebirdCode);
		const topHotspots = countyHotspots.slice(0, 10).map(({county, ...rest}) => rest);
		fs.writeFileSync(`./public/top10/${county.ebirdCode}.json`, JSON.stringify(topHotspots));
	});
	const topStateHotspots = hotspotsSorted.slice(0, 20).map(({county, ...rest}) => rest);
	fs.writeFileSync(`./public/top10/US-${state.code}.json`, JSON.stringify(topStateHotspots));
});

mongoose.connection.close()