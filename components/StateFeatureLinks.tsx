import Link from "next/link";

type Props = {
	features: string[],
	slug: string,
}

export default function StateFeatureLinks({ features, slug }: Props) {
	return (
		<p className="mb-4">
			{features.includes("drives") && (
				<>
					<Link href={`/birding-in-${slug}/birding-drives`}>Birding Drives</Link>
					<br />
				</>
			)}
			{features.includes("hikes") && (
				<>
					<Link href={`/birding-in-${slug}/birding-day-hikes`}>Birding Day Hikes</Link>
					<br />
				</>
			)}
			{features.includes("roadside") && (
				<>
					<Link href={`/birding-in-${slug}/roadside-birding`}>Roadside Birding</Link>
					<br />
				</>
			)}
			{features.includes("accessible") && (
				<>
					<Link href={`/birding-in-${slug}/accessible-facilities`}>Accessible Facilities</Link>
					<br />
				</>
			)}
			{features.includes("iba") && (
				<>
					<Link href={`/birding-in-${slug}/important-bird-areas`}>Audubon Important Bird Areas</Link><br/>
					<br />
				</>
			)}
		</p>
	)
}