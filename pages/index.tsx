import Link from "next/link";
import States from "data/states.json";
import EbirdDescription from "components/EbirdDescription";
import Title from "components/Title";
import Banner from "components/Banner";
import FeaturedHotspots from "components/FeaturedHotspots";
import Heading from "components/Heading";
import EditorActions from "components/EditorActions";

export default function Home2() {
  return (
    <>
      <Title />
      <Banner />
      <div className="container pb-16 mt-12">
        <div className="sm:grid grid-cols-2 gap-16">
          <section>
            <h3 className="text-lg mb-4 font-bold">United States</h3>
            <div className="columns-2 lg:columns-3 mb-12">
              {States.filter((state) => state.active).map(({ label, slug, code }) => (
                <Link key={code} href={`/us/${slug}`}>
                  <a className="font-bold px-2 py-1 text-base mb-1 block">{label}</a>
                </Link>
              ))}
            </div>
          </section>
          <section>
            <div className="bg-gray-100 p-4 mt-10">
              <h3 className="text-lg mb-4 font-bold">Want to see your state or country on this site?</h3>
              <p className="mb-4">
                Get in touch using our <Link href="/contact">contact form</Link>.
              </p>
            </div>
          </section>
        </div>

        <Heading className="mb-16 mt-24">Featured Hotspots</Heading>
        <EditorActions className="-mt-10">
          <Link href="/featured">Edit Featured Hotspots</Link>
        </EditorActions>
        <FeaturedHotspots />
        <Heading className="mb-16 mt-12" color="yellow">
          More Information
        </Heading>
        <div className="sm:grid grid-cols-2 gap-16">
          <div>
            <p className="mb-4">
              This website collects tips for birding from local birders and descriptions and maps of eBird hotspots from
              eBird and other websites. In eBird, hotspots are shared locations where birders may report their bird
              sightings to eBird. Hotspots provide birders with information about birding locations where birds are
              being seen.
            </p>
            <EbirdDescription />
            <h3 className="text-lg font-bold mb-1.5">eBird can help you</h3>
            <p className="mb-4">
              + Record the birds you see+ Keep track of your bird lists
              <br />+ Explore dynamic maps and graphs
              <br />+ Share your sightings and join the eBird community
              <br />+ Contribute to science and conservation
            </p>
          </div>
          <div>
            <p className="mb-4">
              In eBird, Hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots
              provide birders with information about birding locations where birds are being seen.
            </p>
            <h3 className="text-lg font-bold mb-1.5">Links to eBird website</h3>
            <p className="mb-4">
              <a href="https://ebird.org/about" target="_blank" rel="noreferrer">
                About eBird
              </a>
              <br />
              <a href="https://ebird.org/hotspots" target="_blank" rel="noreferrer">
                eBird Hotspot Explorer
              </a>
              <br />
              <a href="https://support.ebird.org/en/support/home" target="_blank" rel="noreferrer">
                eBird Help Documents
              </a>
              <br />
              <a
                href="https://confluence.cornell.edu/display/CLOISAPI/eBird-1.1-HotSpotsByRegion"
                target="_blank"
                rel="noreferrer"
              >
                Lists of all eBird Hotspots worldwide
              </a>
              <br />
              <a href="https://www.facebook.com/ebird/" target="_blank" rel="noreferrer">
                eBird Facebook page
              </a>
            </p>
            <h3 className="text-lg font-bold mb-1.5">Tips on Managing Your eBird Records</h3>
            <p className="mb-4">
              <a
                href="https://support.ebird.org/en/support/solutions/articles/48001158707-get-started-with-ebird"
                target="_blank"
                rel="noreferrer"
              >
                Get started with eBird
              </a>
              <br />
              <a
                href="https://support.ebird.org/en/support/solutions/articles/48000960317-ebird-alerts-and-targets-faqs"
                target="_blank"
                rel="noreferrer"
              >
                eBird Alerts and Targets
              </a>
              <br />
              <a
                href="https://support.ebird.org/en/support/solutions/articles/48000625567-checklist-sharing-and-group-accounts#anchorEditChecklists"
                target="_blank"
                rel="noreferrer"
              >
                Edit an eBird checklist
              </a>
              <br />
              <a
                href="https://support.ebird.org/en/support/solutions/articles/48000625567-checklist-sharing-and-group-accounts#anchorShareChecklists"
                target="_blank"
                rel="noreferrer"
              >
                Sharing eBird checklists
              </a>
              <br />
              <a href="https://support.ebird.org/en/support/solutions/articles/48001009443-ebird-hotspot-faqs#anchorMergeWithHotspot">
                How do I merge a personal location with an existing Hotspot?
              </a>
              <br />
              <a href="https://support.ebird.org/en/support/solutions/articles/48001009443-ebird-hotspot-faqs#anchorSuggestHotspot">
                How do I suggest a new Hotspot?
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
