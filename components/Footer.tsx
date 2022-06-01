export default function Footer() {
	return (
		<footer>
			<div className="bg-[#4a84b2] py-16">
				<div className="container md:flex gap-8 items-center">
					<img src="/footer.png" width={75} className="basis-0 -mt-4" />
					<p className="text-gray-900 text-[1rem] max-w-md lg:max-w-3xl mt-4 md:mt-0 md:ml-auto">
						<strong>This website provides descriptions and maps of <a href="https://ebird.org" className="text-gray-900" target="_blank" rel="noreferrer">eBird</a> Hotspots in the United States</strong>. In eBird, Hotspots are shared locations where birders may report their bird sightings to eBird. Hotspots provide birders with information about birding locations where birds are being seen.
					</p>
				</div>
			</div>
			<div className="bg-[#325a79] py-3 text-xs text-gray-300 text-center">
				© 2022 eBird Hotspots – All rights reserved.
			</div>
		</footer>
	)
}