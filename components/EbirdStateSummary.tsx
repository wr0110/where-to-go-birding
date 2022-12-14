import { State } from "lib/types";

export default function EbirdStateSummary({ code, color, label, portal }: State) {
  const getUrl = (bMonth: number, eMonth: number) => {
    return `${base}/barchart?byr=1900&eyr=2060&bmo=${bMonth}&emo=${eMonth}&r=${code}`;
  };

  const base = portal ? `https://ebird.org/${portal}` : "https://ebird.org";

  return (
    <section className="mb-8 p-2 border-2 rounded" style={{ borderColor: color || "#4a84b2" }}>
      <h3 className="text-lg mb-2 font-bold">Explore {label} in eBird</h3>
      {portal && (
        <a href={`${base}/about`} target="_blank" rel="noreferrer">
          <strong>{label} eBird Portal</strong>
        </a>
      )}
      <p className="mb-1">
        <a href={`${base}/region/${code}?yr=all&m=&rank=mrec`} target="_blank" rel="noreferrer">
          Overview
        </a>
        &nbsp;–&nbsp;
        <a
          href={`${base}/region/${code}/regions?yr=all&m=&hsStats_sortBy=num_species&hsStats_o=desc`}
          target="_blank"
          rel="noreferrer"
        >
          Counties
        </a>
        &nbsp;–&nbsp;
        <a href={`${base}/region/${code}/hotspots?yr=all&m=`} target="_blank" rel="noreferrer">
          Hotspots
        </a>
        &nbsp;–&nbsp;
        <a href={`${base}/region/${code}/activity?yr=all&m=`} target="_blank" rel="noreferrer">
          Recent Visits
        </a>
      </p>
      <strong>Statewide Bar Charts</strong>
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
      <a href={`${base}/region/${code}/media?yr=all&m=`} target="_blank" rel="noreferrer">
        Illustrated Checklist
      </a>
      <p className="mb-1">
        <strong>Top eBirders</strong>
        <br />
        <a
          href={`${base}/top100?locInfo.regionType=subnational1&locInfo.regionCode=${code}&year=AAAA`}
          target="_blank"
          rel="noreferrer"
        >
          All Time
        </a>
        &nbsp;–&nbsp;
        <a
          href={`${base}/top100?locInfo.regionType=subnational1&locInfo.regionCode=${code}&year=${new Date().getFullYear()}`}
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
          href={`${base}/MyEBird?cmd=list&rtype=subnational1&r=${code}&time=life&sortKey=obs_dt&o=desc`}
          target="_blank"
          rel="noreferrer"
        >
          Life List
        </a>
        &nbsp;–&nbsp;
        <a
          href={`${base}/MyEBird?cmd=lifeList&listType=${code}&listCategory=allStates&time=year`}
          target="_blank"
          rel="noreferrer"
        >
          Year List
        </a>
        &nbsp;–&nbsp;
        <a
          href={`${base}/MyEBird?cmd=lifeList&listType=${code}&listCategory=allStates&time=month`}
          target="_blank"
          rel="noreferrer"
        >
          Month List
        </a>
      </p>
    </section>
  );
}
