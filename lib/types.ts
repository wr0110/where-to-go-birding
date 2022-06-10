export type State = {
	label: string,
	code: string,
	slug: string,
	features: string[],
	rareSid: string,
	needsSid: string,
	yearNeedsSid: string,
	ebirdPortal?: string,
}

export type StateLinks = {
	section: string,
	links: {
		label: string,
		url: string,
	}[],
}[];

export type County = {
	slug: string,
	name: string,
	region: string | null,
	ebirdCode: string,
	regionLabel: string | null,
	color: string,
	active: boolean,
}

export type Hotspot = {
	name: string,
	slug: string,
	lat: number,
	lng: number,
	locationId: string,
	stateCode: string,
	countyCode: string,
	countySlug: string,
	tips?: {
		text: string,
		source: string,
		link: string,	
	},
	about?: {
		text: string,
		source: string,
		link: string,
	},
	address?: {
		street: string,
		city: string,
		state: string,
		zip: string,
	},
	links?: {
		label: string,
		url: string,
	}[],
	restrooms?: string,
	roadside?: string,
	accessible?: string,
	dayhike?: string,
	parentId?: string,
	iba?: {
		value: string,
		label: string,
	},
}

export type HotspotsByCounty = [{
	countySlug: string,
	countyName: string,
	hotspots: {
			name: string,
			slug: string,
	}[]
}]

export type IBA = {
	name: string,
	slug: string,
	ebirdCode: string,
	ebirdLocations?: string,
	webpage: string,
	about: string
}