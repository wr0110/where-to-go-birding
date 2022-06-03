export default function EbirdTable({heading, stateCode}) {
	const getUrl = (bMonth: number, eMonth: number) => {
		return `https://ebird.org/vt/GuideMe?reportType=location&bMonth=${bMonth}&bYear=1900&eMonth=${eMonth}&eYear=2060&parentState=${stateCode}&countries=US&states=US-VT&getLocations=states&continue.x=0&continue.y=0&continue=t`;
	}

	return (
		<table className="scale-[0.68] xs:scale-90 sm:scale-100 origin-top-left border border-gray-500 text-center mb-4">
			<tbody>
				<tr>
					<th colSpan={12} className="border border-gray-500">{heading}</th>
				</tr>
				<tr>
					<th colSpan={12} className="border border-gray-500">
						<a href={getUrl(1, 12)} target="_blank" rel="noreferrer">All Months</a>
					</th>
				</tr>
				<tr>
					<Td color="C7E466" url={getUrl(3, 3)}>Mar</Td>
					<Td color="C7E466" url={getUrl(4, 4)}>Apr</Td>
					<Td color="C7E466" url={getUrl(5, 5)}>May</Td>
					<Td color="CE0D02" url={getUrl(6, 6)} textLight>Jun</Td>
					<Td color="CE0D02" url={getUrl(7, 7)} textLight>Jul</Td>
					<Td color="E57701" url={getUrl(8, 8)} textLight>Aug</Td>
					<Td color="E57701" url={getUrl(9, 9)} textLight>Sep</Td>
					<Td color="E57701" url={getUrl(10, 10)} textLight>Oct</Td>
					<Td color="E57701" url={getUrl(11, 11)} textLight>Nov</Td>
					<Td color="AADDEB" url={getUrl(12, 12)}>Dec</Td>
					<Td color="AADDEB" url={getUrl(1, 1)}>Jan</Td>
					<Td color="AADDEB" url={getUrl(2, 2)}>Feb</Td>
				</tr>
				<tr>
					<Td span={3} color="C7E466" url={getUrl(3, 5)}>Spring</Td>
					<Td span={2} color="CE0D02" url={getUrl(6, 7)} textLight>Summer</Td>
					<Td span={4} color="E57701" url={getUrl(8, 11)} textLight>Fall</Td>
					<Td span={3} color="AADDEB" url={getUrl(12, 2)}>Winter</Td>
				</tr>
			</tbody>
		</table>
	)
}

type TdProps = {
	color: string,
	url: string
	span?: number,
	textLight?: boolean,
	children: React.ReactNode,
}

function Td({span=1, url, color, textLight, children}: TdProps) {
	return (
		<td colSpan={span} className={`px-2.5 py-1.5 text-xs border border-gray-500`} style={{ background: `#${color}` }}>
			<a href={url} target="_blank" rel="noreferrer" className={textLight ? "text-white" : "text-black"}>{children}</a>
		</td>
	);
}