import Link from "next/link";

type Props = {
  features: string[];
  slug: string;
};

export default function StateFeatureLinks({ features, slug }: Props) {
  return (
    <p className="mb-8">
      {features.includes("drives") && (
        <>
          <Link href={`/${slug}/birding-drives`}>Birding Drives</Link>
          <br />
        </>
      )}
      {features.includes("hikes") && (
        <>
          <Link href={`/${slug}/birding-day-hikes`}>Birding Day Hikes</Link>
          <br />
        </>
      )}
      {features.includes("roadside") && (
        <>
          <Link href={`/${slug}/roadside-birding`}>Roadside Birding</Link>
          <br />
        </>
      )}
      {features.includes("accessible") && (
        <>
          <Link href={`/${slug}/accessible-facilities`}>Accessible Facilities</Link>
          <br />
        </>
      )}
      {features.includes("iba") && (
        <>
          <Link href={`/${slug}/important-bird-areas`}>Audubon Important Bird Areas</Link>
          <br />
        </>
      )}
    </p>
  );
}
