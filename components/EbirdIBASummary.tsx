type Props = {
	region: string,
}

export default function EbirdIBASummary({ region }: Props) {
	return (
		<div className="mb-6">
			<h3 className="font-bold">eBird Bar Charts</h3>
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