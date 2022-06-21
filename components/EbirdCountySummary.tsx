import { State, County } from "lib/types";

type Props = {
  state?: State;
  county?: County;
};

export default function EbirdCountySummary({ state, county }: Props) {
  const { ebirdCode, name } = county || ({} as County);
  const { color, portal } = state || ({} as State);

  const getUrl = (bMonth: number, eMonth: number) => {
    return `${base}/barchart?byr=1900&eyr=2060&bmo=${bMonth}&emo=${eMonth}&r=${ebirdCode}`;
  };

  const base = portal ? `https://ebird.org/${portal}` : "https://ebird.org";

  return (
    <section className={`p-2 border-2 rounded`} style={{ borderColor: color || "#4a84b2" }}>
      <h3 className="text-lg mb-2 font-bold">Explore {name} County in eBird</h3>
      <p className="mb-1">
        <a href={`${base}/region/${ebirdCode}`} target="_blank" rel="noreferrer">
          Overview
        </a>
        &nbsp;–&nbsp;
        <a href={`${base}/region/${ebirdCode}/hotspots?yr=all&m=`} target="_blank" rel="noreferrer">
          Hotspots
        </a>
        &nbsp;–&nbsp;
        <a href={`${base}/region/${ebirdCode}/activity?yr=all&m=`} target="_blank" rel="noreferrer">
          Recent Visits
        </a>
      </p>
      <strong>Bar Charts</strong>
      <br />
      <a href={getUrl(1, 12)} target="_blank" rel="noreferrer">
        Entire Year
      </a>
      &nbsp;–&nbsp;
      <a href={getUrl(3, 5)} target="_blank" rel="noreferrer">
        Spring
      </a>
      &nbsp;–&nbsp;
      <a href={getUrl(6, 7)} target="_blank" rel="noreferrer">
        Summer
      </a>
      &nbsp;–&nbsp;
      <a href={getUrl(8, 11)} target="_blank" rel="noreferrer">
        Fall
      </a>
      &nbsp;–&nbsp;
      <a href={getUrl(12, 2)} target="_blank" rel="noreferrer">
        Winter
      </a>
      <br />
      <a href={`${base}/region/${ebirdCode}/media?yr=all&m=`} target="_blank" rel="noreferrer">
        Illustrated Checklist
      </a>
      <br />
      <p className="mb-1">
        <strong>Top eBirders</strong>
        <br />
        <a
          href={`${base}/top100?locInfo.regionCode=${ebirdCode}&year=AAAA&locInfo.regionType=subnational2`}
          target="_blank"
          rel="noreferrer"
        >
          All Time
        </a>
        &nbsp;–&nbsp;
        <a
          href={`${base}/top100?year=${new Date().getFullYear()}&locInfo.regionType=subnational2&locInfo.regionCode=${ebirdCode}`}
          target="_blank"
          rel="noreferrer"
        >
          Current Year
        </a>
      </p>
      <p className="mb-1">
        <strong>My eBird Links</strong>
        <br />
        <a
          href={`${base}/MyEBird?cmd=lifeList&listType=${ebirdCode}&listCategory=allCounties&time=life`}
          target="_blank"
          rel="noreferrer"
        >
          Life List
        </a>
        &nbsp;–&nbsp;
        <a
          href={`${base}/MyEBird?cmd=lifeList&listType=${ebirdCode}&listCategory=allCounties&time=year`}
          target="_blank"
          rel="noreferrer"
        >
          Year List
        </a>
        &nbsp;–&nbsp;
        <a
          href={`${base}/MyEBird?cmd=lifeList&listType=${ebirdCode}&listCategory=allCounties&time=month`}
          target="_blank"
          rel="noreferrer"
        >
          Month List
        </a>
      </p>
    </section>
  );
}
