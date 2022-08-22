import Heading from "components/Heading";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { NotableReport } from "lib/types";
import { truncate } from "lib/helpers";
import Timeago from "components/Timeago";
import NotableObservationList from "components/NotableObservationList";

type Report = {
  name: string;
  code: string;
  reports: NotableReport[];
  isExpanded?: boolean;
};

type Props = {
  region: string;
  label: string;
  className?: string;
};

export default function RareBirds({ region, label, className }: Props) {
  const [viewAll, setViewAll] = React.useState(false);
  const [notable, setNotable] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<Dayjs | null>();

  const call = React.useCallback(async () => {
    setLoading(true);
    setNotable([]);
    try {
      const response = await fetch(`/api/notable?region=${region}`);
      const species = await response.json();
      if (Array.isArray(species)) {
        setNotable(species);
        setLastUpdate(dayjs());
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [region]);

  React.useEffect(() => {
    call();
  }, [call]);

  const handleOpen = (code: string) => {
    setNotable((items) =>
      items.map((item) => {
        if (item.code === code) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        return item;
      })
    );
  };

  const filtered = viewAll ? notable : notable.slice(0, 5);
  const showViewAll = !viewAll && notable.length > 5;

  return (
    <div className={`${className || ""}`}>
      <Heading className="text-lg font-bold mb-6" color="turquoise" id="notable">
        {label} Notable Sightings <br />
        <span className="text-sm text-gray-100 mb-3">Birds reported to eBird in the last 7 days</span>
      </Heading>
      <div>
        {filtered?.map(({ name, code, reports, isExpanded }) => {
          const date = reports[0]?.date;
          return (
            <article key={code} className="mb-3 border border-gray-200 bg-white shadow-sm rounded-md w-full">
              <header className="xs:flex px-3 py-2">
                <div className="flex flex-col">
                  <h4 className="font-bold">{name}</h4>
                  <button
                    type="button"
                    className="whitespace-nowrap text-left text-sky-700 block text-[13px]"
                    onClick={() => handleOpen(code)}
                  >
                    {isExpanded ? "Hide" : "Show"}&nbsp;
                    {reports.length} {reports.length === 1 ? "Report" : "Reports"}
                  </button>
                </div>
                <div className="whitespace-nowrap ml-auto">
                  <span className="bg-gray-300 text-gray-700 rounded-sm px-2 py-1 text-xs whitespace-nowrap font-medium">
                    <Timeago datetime={date} />
                  </span>
                </div>
              </header>
              {isExpanded && (
                <ul className="pl-4 pr-4 pb-4 flex flex-col gap-4">
                  <NotableObservationList items={reports} />
                </ul>
              )}
            </article>
          );
        })}
      </div>
      {loading && <p className="text-gra-700">Loading...</p>}
      {!loading && notable.length === 0 && <p className="text-gra-700">No notable reports in the last 7 days.</p>}
      <div className="flex items-center">
        {showViewAll && (
          <button
            type="button"
            className="whitespace-nowrap text-left text-sky-700 block font-bold"
            onClick={() => setViewAll(true)}
          >
            View All Reports
          </button>
        )}
        {lastUpdate && !loading && (
          <span className="text-xs text-gray-500 ml-auto">
            Updated <Timeago datetime={lastUpdate.toString()} />
            &nbsp;-&nbsp;
            <button type="button" className="text-blue-900" onClick={call}>
              Reload
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
