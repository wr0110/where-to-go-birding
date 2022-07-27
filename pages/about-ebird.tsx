import * as React from "react";
import Link from "next/link";
import PageHeading from "components/PageHeading";
import Title from "components/Title";
import EbirdDescription from "components/EbirdDescription";

export default function AboutEbird() {
  return (
    <div className="container pb-16 mt-12">
      <Title>About</Title>
      <PageHeading breadcrumbs={false}>About eBird</PageHeading>
      <div className="md:grid grid-cols-2 gap-8">
        <div>
          <EbirdDescription />
          <p className="mb-4 font-bold">This website provides descriptions and maps of eBird Hotspots in Ohio.</p>
          <p className="mb-4">
            In eBird, Hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots
            provide birders with information about birding locations where birds are being seen.
          </p>
          <p className="mb-4">
            <h3 className="font-bold">eBird can help you</h3>
            + Record the birds you see
            <br />
            + Keep track of your bird lists
            <br />
            + Explore dynamic maps and graphs
            <br />
            + Share your sightings and join the eBird community
            <br />
            + Contribute to science and conservation
            <br />
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Links to eBird website</h3>
          <p className="mb-4">
            <a href="https://ebird.org/hotspots" target="_blank" rel="noreferrer">
              eBird Hotspot Explorer
            </a>
            <br />
            <a href="https://support.ebird.org/en/support/home" target="_blank" rel="noreferrer">
              eBird Help Documents
            </a>
            <br />
            <a href="https://www.facebook.com/ebird/" target="_blank" rel="noreferrer">
              eBird Facebook page
            </a>
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}
