type Props = {
	region: string,
}

export default function EbirdBarcharts({ region }: Props) {
	return (
		<div className="mb-6 p-2 border-2 border-[#4a84b2] rounded">
			<h3 className="font-bold text-lg">eBird Bar Charts</h3>
			<p>
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=1&emo=12&r=${region}`}>Entire Year</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=3&emo=5&r=${region}`}>Spring</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=6&emo=7&r=${region}`}>Summer</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=8&emo=11&r=${region}`}>Fall</a>
				&nbsp;–&nbsp;
				<a href={`https://ebird.org/barchart?byr=1900&eyr=2060&bmo=12&emo=2&r=${region}`}>Winter</a>
			</p>
		</div>
	)
}