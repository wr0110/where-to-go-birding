type Props = {
	address?: string,
	lat?: number,
	lng?: number,
	zoom?: number | null,
	type?: string,
}

export default function Map({ type="satellite", address, lat, lng, zoom=15 }: Props) {
	const query = address || `${lat},${lng}`;
	let url = `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&center=${query}&maptype=${type}`;
	if (zoom) {
		url = `${url}&zoom=${zoom}`;
	}
	return (
		<iframe
			key={url}
			width="600"
			height="450"
			style={{ border: 0 }}
			loading="lazy"
			allowFullScreen
			referrerPolicy="no-referrer-when-downgrade"
			src={url}
			className="w-full"
		/>
	)
}