type Props = {
	code: string,
	rareSid?: string,
	needsSid?: string,
	yearNeedsSid?: string,
	label: string,
	color?: string,
	portal?: string,
}

export default function EbirdCountySummary({ code, label, rareSid, needsSid, yearNeedsSid, color="#4a84b2", portal }: Props) {
	const getUrl = (bMonth: number, eMonth: number) => {
		return `${base}/barchart?byr=1900&eyr=2060&bmo=${bMonth}&emo=${eMonth}&r=${code}`;
	}

	const base = portal ? `https://ebird.org/${portal}` : "https://ebird.org";

	return (
		<div className={`mb-6 p-2 border-2 border-[${color}] rounded`}>
			<h3 className="text-lg mb-2 font-bold">Explore {label} County in eBird</h3>
			<p className="mb-1">
				<a href={`${base}/region/${code}`} target="_blank" rel="noreferrer">Overview</a>
				&nbsp;–&nbsp;
				<a href={`${base}/region/${code}/hotspots?yr=all&m=`} target="_blank" rel="noreferrer">Hotspots</a>
				&nbsp;–&nbsp;
				<a href={`${base}/region/${code}/activity?yr=all&m=`} target="_blank" rel="noreferrer">Recent Visits</a>
			</p>
			<strong>Bar Charts</strong>
			<br />
			<a href={getUrl(1, 12)} target="_blank" rel="noreferrer">Entire Year</a>
			&nbsp;–&nbsp;
			<a href={getUrl(3, 5)} target="_blank" rel="noreferrer">Spring</a>
			&nbsp;–&nbsp;
			<a href={getUrl(6, 7)} target="_blank" rel="noreferrer">Summer</a>
			&nbsp;–&nbsp;
			<a href={getUrl(8, 11)} target="_blank" rel="noreferrer">Fall</a>
			&nbsp;–&nbsp;
			<a href={getUrl(12, 2)} target="_blank" rel="noreferrer">Winter</a>
			<br/>
			<a href={`${base}/region/${code}/media?yr=all&m=`} target="_blank" rel="noreferrer">Illustrated Checklist</a>
			<br/>
			{rareSid &&
				<p className="mb-1">
					<strong>Rare Bird Alert</strong><br />
					<a href={`${base}/alert/summary?sid=${rareSid}`}>{label}</a>
				</p>
			}
			<p  className="mb-1">
				<strong>Top eBirders</strong><br />
				<a href={`${base}/top100?locInfo.regionCode=${code}&year=AAAA&locInfo.regionType=subnational2`} target="_blank" rel="noreferrer">All Time</a>
				&nbsp;–&nbsp;
				<a href={`${base}/top100?year=${(new Date()).getFullYear()}&locInfo.regionType=subnational2&locInfo.regionCode=${code}`} target="_blank" rel="noreferrer">Current Year</a>
			</p>
			<p className="mb-1">
				<strong>My eBird Links</strong><br />
				<a href={`${base}/MyEBird?cmd=lifeList&listType=${code}&listCategory=allCounties&time=life`} target="_blank" rel="noreferrer" >Life List</a>
				&nbsp;–&nbsp;
				<a href={`${base}/MyEBird?cmd=lifeList&listType=${code}&listCategory=allCounties&time=year`} target="_blank" rel="noreferrer">Year List</a>
				&nbsp;–&nbsp;
				<a href={`${base}/MyEBird?cmd=lifeList&listType=${code}&listCategory=allCounties&time=month`} target="_blank" rel="noreferrer">Month List</a>
			</p>
			{(needsSid && yearNeedsSid) &&
				<p className="mb-1">
					<strong>Needs Alerts (birds you have not seen in {label})</strong><br />
					<a href={`${base}/alert/summary?sid=${needsSid}`} rel="noreferrer" target="_blank">Never Seen</a>
					&nbsp;–&nbsp;
					<a href={`${base}/alert/summary?sid=${yearNeedsSid}`}  rel="noreferrer" target="_blank">Not Seen This Year</a>
				</p>
			}
		</div>
	)
}