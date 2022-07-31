import Search from "components/Search";
import Link from "next/link";
import Location from "icons/Location";

export default function Banner() {
  return (
    <div className="bg-puffin w-full min-h-[250px] md:min-h-[350px]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-4 text-gray-600 font-medium mt-8">The Birding Hotspot Database</h1>
        <h2 className="text-[16px] mb-6 font-medium text-gray-600">
          Discover tips, maps, and images for thousands of eBird hotspots
        </h2>
        <div className="md:max-w-lg">
          <Search pill />
          <p className="mt-3 pl-2 font-bold">
            <Link href="/explore">
              <a className="flex items-center gap-2">
                <Location />
                Explore nearby hotspots
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
