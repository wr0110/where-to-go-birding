type Props = {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number | null;
  type?: string;
  className?: string;
};

export default function Map({ type = "satellite", address, lat, lng, zoom = 15, className }: Props) {
  const query = address || `${lat},${lng}`;
  let url = `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&center=${query}&maptype=${type}`;
  if (zoom) {
    url = `${url}&zoom=${zoom}`;
  }
  return (
    <iframe
      key={url}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={url}
      className={`aspect-[4/3.5] ${className || "w-full"}`}
    />
  );
}
