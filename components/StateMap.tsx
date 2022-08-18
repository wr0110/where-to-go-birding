import dynamic from "next/dynamic";

type Props = {
  regionCode: string;
};

//SVG maps adapted from https://www.createaclickablemap.com/counties-california.php?maplocation=ca
export default function StateMap({ regionCode }: Props) {
  const Map = dynamic(() => import(`./state-maps/${regionCode}`));
  return <Map />;
}
