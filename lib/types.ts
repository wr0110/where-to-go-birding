export type State = {
  label: string;
  code: string;
  slug: string;
  features: string[];
  portal?: string;
  coordinates: string;
  mapZoom: number;
  color: string;
};

export type County = {
  slug: string;
  name: string;
  region: string | null;
  ebirdCode: string;
  regionLabel: string | null;
  active: boolean;
};

export type Image = {
  smUrl: string;
  lgUrl: string;
  originalUrl: string;
  by?: string;
  isMap?: boolean;
  isStreetview?: boolean;
  isPublicDomain?: boolean;
  width?: number;
  height?: number;
  preview?: string;
  caption?: string;
  legacy?: boolean;
  isNew?: boolean; //temporarily added after uploaded
  id?: string; //temporarily added after uploaded
  streetviewData?: any;
};

export type Marker = {
  name: string;
  lat: number;
  lng: number;
  type: string;
};

export type Hotspot = {
  name: string;
  _id?: string;
  url: string;
  slug: string;
  oldSlug?: string;
  lat: number;
  lng: number;
  zoom: number;
  locationId: string;
  countryCode: string;
  stateCode: string;
  countyCode?: string;
  multiCounties?: string[];
  countySlug: string;
  about?: string;
  tips?: string;
  birds?: string;
  hikes?: string;
  address?: string;
  links?: {
    label: string;
    url: string;
  }[];
  restrooms?: string;
  roadside?: string;
  accessible?: string[];
  parent?: any;
  iba?: {
    value: string;
    label: string;
  };
  drives?: [
    {
      slug: string;
      name: string;
      driveId: string;
    }
  ];
  images?: Image[];
  featuredImg?: Image;
  isGroup?: boolean;
  species?: number;
  reviewed: boolean; //TODO: remove after migration
};

export interface HotspotInputs extends Hotspot {
  parentSelect: {
    label: string;
    value: string;
  };
}

export type HotspotsByCounty = [
  {
    countySlug: string;
    countyName: string;
    hotspots: {
      name: string;
      url: string;
    }[];
  }
];

export type DrivesByCounty = [
  {
    countySlug: string;
    countyName: string;
    drives: {
      name: string;
      url: string;
    }[];
  }
];

export type IBA = {
  name: string;
  slug: string;
  ebirdCode: string;
  ebirdLocations?: string;
  webpage: string;
  about: string;
};

export type EbirdHotspot = {
  locationId: string;
  name: string;
  latitude: number;
  longitude: number;
  subnational1Code: string;
  subnational2Code: string;
};

export type Drive = {
  _id?: string;
  name: string;
  countryCode: string;
  stateCode: string;
  slug: string;
  description: string;
  mapId: string;
  counties: string[];
  images?: Image[];
  entries: [
    {
      hotspot: Hotspot;
      description: string;
    }
  ];
};

export type DriveInputs = {
  _id?: string;
  name: string;
  countryCode: string;
  stateCode: string;
  slug: string;
  description: string;
  mapId: string;
  counties: string[];
  images?: Image[];
  entries: [
    {
      hotspotSelect: {
        label: string;
        value: string;
      };
      description: string;
    }
  ];
};

export type Article = {
  _id?: string;
  name: string;
  countryCode: string;
  stateCode: string;
  slug: string;
  content: string;
  images?: Image[];
  hotspots: [Hotspot];
};

export type ArticleInputs = {
  _id?: string;
  name: string;
  countryCode: string;
  stateCode: string;
  slug: string;
  content: string;
  images?: Image[];
  hotspotSelect: {
    label: string;
    value: string;
  }[];
};

export type LocationSearchValue = {
  label: string;
  lat: number;
  lng: number;
};

export type Upload = {
  locationId: string;
  countryCode: string;
  stateCode: string;
  smUrl: string;
  lgUrl: string;
  originalUrl: string;
  by: string;
  email: string;
  width?: number;
  height?: number;
  caption?: string;
  createdAt: Date;
  status: string;
  _id?: string;
};

export type NotableReport = {
  location: string;
  date: string;
  checklistId: string;
  lat: number;
  lng: number;
  hasRichMedia: boolean;
  approved: boolean;
  countyName: string;
  userDisplayName: string;
  id: string;
};

export type HotspotDrive = {
  name: string;
  slug: string;
  driveId: string;
};
