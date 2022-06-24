import Heading from "components/Heading";

type Props = {
  region: string;
  label: string;
  className?: string;
};

export default function RareBirds({ region, label, className }: Props) {
  return (
    <div className={`${className || ""}`}>
      <Heading className="text-lg font-bold mb-6" color="turquoise" id="notable">
        {label} Notable Sightings <br />
        <span className="text-sm text-gray-100 mb-3">Birds reported to eBird in the last 7 days</span>
      </Heading>
      <iframe
        loading="lazy"
        src={`https://www.birdfinder.net/region.php?region=${region}`}
        height="800"
        className="w-full border-2 mb-2"
      />
      <p className="text-xs text-gray-700">
        View{" "}
        <a href={`https://www.birdfinder.net/region.php?region=${region}`} target="_blank" rel="noreferrer">
          {label} Notable Sightings
        </a>{" "}
        in a new tab
        <br />
        Thanks to Ed Norton for designing Notable Sightings
      </p>
    </div>
  );
}
