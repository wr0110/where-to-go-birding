import Link from "next/link";

type Props = {
  hotspots: {
    name: string;
    url?: string;
    total: number;
  }[];
};

export default function TopHotspotList({ hotspots }: Props) {
  return (
    <ul>
      {hotspots?.map(({ name, url }) => (
        <li key={name}>
          {url ? <Link href={url}>{name}</Link> : <span>{name}</span>}
        </li>
      ))}
    </ul>
  );
}
