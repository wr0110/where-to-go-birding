export type State = {
	label: string,
	code: string,
	slug: string,
	features: string[],
	rareSid: string,
	needsSid: string,
	yearNeedsSid: string,
	portal?: string,
	coordinates: string,
	mapZoom: number,
	color: string,
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
	active: boolean,
}

export type Image = {
	smUrl: string,
	lgUrl: string,
	by?: string,
	isMap?: boolean,
	preview?: string,
}

export type Hotspot = {
	name: string,
	_id?: string,
	url: string,
	slug: string,
	lat: number,
	lng: number,
	locationId: string,
	stateCode: string,
	countyCode?: string,
	multiCounties?: string[],
	countySlug: string,
	about?:  string,
	tips?: string,
	birds?: string,
	address?: string,
	links?: {
		label: string,
		url: string,
	}[],
	restrooms?: string,
	roadside?: string,
	accessible?: string,
	dayhike?: string,
	parent?: any,
	iba?: {
		value: string,
		label: string,
	},
	images?: Image[],
}

export interface HotspotInputs extends Hotspot {
	parentSelect: {
		label: string,
		value: string,
	}
}

export type HotspotsByCounty = [{
	countySlug: string,
	countyName: string,
	hotspots: {
			name: string,
			url: string,
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

export type EbirdHotspot = {
	locationId: string,
	name: string,
	latitude: number,
	longitude: number,
	subnational1Code: string,
	subnational2Code: string,
}