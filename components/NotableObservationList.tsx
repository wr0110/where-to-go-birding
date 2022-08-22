import { truncate } from "lib/helpers";
import Timeago from "components/Timeago";
import { CameraIcon } from "@heroicons/react/outline";
import { NotableReport } from "lib/types";

type Props = {
  items: NotableReport[];
};

export default function NotableObservationList({ items }: Props) {
  return (
    <ul className="pl-1 pr-4 pb-4 flex flex-col gap-5 mt-2">
      {items?.map(({ id, location, checklistId, userDisplayName, lat, lng, hasRichMedia, countyName, date }) => (
        <li key={id + userDisplayName} className="rounded-sm bg-white">
          <div className="flex items-start">
            <h4 className="text-slate-900 text-[0.92em] font-medium mr-auto">
              {truncate(location, 64)}, {countyName} County
            </h4>
          </div>

          <p className="text-gray-500 text-[0.85em] leading-5 font-medium">
            {hasRichMedia && <CameraIcon className="mr-1.5 w-4 h-4 inline text-lime-600" />}
            <Timeago datetime={date} /> by {userDisplayName}
          </p>
          <div className="text-[0.85em] mt-1.5 space-x-3 font-medium">
            <a
              href={`https://ebird.org/checklist/${checklistId}`}
              className="text-sky-800"
              target="_blank"
              rel="noreferrer"
            >
              View Checklist
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              className="text-sky-800"
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
