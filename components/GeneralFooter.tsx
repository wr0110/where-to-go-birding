import Logo from "components/Logo";
import Link from "next/link";

export default function OhioFooter() {
  return (
    <div className="bg-[#4a84b2] py-16 text-white">
      <div className="container grid md:grid-cols-4 gap-8">
        <div className="flex gap-2 flex-col">
          <a
            href="https://ohiobirds.org/"
            className="flex gap-4 px-2 py-2 rounded bg-white items-center"
            target="_blank"
            rel="noreferrer"
          >
            <Logo className="w-12" />
            <div className="leading-3 pb-0.5">
              <strong className="text-lg text-gray-700 font-normal">Birding Hotspots</strong>
              <br />
              <em className="text-[0.8em] text-[#92ad39] font-medium">Where to Go Birding</em>
            </div>
          </a>
          <p>This website is managed by Ken Ostermiller, Adam Jackson, and other volunteers.</p>
        </div>
        <div />

        <section />

        <section>
          <h3 className="text-lg font-bold mb-2">Learn More</h3>
          <Link href="/about">
            <a className="text-white">About This Website</a>
          </Link>
          <br />
          <Link href="/about-ebird">
            <a className="text-white">About eBird</a>
          </Link>
          <br />
          <Link href="/contact">
            <a className="text-white">Contact</a>
          </Link>
          <br />
          <Link href="/license">
            <a className="text-white">License & Copyright</a>
          </Link>
        </section>
      </div>
    </div>
  );
}
