type Props = {
	lat: number,
	lng: number,
}

export default function Address({ lat, lng }: Props) {
	return (
		<iframe
			width="600"
			height="450"
			style={{ border: 0 }}
			loading="lazy"
			allowFullScreen
			referrerPolicy="no-referrer-when-downgrade"
			src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${lat},${lng}&maptype=satellite&zoom=15`}>
		</iframe>
	)
}