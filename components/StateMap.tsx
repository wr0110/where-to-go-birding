import dynamic from "next/dynamic";

type Props = {
  regionCode: string;
};

export default function StateMap({ regionCode }: Props) {
  const Map = dynamic(() => import(`./state-maps/${regionCode}`));
  return <Map />;
}
