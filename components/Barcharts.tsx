type Props = {
	locationId: string,
}

export default function Barcharts({ locationId }: Props) {
	return (
		<div className="mb-10 text-center max-w-sm">
			<h3 className="mb-4 font-bold">eBird Bar Charts by Season</h3>
			<div className="flex flex-col text-white">
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=1&emo=12&r=${locationId}`} className="bg-[#efefef] text-[#2ea3f2] py-2.5">Entire Year</a>
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=3&emo=5&r=${locationId}`} className="bg-[#92ad39] text-white py-2.5">Spring Migration (Mar-May)</a>
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=6&emo=7&r=${locationId}`} className="bg-[#ce0d02] text-white py-2.5">Breeding Season (Jun-Jul)</a>
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=8&emo=11&r=${locationId}`} className="bg-[#e57701] text-white py-2.5">Fall Migration (Aug-Nov)</a>
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=12&emo=2&r=${locationId}`} className="bg-[#4a84b2] text-white py-2.5">Winter (Dec – Feb)</a>
			</div>
		</div>
	)
}