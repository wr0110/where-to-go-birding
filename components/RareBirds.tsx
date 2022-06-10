type Props = {
	region: string,
	label: string,
}

export default function RareBirds({ region, label }: Props) {
	return (
		<div>
			<h3 className="text-lg font-bold" id="notable">{label} Notable Sightings</h3>
			<p className="text-sm text-gray-700 mb-3">Birds reported to eBird in the last 7 days</p>
			<iframe loading="lazy" src={`https://www.birdfinder.net/region.php?region=${region}`} height="800" className="w-full border-2 mb-2" />
			<p className="text-xs text-gray-700">
				View <a href={`https://www.birdfinder.net/region.php?region=${region}`} target="_blank" rel="noreferrer">{label} Notable Sightings</a> in a new tab
				<br/>
				Thanks to Ed Norton for designing Notable Sightings
			</p>
		</div>
	)
}