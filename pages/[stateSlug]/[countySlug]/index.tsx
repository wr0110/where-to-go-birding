import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getHotspots } from "lib/firebase";

export default function County() {
	const [hotspots, setHotspots] = React.useState<any>();
	const router = useRouter();
	const countySlug = (router.query.countySlug as string)?.replace("-county", "");
	const countyColor = "#92ad39";

	const countyName = "Summit County";

	React.useEffect(() => {
		const fetchData = async () => {
			const data = await getHotspots(countySlug);
			setHotspots(data);
		}
		if (countySlug) fetchData();
	}, [countySlug]);

	return (
		<div className="container pb-16">
			<h1 className="font-bold text-white text-2xl header-gradient p-3 my-16" style={{"--county-color": countyColor} as React.CSSProperties}>{countyName}</h1>
			<div className="grid grid-cols-2 gap-12">
				<div>
					<ol>
						{hotspots?.map(({ name, slug }) => (
							<li key={slug}>
								<Link href={`/${countySlug}-county/${slug}`}>{name}</Link>
							</li>
						))}
					</ol>
				</div>
				<div></div>
			</div>
			<hr className="my-4"/>
			<p>
				<Link href="/add">Add Hotspot</Link>
			</p>
		</div>
	)
}
