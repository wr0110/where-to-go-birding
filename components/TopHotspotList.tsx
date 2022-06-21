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
    <ul className="mb-6">
      {hotspots?.map(({ name, url, total }) => (
        <li key={name}>
          {url ? <Link href={url}>{name}</Link> : <span>{name}</span>}
          &nbsp;-&nbsp;{total}&nbsp;species
        </li>
      ))}
    </ul>
  );
}
