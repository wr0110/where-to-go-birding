import Link from "next/link";

type Props = {
  className?: string;
  hotspots: {
    name: string;
    url?: string;
    total: number;
  }[];
};

export default function TopHotspotList({ hotspots, className }: Props) {
  return (
    <ul className={className || ""}>
      {hotspots?.map(({ name, url, total }) => (
        <li key={name}>
          {url ? <Link href={url}>{name}</Link> : <span>{name}</span>}
          &nbsp;-&nbsp;{total}&nbsp;species
        </li>
      ))}
    </ul>
  );
}
