import type { NextApiRequest, NextApiResponse } from "next";
import States from "data/states.json";
import { getAllCounties } from "lib/localData";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { q }: any = req.query;
  const allCounties = getAllCounties();

  const filteredCounties = allCounties
    .filter((county: any) => {
      return county.name.toLowerCase().startsWith(q.toLowerCase());
    })
    .map(({ name, code }: any) => ({ label: name, value: code }));

  const filteredStates = States.filter(
    (state) => state.active && state.label.toLowerCase().startsWith(q.toLowerCase())
  ).map((state) => ({ label: `${state.label}, US`, value: `US-${state.code}` }));

  res.status(200).json({
    success: true,
    results: [...filteredStates, ...filteredCounties],
  });
}
