import { getLatestHotspots } from "lib/mongo";
import PageHeading from "components/PageHeading";
import { GetServerSideProps } from "next";
import Title from "components/Title";
import dayjs from "dayjs";
import Link from "next/link";
import { getCountyByCode, getStateByCode } from "lib/localData";

type HotspotMap = {
  [x: string]: {
    name: string;
    url: string;
    location: string;
  }[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const hotspots = (await getLatestHotspots()) || [];
  let dates: HotspotMap = {};
  hotspots.forEach(({ createdAt, countyCode, multiCounties, stateCode, url, name }) => {
    if (!createdAt) return;
    if (!dates[createdAt]) {
      dates[createdAt] = [];
    }
    const state = getStateByCode(stateCode);
    const county = getCountyByCode(countyCode);
    const isGroup = multiCounties?.length;
    const location = isGroup ? state?.label || "" : `${county?.name} County, ${state?.label}`;
    dates[createdAt].push({ name, url, location });
  });

  const hotspotsByDate =
    Object.entries(dates).map(([key, hotspots]) => {
      return {
        date: key,
        hotspots,
      };
    }) || [];

  return {
    props: { hotspots: hotspotsByDate },
  };
};

type Props = {
  hotspots: {
    date: string;
    hotspots: {
      name: string;
      url: string;
      location: string;
    }[];
  }[];
};

export default function WhatsNew({ hotspots }: Props) {
  return (
    <div className="container pb-16 mt-12">
      <Title>What&apos;s New</Title>
      <PageHeading breadcrumbs={false}>What&apos;s New</PageHeading>
      <div>
        {hotspots.map(({ date, hotspots }) => (
          <div key={date}>
            <h3 className="text-lg mb-4 mt-6 font-bold">{dayjs(date).format("MMMM D, YYYY")}</h3>
            <div key={date} className="mb-4">
              {hotspots.map(({ name, url, location }) => (
                <p className="mb-5 leading-5" key={url}>
                  <Link href={url}>
                    <a className="font-bold">{name}</a>
                  </Link>
                  <br />
                  <span className="text-xs rounded text-gray-500 inline-block">{location}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
