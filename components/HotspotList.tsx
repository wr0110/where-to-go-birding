import Link from "next/link";

type Props = {
  className?: string;
  hotspots: {
    name: string;
    url: string;
  }[];
};

export default function HotspotList({ hotspots, className }: Props) {
  return (
    <ul className={className || ""}>
      {hotspots?.map(({ name, url }) => (
        <li key={url}>
          <Link href={url}>{name}</Link>
        </li>
      ))}
    </ul>
  );
}
