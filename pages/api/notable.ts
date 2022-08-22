import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
  speciesCode: string;
  comName: string;
  sciName: string;
  locId: string;
  locName: string;
  obsDt: string;
  howMany: number;
  lat: number;
  lng: number;
  obsValid: boolean;
  obsReviewed: boolean;
  locationPrivate: boolean;
  subId: string;
  subnational2Code: string;
  subnational2Name: string;
  subnational1Code: string;
  subnational1Name: string;
  countryCode: string;
  countryName: string;
  userDisplayName: string;
  obsId: string;
  checklistId: string;
  presenceNoted: boolean;
  hasComments: boolean;
  firstName: string;
  lastName: string;
  hasRichMedia: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { region } = req.query;

  const response = await fetch(
    `https://api.ebird.org/v2/data/obs/${region}/recent/notable?detail=full&back=7&key=${process.env.NEXT_PUBLIC_EBIRD_API}`
  );
  let reports: Response[] = await response.json();

  if (!reports?.length) {
    res.status(200).json([]);
  }

  reports = reports
    //Remove duplicates. For unknown reasons, eBird sometimes returns duplicates
    .filter((value, index, array) => array.findIndex((searchItem) => searchItem.obsId === value.obsId) === index)
    .filter(({ comName }) => !comName.includes("(hybrid)"));

  const reportsBySpecies: any = {};

  reports.forEach((item) => {
    if (!reportsBySpecies[item.speciesCode]) {
      reportsBySpecies[item.speciesCode] = {
        name: item.comName,
        code: item.speciesCode,
        reports: [],
      };
    }
    reportsBySpecies[item.speciesCode].reports.push({
      id: item.obsId,
      location: item.locName,
      date: item.obsDt,
      checklistId: item.subId,
      lat: item.lat,
      lng: item.lng,
      hasRichMedia: item.hasRichMedia,
      countyName: item.subnational2Name,
      userDisplayName: item.userDisplayName,
      approved: item.obsValid,
    });
  });

  const species = Object.entries(reportsBySpecies).map(([key, value]) => value);

  res.status(200).json([...species]);
}
