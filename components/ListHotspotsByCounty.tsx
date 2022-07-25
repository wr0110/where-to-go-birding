import * as React from "react";
import Link from "next/link";
import { HotspotsByCounty } from "lib/types";

type Props = {
  stateSlug?: string;
  countrySlug?: string;
  hotspots: HotspotsByCounty;
};

export default function ListHotspotsByCounty({ stateSlug, countrySlug, hotspots }: Props) {
  return (
    <>
      {hotspots.map(({ countySlug, countyName, hotspots }) => (
        <p key={countySlug} className="mb-4 break-inside-avoid">
          {stateSlug && countrySlug ? (
            <Link href={`/${countrySlug}/${stateSlug}/${countySlug}-county`}>
              <a className="font-bold">{countyName} County</a>
            </Link>
          ) : (
            <span>{countyName} County</span>
          )}
          <br />
          {hotspots.map(({ name, url }) => (
            <React.Fragment key={url}>
              <Link href={url}>{name}</Link>
              <br />
            </React.Fragment>
          ))}
        </p>
      ))}
    </>
  );
}
