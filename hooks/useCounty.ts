import Counties from "data/oh-counties.json";
import Regions from "data/oh-regions.json";
import { capitalize } from "lib/helpers";

export default function useCounty(slug: string) {
	const county = Counties[slug];
	if (!county) return {}
	const region = county[0];
	return {
		countyName: capitalize(slug.replace("-", " ")),
		region,
		ebirdCode: county[1],
		regionLabel: Regions[region],
		countyColor: Regions[region].color,
	}
}