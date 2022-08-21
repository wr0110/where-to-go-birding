import Link from "next/link";

type Props = {
  countrySlug: string;
  features: string[];
  slug: string;
};

export default function StateFeatureLinks({ countrySlug, features, slug }: Props) {
  return (
    <p className="mb-8">
      {features.includes("drives") && (
        <>
          <Link href={`/${countrySlug}/${slug}/drives`}>Birding Drives</Link>
          <br />
        </>
      )}
      {features.includes("roadside") && (
        <>
          <Link href={`/${countrySlug}/${slug}/roadside-birding`}>Roadside Birding</Link>
          <br />
        </>
      )}
      {features.includes("accessible") && (
        <>
          <Link href={`/${countrySlug}/${slug}/accessible-facilities`}>Accessible Facilities</Link>
          <br />
        </>
      )}
      {features.includes("iba") && (
        <>
          <Link href={`/${countrySlug}/${slug}/important-bird-areas`}>Audubon Important Bird Areas</Link>
          <br />
        </>
      )}
    </p>
  );
}
