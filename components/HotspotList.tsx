import Link from "next/link";

type Props = {
	hotspots: {
		name: string,
		url: string,
	}[],
}

export default function HotspotList({ hotspots }: Props) {
	return (
		<ul>
			{hotspots?.map(({ name, url }) => (
				<li key={url}>
					<Link href={url}>{name}</Link>
				</li>
			))}
		</ul>
	)
}