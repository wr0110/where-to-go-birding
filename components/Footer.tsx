import FacebookIcon from "icons/Facebook";
import TwitterIcon from "icons/Twitter";

type Props = {
	stateLabel: string,
	facebook: string,
	twitter: string,
}

export default function Footer({ stateLabel, facebook, twitter }: Props) {
	return (
		<footer>
			<div className="bg-[#4a84b2] py-16">
				<div className="container flex items-center">
					<img src="/footer.png" width={100} className="basis-0" />
					<p className="text-gray-900 text-[1rem] max-w-3xl ml-auto">
						<strong>This website provides descriptions and maps of <a href="https://ebird.org" className="text-gray-900" target="_blank" rel="noreferrer">eBird</a> Hotspots in {stateLabel}</strong>. In eBird, Hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots provide birders with information about birding locations where birds are being seen.
					</p>
				</div>
			</div>
			<div className="bg-[#325a79] py-3">
				<div className="container flex gap-6 justify-end text-2xl">
					<a href={`https://www.facebook.com/`} className="text-white" target="_blank" rel="noreferrer">
						<FacebookIcon />
					</a>
					<a href={`https://twitter.com/oos_birds`} className="text-white" target="_blank" rel="noreferrer">
						<TwitterIcon />
					</a>
				</div>
			</div>
		</footer>
	)
}