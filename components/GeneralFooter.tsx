import Logo from "components/Logo";
import Link from "next/link";

export default function OhioFooter() {
  return (
    <div className="bg-[#4a84b2] py-16 text-white">
      <div className="container grid md:grid-cols-4 gap-8">
        <div className="flex gap-2 flex-col">
          <a
            href="https://ohiobirds.org/"
            className="flex gap-4 px-2 py-1 rounded bg-white items-center"
            target="_blank"
            rel="noreferrer"
          >
            <Logo className="w-12" />
            <strong className="text-lg text-gray-700 font-normal">Birding Hotspots</strong>
          </a>
          <p>This website is run by Ken Ostermiller, Adam Jackson and other volunteers.</p>
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
        </section>
      </div>
    </div>
  );
}
