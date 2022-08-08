import * as React from "react";
import Link from "next/link";
import PageHeading from "components/PageHeading";
import Title from "components/Title";
import EbirdDescription from "components/EbirdDescription";

export default function About() {
  return (
    <div className="container pb-16 mt-12">
      <Title>About</Title>
      <PageHeading breadcrumbs={false}>About BirdingHotspots.org</PageHeading>
      <div className="md:grid grid-cols-2 gap-8">
        <div>
          <p className="mb-4">
            <strong>The Birding Hotspots</strong> website collects tips for birding from birders and descriptions and
            maps of eBird hotspots from eBird and other websites. In eBird, hotspots are shared locations where birders
            may report their bird sightings to eBird. Hotspots provide birders with information about birding locations
            where birds are being seen. BirdingHotspots.org is not affiliated with eBird.
          </p>
          <EbirdDescription />
          <p className="mb-4">
            BirdingHotspots.org is an open source project. You can view or contribute to the code on{" "}
            <a href="https://github.com/rawcomposition/birdinghotspots" target="_blank" rel="noreferrer">
              GitHub
            </a>
            . We also release most of the images and content into the Public Domain.{" "}
            <Link href="/license">Learn More</Link>.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Meet the Team</h3>
          <p className="mb-4">
            <strong>Ken Ostermiller</strong>
            <br />
            Ken created and manages the website. He is a volunteer hotspot reviewer for eBird.
          </p>
          <p className="mb-4">
            <strong>Adam Jackson</strong>
            <br />
            Adam is a software developer that recently joined team.
          </p>

          <h3 className="text-lg font-bold mb-4 mt-8">Regional Editors</h3>
          <p className="mb-4">Kate Bedor, Fred Dinkelbach, Chris Lamb, Joe Wojnarowski (Ohio)</p>
        </div>
      </div>
    </div>
  );
}
